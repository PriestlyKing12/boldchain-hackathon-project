    // src/components/core-ui/Footer.jsx
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { ShieldCheck, Mail, Phone, Globe } from 'lucide-react';

    const Footer = () => {
      return (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>
                <ShieldCheck className="icon" /> BoldChain
              </h3>
              <p>
                Securing digital trust in every email, powered by decentralized identity.
              </p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/register-identity">Register Identity</Link></li>
                <li><Link to="/get-addon">Get Add-on</Link></li>
                <li><Link to="/team">Our Team</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <ul>
                <li><Mail className="icon" /> info@boldchain.com</li>
                <li><Phone className="icon" /> +1 (555) 123-4567</li>
                <li><Globe className="icon" /> Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2025 BoldChain. All rights reserved.
          </div>
        </footer>
      );
    };

    export default Footer;
    