// src/App.jsx
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import modularized components
import MessageBox from './components/MessageBox';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import FeaturesPage from './components/FeaturesPage';
import RegisterPage from './components/RegisterPage';
import GetAddonPage from './components/GetAddonPage';
import TeamPage from './components/TeamPage';


// --- Main Website App Component (No Live Demo) ---
const WebsiteApp = () => {
  const [messageBox, setMessageBox] = useState({ show: false, type: '', title: '', message: '' });
  
  const showMessageBox = useCallback((type, title, message) => {
    setMessageBox({ show: true, type, title, message });
  }, []);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ show: false, type: '', title: '', message: '' });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <MessageBox {...messageBox} onClose={closeMessageBox} />
        <Navbar /> 
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route 
                path="/register-identity" 
                element={<RegisterPage showMessageBox={showMessageBox} />} 
            />
            <Route path="/get-addon" element={<GetAddonPage />} />
            <Route path="/team" element={<TeamPage />} />
            
            {/* Redirect any unknown paths back to the home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default WebsiteApp;
