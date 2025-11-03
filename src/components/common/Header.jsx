import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileBtnRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon">🏠</div>
          <h2>Yaba-HostelHub</h2>
        </Link>
        
        <button
          ref={mobileBtnRef}
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-nav"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

  <nav id="main-nav" className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/complaints" 
                className={`nav-link ${isActiveLink('/complaints') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Complaints
              </Link>
              <Link 
                to="/lost-found" 
                className={`nav-link ${isActiveLink('/lost-found') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Lost & Found
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${isActiveLink('/admin') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              <div className="user-menu" role="region" aria-label="User menu">
                <div className="user-avatar">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.fullName}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <Link
                  to="/profile"
                  className="btn btn-outline btn-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn btn-outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;