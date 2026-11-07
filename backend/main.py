import sys
import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

# Add backend directory to path to enable clean imports regardless of execution directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, get_db
from models import Property as PropertyModel, ContactSubmission as ContactModel
from schemas import Property as PropertySchema, ContactSubmissionCreate

# Create tables in the SQLite database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kedami (ቀዳሚ) Real Estate API",
    description="Ethiopia's premier property search engine for Addis Ababa and Adama using SQLite and FastAPI."
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/properties", response_model=List[PropertySchema])
def get_properties(
    city: Optional[str] = None,
    purpose: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bhk: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PropertyModel)
    
    if city:
        city_filter = f"%{city}%"
        query = query.filter(
            PropertyModel.city.ilike(city_filter) |
            (PropertyModel.city_am.isnot(None) & PropertyModel.city_am.ilike(city_filter))
        )
    if purpose:
        query = query.filter(PropertyModel.purpose == purpose.lower())
    if property_type:
        pt = property_type.lower()
        if pt in ["house", "hause"]:
            query = query.filter(PropertyModel.property_type.in_(["house", "hause"]))
        else:
            query = query.filter(PropertyModel.property_type == pt)
    if bhk is not None:
        query = query.filter(PropertyModel.bhk == bhk)
    if min_price is not None:
        query = query.filter(PropertyModel.price >= min_price)
    if max_price is not None:
        query = query.filter(PropertyModel.price <= max_price)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            PropertyModel.title.ilike(search_filter) | 
            (PropertyModel.title_am.isnot(None) & PropertyModel.title_am.ilike(search_filter)) |
            PropertyModel.locality.ilike(search_filter) | 
            (PropertyModel.locality_am.isnot(None) & PropertyModel.locality_am.ilike(search_filter)) |
            PropertyModel.description.ilike(search_filter) |
            (PropertyModel.description_am.isnot(None) & PropertyModel.description_am.ilike(search_filter)) |
            PropertyModel.amenities.ilike(search_filter) |
            (PropertyModel.amenities_am.isnot(None) & PropertyModel.amenities_am.ilike(search_filter))
        )
        
    return query.all()

@app.get("/api/properties/{property_id}", response_model=PropertySchema)
def get_property(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(PropertyModel).filter(PropertyModel.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop

@app.post("/api/properties/{property_id}/contact")
def contact_agent(property_id: int, contact: ContactSubmissionCreate, db: Session = Depends(get_db)):
    prop = db.query(PropertyModel).filter(PropertyModel.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db_submission = ContactModel(
        property_id=property_id,
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        message=contact.message
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    return {
        "status": "success",
        "message": "መልእክትዎ በተሳካ ሁኔታ ደርሷል! የአካባቢው የሪል እስቴት ባለሙያ በቅርቡ ያነጋግርዎታል። (Your enquiry has been successfully submitted! A local property consultant will reach out to you shortly.)",
        "submission_id": db_submission.id
    }
