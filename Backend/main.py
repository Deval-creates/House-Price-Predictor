from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

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
