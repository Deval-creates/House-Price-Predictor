from sqlalchemy import Column, Integer, String, ForeignKey, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)
    
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(String, nullable=False)  # Unique identifier for the property
    location = Column(String)
    price = Column(Float)
    total_rooms = Column(Float)
    total_bedrooms = Column(Float)
    population = Column(Float)
    median_income = Column(Float)
    ocean_proximity = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    
    user = relationship("User", back_populates="favorites")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'property_id', name='unique_user_property'),
    )