    // src/App.jsx
    import React, { useState, useCallback } from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

    // Core UI Components (from src/components/core-ui)
    import MessageBox from './components/core-ui/MessageBox';
    import Navbar from './components/core-ui/Navbar';
    import Footer from './components/core-ui/Footer';

    // Marketing Page Components (from src/components/marketing)
    import HomePage from './components/marketing/HomePage';
    import FeaturesPage from './components/marketing/FeaturesPage';
    import RegisterPage from './components/marketing/RegisterPage';
    import GetAddonPage from './components/marketing/GetAddonPage';
    import TeamPage from './components/marketing/TeamPage';

    // NEW: Solution Components (from src/components/solution)
    import InboxDashboard from './components/solution/InboxDashboard';


    // --- Main Website App Component (Production-Ready Structure) ---
    const WebsiteApp = () => {
      // Message box state for app-wide notifications
      const [messageBox, setMessageBox] = useState({ show: false, type: '', title: '', message: '' });
      
      const showAppMessageBox = useCallback((type, title, message) => {
        setMessageBox({ show: true, type, title, message });
      }, []);

      const closeAppMessageBox = useCallback(() => {
        setMessageBox({ show: false, type: '', title: '', message: '' });
      }, []);

      // In a production system, currentUserName and authentication status
      // would come from a global authentication context or hook (e.g., useAuth()).
      // For now, it's a placeholder.
      const currentUserName = "Guest"; 

      return (
        <Router>
          <div className="app-container">
            <MessageBox {...messageBox} onClose={closeAppMessageBox} />
            <Navbar currentUserName={currentUserName} />
            <main>
              <Routes>
                {/* Marketing Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route 
                    path="/register-identity" 
                    element={<RegisterPage showMessageBox={showAppMessageBox} />} 
                />
                <Route path="/get-addon" element={<GetAddonPage />} />
                <Route path="/team" element={<TeamPage />} />
                
                {/* NEW: Route for the BoldChain Mail Solution */}
                {/* In a real app, this route might be protected by authentication */}
                <Route 
                    path="/mail" 
                    element={
                        <div className="h-full-minus-header"> {/* Apply class for correct height */}
                            <InboxDashboard showMessageBox={showAppMessageBox} />
                        </div>
                    } 
                />

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
    