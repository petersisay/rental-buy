from pydantic import BaseModel, Field
from typing import Optional

class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    city: str
    locality: str
    price: float
    price_formatted: str
    purpose: str = Field(..., description="Must be 'rent' or 'buy'")
    property_type: str = Field(..., description="Must be 'flat' or 'house'")
    bhk: int
    bathrooms: int
    area: int
    furnishing: str
    image_url: Optional[str] = None
    amenities: Optional[str] = None

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
