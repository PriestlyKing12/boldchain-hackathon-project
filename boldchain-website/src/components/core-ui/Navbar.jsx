    // src/components/core-ui/Navbar.jsx
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { ShieldCheck, Menu } from 'lucide-react';
    // NavLink is now in shared components
    import NavLink from '../shared/NavLink';

    const Navbar = ({ currentUserName }) => {
      return (
        <nav className="navbar">
          <div className="navbar-brand">
            <ShieldCheck className="icon" />
            <Link to="/" className="text">BoldChain</Link>
          </div>
          <div className="navbar-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/features">Features</NavLink>
            {/* NEW: Link to the BoldChain Mail solution dashboard */}
            <NavLink to="/mail">BoldChain Mail</NavLink> 
            <NavLink to="/register-identity">Register Identity</NavLink>
            <NavLink to="/get-addon">Get Add-on</NavLink>
            <NavLink to="/team">Our Team</NavLink>
          </div>
          <div className="navbar-auth">
            {currentUserName && currentUserName !== "Guest" && (
                <span className="navbar-username">{currentUserName}</span>
            )}
            {/* This button will eventually link to a proper login page for the Mail client */}
            <Link to="/mail" className="navbar-switch-user">
                Launch Mail Client
            </Link>
            <Menu className="navbar-menu-icon" />
          </div>
        </nav>
      );
    };

    export default Navbar;
    