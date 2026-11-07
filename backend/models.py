from sqlalchemy import Column, Integer, String, Float, Text
try:
    from .database import Base
except ImportError:
    from database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    title_am = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    description_am = Column(Text, nullable=True)
    city = Column(String, nullable=False, index=True)  # Addis Ababa, Adama
    city_am = Column(String, nullable=True)           # አዲስ አበባ, አዳማ
    locality = Column(String, nullable=False)         # Bole, CMC, Dembela, etc.
    locality_am = Column(String, nullable=True)       # ቦሌ, ሲኤምሲ, ደምበላ, etc.
    price = Column(Float, nullable=False, index=True)  # Numeric value in ETB
    price_formatted = Column(String, nullable=False)   # E.g. "18,500,000 ETB" or "45,000 ETB/mo"
    price_formatted_am = Column(String, nullable=True) # E.g. "18,500,000 ብር" or "45,000 ብር/ወር"
    purpose = Column(String, nullable=False, index=True)  # rent, buy
    property_type = Column(String, nullable=False, index=True)  # flat, house
    bhk = Column(Integer, nullable=False, index=True)
    bathrooms = Column(Integer, nullable=False)
    area = Column(Integer, nullable=False)  # in m²
    furnishing = Column(String, nullable=False)  # Fully Furnished, Semi-Furnished, Unfurnished
    furnishing_am = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    amenities = Column(String, nullable=True)  # Comma-separated list e.g., "Backup Generator, Water Tank"
    amenities_am = Column(String, nullable=True)

class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    message = Column(Text, nullable=True)
