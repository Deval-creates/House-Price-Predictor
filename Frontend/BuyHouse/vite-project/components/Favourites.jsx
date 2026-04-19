import React, { useState, useEffect } from 'react';
import { getFavourites, removeFavourite } from '../src/api/favourite';
import { isAuthenticated } from '../src/api/auth';
import { useToast } from './ToastContainer';
import './Favourites.css';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    if (!isAuthenticated()) {
      setError("Please login to view your favourites");
      setLoading(false);
      return;
    }

    try {
      const data = await getFavourites();
      setFavourites(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load favourites");
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    try {
      await removeFavourite(propertyId);
      // Remove from local state
      setFavourites(favourites.filter(fav => fav.property_id !== propertyId));
      toast.success('Removed from favourites');
    } catch (err) {
      toast.error(err.message || 'Failed to remove favourite');
    }
  };

  const handleBackToHome = () => {
    window.location.hash = ''; // Navigate back to home
  };

  if (loading) {
    return (
      <div className="favourites-container">
        <div className="loading">Loading your favourites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favourites-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleBackToHome} className="back-btn">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="favourites-container">
      <div className="favourites-header">
        <button onClick={handleBackToHome} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
        <h1>Your Favourites</h1>
        <p className="subtitle">{favourites.length} {favourites.length === 1 ? 'property' : 'properties'} saved</p>
      </div>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2>No favourites yet</h2>
          <p>Start exploring and save your favorite properties!</p>
          <button onClick={handleBackToHome} className="explore-btn">Explore Properties</button>
        </div>
      ) : (
        <div className="favourites-grid">
          {favourites.map((property) => (
            <div key={property.id} className="favourite-card">
              <div className="card-content">
                <div className="property-header">
                  <h3>{property.location}</h3>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(property.property_id)}
                    title="Remove from favourites"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff385c" stroke="#ff385c" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                <div className="property-details">
                  <div className="detail-row">
                    <span className="label">Price:</span>
                    <span className="value price">${property.price.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Rooms:</span>
                    <span className="value">{property.total_rooms}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Bedrooms:</span>
                    <span className="value">{property.total_bedrooms}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Population:</span>
                    <span className="value">{property.population.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Median Income:</span>
                    <span className="value">${property.median_income.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ocean Proximity:</span>
                    <span className="value">{property.ocean_proximity}</span>
                  </div>
                  {property.latitude && property.longitude && (
                    <div className="detail-row">
                      <span className="label">Coordinates:</span>
                      <span className="value">{property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
