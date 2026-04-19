from fastapi import FastAPI, HTTPException
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import SessionLocal, engine
import models
from schemas import UserCreate, FavoriteCreate, FavoriteResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from fastapi import Depends
from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = joblib.load("../ML_Model/house_model.pkl")
@app.on_event("startup")
def startup():
    models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(models.User).filter(models.User.email == user.email).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed = hash_password(user.password)

        new_user = models.User(email=user.email, password=hashed)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create JWT token
        token = create_access_token({"user_id": new_user.id, "email": new_user.email})

        return {
            "message": "User created successfully",
            "user_id": new_user.id,
            "token": token
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Signup error: {str(e)}")

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    token = create_access_token({"user_id": db_user.id, "email": db_user.email})

    return {
        "user_id": db_user.id,
        "token": token
    }


# New Favourites Endpoints
@app.post("/favourites", response_model=dict)
def add_favourite(
    data: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    """Add a property to user's favourites"""
    try:
        new_fav = models.Favorite(
            user_id=current_user_id,
            property_id=data.property_id,
            location=data.location,
            price=data.price,
            total_rooms=data.total_rooms,
            total_bedrooms=data.total_bedrooms,
            population=data.population,
            median_income=data.median_income,
            ocean_proximity=data.ocean_proximity,
            latitude=data.latitude,
            longitude=data.longitude
        )
        db.add(new_fav)
        db.commit()
        db.refresh(new_fav)
        
        return {"message": "Added to favourites", "id": new_fav.id}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Already in favourites")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding favourite: {str(e)}")

@app.get("/favourites", response_model=List[FavoriteResponse])
def get_favourites(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    """Get all favourites for the current user"""
    favourites = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user_id
    ).all()
    
    return favourites

@app.delete("/favourites/{property_id}")
def remove_favourite(
    property_id: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    """Remove a property from user's favourites"""
    favourite = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user_id,
        models.Favorite.property_id == property_id
    ).first()
    
    if not favourite:
        raise HTTPException(status_code=404, detail="Favourite not found")
    
    db.delete(favourite)
    db.commit()
    
    return {"message": "Removed from favourites"}

@app.get("/favourites/check/{property_id}")
def check_favourite(
    property_id: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    """Check if a property is in user's favourites"""
    favourite = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user_id,
        models.Favorite.property_id == property_id
    ).first()
    
    return {"is_favourite": favourite is not None}


# Initialize geocoder
geolocator = Nominatim(user_agent="house_price_predictor")

class PredictionInput(BaseModel):
    location: str
    total_rooms: float
    total_bedrooms: float
    population: float
    median_income: float
    ocean_proximity: str

@app.get("/")
def home():
    return {"message": "House Price Prediction API"}

@app.post("/predict")
def predict(data: PredictionInput):
    try:
        # Convert location to latitude and longitude
        try:
            location = geolocator.geocode(data.location + ", California, USA")
            if location:
                latitude = location.latitude
                longitude = location.longitude
            else:
                # Default to California center if location not found
                latitude = 36.7783
                longitude = -119.4179
        except (GeocoderTimedOut, GeocoderServiceError):
            # Default to California center if geocoding fails
            latitude = 36.7783
            longitude = -119.4179

        # Calculate derived features
        households = data.total_bedrooms / 2.5  # Approximate households
        housing_median_age = 28.0  # Default median age
        
        rooms_per_household = data.total_rooms / households if households > 0 else 5.5
        bedrooms_per_room = data.total_bedrooms / data.total_rooms if data.total_rooms > 0 else 0.2
        population_per_household = data.population / households if households > 0 else 2.7

        # One-hot encode ocean_proximity
        ocean_proximity_mapping = {
            "<1H OCEAN": [1, 0, 0, 0, 0],
            "INLAND": [0, 1, 0, 0, 0],
            "ISLAND": [0, 0, 1, 0, 0],
            "NEAR BAY": [0, 0, 0, 1, 0],
            "NEAR OCEAN": [0, 0, 0, 0, 1]
        }
        
        ocean_encoded = ocean_proximity_mapping.get(data.ocean_proximity, [0, 0, 0, 0, 1])

        # Create feature array matching the model's expected input
        # Order: longitude, latitude, housing_median_age, total_rooms, total_bedrooms, 
        #        population, households, median_income, 
        #        ocean_proximity_<1H OCEAN, ocean_proximity_INLAND, ocean_proximity_ISLAND,
        #        ocean_proximity_NEAR BAY, ocean_proximity_NEAR OCEAN,
        #        rooms_per_household, bedrooms_per_room, population_per_household
        features = np.array([[
            longitude,
            latitude,
            housing_median_age,
            data.total_rooms,
            data.total_bedrooms,
            data.population,
            households,
            data.median_income,
            *ocean_encoded,
            rooms_per_household,
            bedrooms_per_room,
            population_per_household
        ]])

        # Make prediction
        prediction = model.predict(features)
        
        return {
            "price": float(prediction[0]),
            "location_coords": {
                "latitude": latitude,
                "longitude": longitude
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
