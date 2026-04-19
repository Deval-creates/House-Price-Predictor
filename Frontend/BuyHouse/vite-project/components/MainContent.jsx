import React, { useState, useEffect } from 'react';
import { toggleFavourite, checkFavourite } from '../src/api/favourite';
import { isAuthenticated } from '../src/api/auth';
import { useToast } from './ToastContainer';
import './MainContent.css';

const MainContent = () => {
  const toast = useToast();
  
  // State for filtering
  const [filteredCategory, setFilteredCategory] = useState(null);
  
  // Premium Houses ($250,000 - $500,000)
  const premiumHouses = [
    {
      id: 1,
      image: '/Premium Houses/pexels-daydream-753072845-30897780.jpg',
      location: 'Malibu, California',
      price: '$450,000',
      ownerNumber: '+1 (555) 123-4567',
      rating: 4.97
    },
    {
      id: 2,
      image: '/Premium Houses/pexels-justyzvidz-9952001.jpg',
      location: 'Beverly Hills, California',
      price: '$485,000',
      ownerNumber: '+1 (555) 234-5678',
      rating: 4.95
    },
    {
      id: 3,
      image: '/Premium Houses/pexels-jonathanborba-5563473.jpg',
      location: 'Newport Beach, California',
      price: '$420,000',
      ownerNumber: '+1 (555) 345-6789',
      rating: 4.92
    },
    {
      id: 4,
      image: '/Premium Houses/pexels-jaredvandermeer-5517853.jpg',
      location: 'Santa Monica, California',
      price: '$395,000',
      ownerNumber: '+1 (555) 456-7890',
      rating: 4.89
    },
    {
      id: 5,
      image: '/Premium Houses/pexels-curtis-adams-1694007-8583907.jpg',
      location: 'Laguna Beach, California',
      price: '$475,000',
      ownerNumber: '+1 (555) 567-8901',
      rating: 4.94
    },
    {
      id: 6,
      image: '/Premium Houses/pexels-binyaminmellish-186077.jpg',
      location: 'Palo Alto, California',
      price: '$500,000',
      ownerNumber: '+1 (555) 678-9012',
      rating: 4.96
    },
    {
      id: 7,
      image: '/Premium Houses/pexels-curtis-adams-1694007-3990589.jpg',
      location: 'Carmel-by-the-Sea, California',
      price: '$380,000',
      ownerNumber: '+1 (555) 789-0123',
      rating: 4.91
    },
    {
      id: 8,
      image: '/Premium Houses/pexels-edanur-sonkaya-194758981-33035484.jpg',
      location: 'La Jolla, California',
      price: '$465,000',
      ownerNumber: '+1 (555) 890-1234',
      rating: 4.93
    },
    {
      id: 9,
      image: '/Premium Houses/pexels-pixabay-280229.jpg',
      location: 'Sausalito, California',
      price: '$430,000',
      ownerNumber: '+1 (555) 901-2345',
      rating: 4.90
    },
    {
      id: 10,
      image: '/Premium Houses/pexels-robertkso-36086367.jpg',
      location: 'Monterey, California',
      price: '$410,000',
      ownerNumber: '+1 (555) 012-3456',
      rating: 4.88
    }
  ];

  // Mid Range Houses ($150,000 - $250,000)
  const midRangeHouses = [
    {
      id: 11,
      image: '/Mid Range Houses/pexels-ethan-strunk-2884611-5110056.jpg',
      location: 'Sacramento, California',
      price: '$220,000',
      ownerNumber: '+1 (555) 111-2222',
      rating: 4.85
    },
    {
      id: 12,
      image: '/Mid Range Houses/pexels-ninobur-18905816.jpg',
      location: 'Fresno, California',
      price: '$195,000',
      ownerNumber: '+1 (555) 222-3333',
      rating: 4.82
    },
    {
      id: 13,
      image: '/Mid Range Houses/pexels-petra-nesti-1766376-37013077.jpg',
      location: 'Modesto, California',
      price: '$175,000',
      ownerNumber: '+1 (555) 333-4444',
      rating: 4.80
    },
    {
      id: 14,
      image: '/Mid Range Houses/pexels-robertkso-13084497.jpg',
      location: 'Stockton, California',
      price: '$165,000',
      ownerNumber: '+1 (555) 444-5555',
      rating: 4.78
    },
    {
      id: 15,
      image: '/Mid Range Houses/pexels-curtis-adams-1694007-5071130.jpg',
      location: 'Riverside, California',
      price: '$210,000',
      ownerNumber: '+1 (555) 555-6666',
      rating: 4.84
    },
    {
      id: 16,
      image: '/Mid Range Houses/pexels-curtis-adams-1694007-8583932.jpg',
      location: 'Bakersfield, California',
      price: '$185,000',
      ownerNumber: '+1 (555) 666-7777',
      rating: 4.81
    },
    {
      id: 17,
      image: '/Mid Range Houses/pexels-dmitry93-32711440.jpg',
      location: 'Chico, California',
      price: '$200,000',
      ownerNumber: '+1 (555) 777-8888',
      rating: 4.83
    },
    {
      id: 18,
      image: '/Mid Range Houses/pexels-ibidsy-8894808.jpg',
      location: 'Visalia, California',
      price: '$155,000',
      ownerNumber: '+1 (555) 888-9999',
      rating: 4.77
    },
    {
      id: 19,
      image: '/Mid Range Houses/pexels-idean-azad-2150674828-35742592.jpg',
      location: 'Redding, California',
      price: '$190,000',
      ownerNumber: '+1 (555) 999-0000',
      rating: 4.79
    },
    {
      id: 20,
      image: '/Mid Range Houses/pexels-jasper-mendoza-61081629-17831870.jpg',
      location: 'Merced, California',
      price: '$170,000',
      ownerNumber: '+1 (555) 000-1111',
      rating: 4.76
    },
    {
      id: 21,
      image: '/Mid Range Houses/pexels-jordanr93-10586745.jpg',
      location: 'Turlock, California',
      price: '$180,000',
      ownerNumber: '+1 (555) 111-0000',
      rating: 4.75
    },
    {
      id: 22,
      image: '/Mid Range Houses/pexels-pixabay-259593.jpg',
      location: 'Vacaville, California',
      price: '$205,000',
      ownerNumber: '+1 (555) 222-1111',
      rating: 4.82
    },
    {
      id: 23,
      image: '/Mid Range Houses/pexels-strannik-sk-35764450.jpg',
      location: 'Manteca, California',
      price: '$160,000',
      ownerNumber: '+1 (555) 333-2222',
      rating: 4.74
    },
    {
      id: 24,
      image: '/Mid Range Houses/pexels-thiago-andrade-434377515-15303808.jpg',
      location: 'Hanford, California',
      price: '$150,000',
      ownerNumber: '+1 (555) 444-3333',
      rating: 4.73
    }
  ];

  // Low Range Houses ($20,000 - $100,000)
  const lowRangeHouses = [
    {
      id: 25,
      image: '/Low Range Houses/pexels-ambam-28896600.jpg',
      location: 'Barstow, California',
      price: '$85,000',
      ownerNumber: '+1 (555) 555-4444',
      rating: 4.65
    },
    {
      id: 26,
      image: '/Low Range Houses/pexels-arthousestudio-5016533.jpg',
      location: 'Needles, California',
      price: '$65,000',
      ownerNumber: '+1 (555) 666-5555',
      rating: 4.60
    },
    {
      id: 27,
      image: '/Low Range Houses/pexels-baris-turkoz-214377915-34871929.jpg',
      location: 'Blythe, California',
      price: '$55,000',
      ownerNumber: '+1 (555) 777-6666',
      rating: 4.58
    },
    {
      id: 28,
      image: '/Low Range Houses/pexels-dar-cat-67502350-9565378.jpg',
      location: 'Trona, California',
      price: '$45,000',
      ownerNumber: '+1 (555) 888-7777',
      rating: 4.55
    },
    {
      id: 29,
      image: '/Low Range Houses/pexels-introspectivedsgn-8266713.jpg',
      location: 'Calexico, California',
      price: '$75,000',
      ownerNumber: '+1 (555) 999-8888',
      rating: 4.62
    },
    {
      id: 30,
      image: '/Low Range Houses/pexels-irina-a-balashova-33210334.jpg',
      location: 'Clearlake, California',
      price: '$70,000',
      ownerNumber: '+1 (555) 000-9999',
      rating: 4.61
    },
    {
      id: 31,
      image: '/Low Range Houses/pexels-irina-spotkai-253751701-33591567.jpg',
      location: 'Avenal, California',
      price: '$50,000',
      ownerNumber: '+1 (555) 111-8888',
      rating: 4.57
    },
    {
      id: 32,
      image: '/Low Range Houses/pexels-ivanxolod-8748150.jpg',
      location: 'Wasco, California',
      price: '$60,000',
      ownerNumber: '+1 (555) 222-7777',
      rating: 4.59
    },
    {
      id: 33,
      image: '/Low Range Houses/pexels-natalinadmay-12231338.jpg',
      location: 'Delano, California',
      price: '$80,000',
      ownerNumber: '+1 (555) 333-6666',
      rating: 4.64
    },
    {
      id: 34,
      image: '/Low Range Houses/pexels-robertkso-20296321.jpg',
      location: 'Shafter, California',
      price: '$72,000',
      ownerNumber: '+1 (555) 444-5555',
      rating: 4.63
    },
    {
      id: 35,
      image: '/Low Range Houses/pexels-siarhei-kishkel-102050953-11653829.jpg',
      location: 'Tehachapi, California',
      price: '$90,000',
      ownerNumber: '+1 (555) 555-4444',
      rating: 4.66
    },
    {
      id: 36,
      image: '/Low Range Houses/pexels-thirdman-8469931.jpg',
      location: 'Ridgecrest, California',
      price: '$68,000',
      ownerNumber: '+1 (555) 666-3333',
      rating: 4.60
    },
    {
      id: 37,
      image: '/Low Range Houses/pexels-this-and-no-internet-25-288559-18385953.jpg',
      location: 'Boron, California',
      price: '$35,000',
      ownerNumber: '+1 (555) 777-2222',
      rating: 4.52
    },
    {
      id: 38,
      image: '/Low Range Houses/pexels-vitaliy-bratkov-903020757-33608337.jpg',
      location: 'California City, California',
      price: '$95,000',
      ownerNumber: '+1 (555) 888-1111',
      rating: 4.68
    }
  ];

  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(false);

  // Check for predicted price on mount
  useEffect(() => {
    // Try URL parameter first (works across different origins)
    const urlParams = new URLSearchParams(window.location.search);
    let predictedPrice = urlParams.get('price');
    
    // Fallback to localStorage (for same-origin scenarios)
    if (!predictedPrice) {
      predictedPrice = localStorage.getItem("predictedPrice");
    }
    
    console.log("MainContent mounted - checking for predicted price");
    console.log("URL parameter 'price':", urlParams.get('price'));
    console.log("localStorage 'predictedPrice':", localStorage.getItem("predictedPrice"));
    console.log("Using price:", predictedPrice);
    
    if (predictedPrice) {
      const price = parseFloat(predictedPrice);
      
      console.log("Parsed price:", price);
      
      // Determine category based on price
      let category = null;
      if (price >= 250000) {
        category = "premium";
      } else if (price >= 150000) {
        category = "mid";
      } else {
        category = "low";
      }
      
      console.log("Determined category:", category);
      
      setFilteredCategory(category);
      
      // Clean up
      localStorage.removeItem("predictedPrice");
      
      // Remove URL parameter by replacing history state
      if (urlParams.get('price')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // Show toast notification
      toast.info(`Showing ${category} range houses based on your prediction of $${price.toLocaleString()}`);
      
      console.log("✅ Filter applied successfully!");
    } else {
      console.log("No predicted price found - showing all houses");
    }
  }, []);

  // Load favourite status for all houses on mount
  useEffect(() => {
    if (isAuthenticated()) {
      loadFavouriteStatuses();
    }
  }, []);

  const loadFavouriteStatuses = async () => {
    const allHouses = [...premiumHouses, ...midRangeHouses, ...lowRangeHouses];
    const statuses = {};
    
    for (const house of allHouses) {
      try {
        const result = await checkFavourite(house.id.toString());
        statuses[house.id] = result.is_favourite;
      } catch (err) {
        statuses[house.id] = false;
      }
    }
    
    setFavorites(statuses);
  };

  const toggleFavorite = async (house, index) => {
    if (!isAuthenticated()) {
      toast.warning('Please login to add favourites');
      return;
    }

    setLoading(true);

    try {
      // Prepare property data for backend
      const propertyData = {
        property_id: house.id.toString(),
        location: house.location,
        price: parseFloat(house.price.replace(/[$,]/g, '')),
        total_rooms: 6, // Default values - you can make these dynamic
        total_bedrooms: 3,
        population: 1000,
        median_income: 50000,
        ocean_proximity: "NEAR OCEAN",
        latitude: null,
        longitude: null
      };

      await toggleFavourite(propertyData);
      
      // Update local state
      const isFavourited = !favorites[house.id];
      setFavorites(prev => ({
        ...prev,
        [house.id]: isFavourited
      }));

      if (isFavourited) {
        toast.success('Added to favourites ❤️');
      } else {
        toast.info('Removed from favourites');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update favourite');
    } finally {
      setLoading(false);
    }
  };

  const renderHouseCard = (house, index) => (
    <div key={house.id} className="house-card">
      <div className="card-image-container">
        <img src={house.image} alt={house.location} className="house-image" />
        <div className="card-overlay">
          <span className="guest-favorite">Guest favorite</span>
          <button 
            className={`favorite-btn ${favorites[house.id] ? 'active' : ''}`}
            onClick={() => toggleFavorite(house, index)}
            disabled={loading}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill={favorites[house.id] ? '#ff385c' : 'none'}
              stroke={favorites[house.id] ? '#ff385c' : 'white'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <div className="location-rating">
          <h3 className="location">{house.location}</h3>
          <div className="rating">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{house.rating}</span>
          </div>
        </div>
        
        <div className="card-details">
          <div className="detail-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{house.location}</span>
          </div>
          
          <div className="detail-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{house.ownerNumber}</span>
          </div>
          
          <div className="detail-item price">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="price-text">{house.price}</span>
          </div>
        </div>
        
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      {/* Debug Banner */}
      {filteredCategory && (
        <div style={{
          background: '#4CAF50',
          color: 'white',
          padding: '15px',
          textAlign: 'center',
          marginBottom: '20px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          🎯 Showing {filteredCategory.toUpperCase()} range houses based on your prediction
        </div>
      )}
      
      {/* Premium Houses Section */}
      {(!filteredCategory || filteredCategory === "premium") && (
        <div className="category-section">
          <div className="category-header">
            <h2 className="category-title">Premium Houses</h2>
            <p className="category-subtitle">Luxury properties ranging from $250,000 to $500,000</p>
          </div>
          <div className="cards-container">
            {premiumHouses.map((house, index) => renderHouseCard(house, index))}
          </div>
        </div>
      )}

      {/* Mid Range Houses Section */}
      {(!filteredCategory || filteredCategory === "mid") && (
        <div className="category-section">
          <div className="category-header">
            <h2 className="category-title">Mid Range Houses</h2>
            <p className="category-subtitle">Comfortable homes ranging from $150,000 to $250,000</p>
          </div>
          <div className="cards-container">
            {midRangeHouses.map((house, index) => renderHouseCard(house, index + premiumHouses.length))}
          </div>
        </div>
      )}

      {/* Low Range Houses Section */}
      {(!filteredCategory || filteredCategory === "low") && (
        <div className="category-section">
          <div className="category-header">
            <h2 className="category-title">Low Range Houses</h2>
            <p className="category-subtitle">Affordable properties ranging from $20,000 to $100,000</p>
          </div>
          <div className="cards-container">
            {lowRangeHouses.map((house, index) => renderHouseCard(house, index + premiumHouses.length + midRangeHouses.length))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
