// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu } from 'lucide-react';
import NavLink from './NavLink';

const Navbar = () => { // No currentUserName prop needed as login/user switching is removed
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <ShieldCheck className="icon" />
        <Link to="/" className="text">BoldChain</Link> {/* Brand links to Home page */}
      </div>
      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/register-identity">Register Identity</NavLink>
        <NavLink to="/get-addon">Get Add-on</NavLink>
        <NavLink to="/team">Our Team</NavLink>
      </div>
      <div className="navbar-auth">
        {/* Removed username display and Switch User button as the demo client is removed. */}
        {/* If login functionality is added for the marketing site later, this can be re-introduced. */}
        <Menu className="navbar-menu-icon" /> {/* Mobile menu icon */}
      </div>
    </nav>
  );
};

export default Navbar;
