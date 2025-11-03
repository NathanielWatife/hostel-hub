import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Yaba-HostelHub</h3>
          <p>
            Your all-in-one platform for hostel complaint management 
            and lost & found services. Making campus life easier and more organized.
          </p>
          <div className="social-links">
            <button type="button" className="social-link" aria-label="Facebook" onClick={() => window.open('https://facebook.com', '_blank')}>
              📘
            </button>
            <button type="button" className="social-link" aria-label="Twitter" onClick={() => window.open('https://twitter.com', '_blank')}>
              🐦
            </button>
            <button type="button" className="social-link" aria-label="Instagram" onClick={() => window.open('https://instagram.com', '_blank')}>
              📷
            </button>
            <button type="button" className="social-link" aria-label="LinkedIn" onClick={() => window.open('https://linkedin.com', '_blank')}>
              💼
            </button>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">🏠 Dashboard</a></li>
            <li><a href="/complaints">📝 Complaints</a></li>
            <li><a href="/lost-found">🔍 Lost & Found</a></li>
            <li><a href="/profile">👤 Profile</a></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contact Info</h4>
          <p>📍 Yabatech </p>
          <p>📞 +1 (555) 123-4567</p>
          <p>✉️ support@hostelhub.edu</p>
          <p>🕒 Mon-Fri: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
      
      <div className="footer-bottom">
  <p>&copy; 2024 Yaba-HostelHub. All rights reserved. | Built with ❤️ for better campus life</p>
      </div>
    </footer>
  );
};

export default Footer;