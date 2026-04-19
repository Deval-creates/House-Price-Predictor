from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str

class FavoriteCreate(BaseModel):
    property_id: str
    location: str
    price: float
    total_rooms: float
    total_bedrooms: float
    population: float
    median_income: float
    ocean_proximity: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FavoriteResponse(BaseModel):
    id: int
    property_id: str
    location: str
    price: float
    total_rooms: float
    total_bedrooms: float
    population: float
    median_income: float
    ocean_proximity: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    class Config:
        from_attributes = True