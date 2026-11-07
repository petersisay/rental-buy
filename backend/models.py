from sqlalchemy import Column, Integer, String, Float, Text
try:
    from .database import Base
except ImportError:
    from database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    city = Column(String, nullable=False, index=True)  # Bangalore, Mumbai
    locality = Column(String, nullable=False)
    price = Column(Float, nullable=False, index=True)  # Numeric value for sorting/filtering
    price_formatted = Column(String, nullable=False)   # E.g. "₹1.5 Crore" or "₹45,000/month"
    purpose = Column(String, nullable=False, index=True)  # rent, buy
    property_type = Column(String, nullable=False, index=True)  # flat, house
    bhk = Column(Integer, nullable=False, index=True)
    bathrooms = Column(Integer, nullable=False)
    area = Column(Integer, nullable=False)  # in sq.ft.
    furnishing = Column(String, nullable=False)  # Furnished, Semi-Furnished, Unfurnished
    image_url = Column(String, nullable=True)
    amenities = Column(String, nullable=True)  # Comma-separated list e.g., "Gym, Pool, Security"

class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    message = Column(Text, nullable=True)
