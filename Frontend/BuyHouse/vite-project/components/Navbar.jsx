import React, { useState, useEffect } from 'react';
import './Navbar.css';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { isAuthenticated, logout } from '../src/api/auth';
import { useToast } from './ToastContainer';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check if user is logged in
    setLoggedIn(isAuthenticated());
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginForm(true);
    setShowSignUpForm(false);
    setDropdownOpen(false);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setShowSignUpForm(true);
    setShowLoginForm(false);
    setDropdownOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setLoggedIn(false);
    setDropdownOpen(false);
    toast.info('Logged out successfully. See you soon! 👋');
    setTimeout(() => {
      window.location.reload(); // Refresh to update UI
    }, 1000);
  };

  const handleFavouritesClick = (e) => {
    e.preventDefault();
    window.location.hash = 'favourites'; // Use hash navigation
  };

  const handleCloseLogin = () => {
    setShowLoginForm(false);
  };

  const handleCloseSignUp = () => {
    setShowSignUpForm(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    setLoggedIn(true);
  };

  const handleSignUpSuccess = () => {
    setShowSignUpForm(false);
    setLoggedIn(true);
  };

  const switchToLogin = () => {
    setShowSignUpForm(false);
    setShowLoginForm(true);
  };

  const switchToSignUp = () => {
    setShowLoginForm(false);
    setShowSignUpForm(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          <div className="dropdown-container">
            <button className="get-started-btn" onClick={toggleDropdown}>
              {loggedIn ? 'My Account' : 'Get Started'}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ marginLeft: '8px', transition: 'transform 0.3s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {loggedIn ? (
                  <>
                    <a href="#favourites" className="dropdown-item" onClick={handleFavouritesClick}>Your Favourites</a>
                    <a href="#logout" className="dropdown-item" onClick={handleLogout}>Logout</a>
                  </>
                ) : (
                  <>
                    <a href="#login" className="dropdown-item" onClick={handleLoginClick}>Login</a>
                    <a href="#signup" className="dropdown-item" onClick={handleSignUpClick}>Sign Up</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {showLoginForm && <LoginForm onClose={handleCloseLogin} onSwitchToSignUp={switchToSignUp} onLoginSuccess={handleLoginSuccess} />}
      {showSignUpForm && <SignUpForm onClose={handleCloseSignUp} onSwitchToLogin={switchToLogin} onSignUpSuccess={handleSignUpSuccess} />}
    </>
  );
};

export default Navbar;
