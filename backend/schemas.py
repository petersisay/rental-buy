from pydantic import BaseModel, Field
from typing import Optional

class PropertyBase(BaseModel):
    title: str
    title_am: Optional[str] = None
    description: Optional[str] = None
    description_am: Optional[str] = None
    city: str
    city_am: Optional[str] = None
    locality: str
    locality_am: Optional[str] = None
    price: float
    price_formatted: str
    price_formatted_am: Optional[str] = None
    purpose: str = Field(..., description="Must be 'rent' or 'buy'")
    property_type: str = Field(..., description="Must be 'flat' or 'house'")
    bhk: int
    bathrooms: int
    area: int
    furnishing: str
    furnishing_am: Optional[str] = None
    image_url: Optional[str] = None
    amenities: Optional[str] = None
    amenities_am: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int

    class Config:
        from_attributes = True

class ContactSubmissionCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: Optional[str] = None
