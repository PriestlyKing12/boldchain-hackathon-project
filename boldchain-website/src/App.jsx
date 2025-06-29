// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // For Firestore database

// Core UI Components
import Navbar from './components/core-ui/Navbar';
import Footer from './components/core-ui/Footer';
import MessageBox from './components/core-ui/MessageBox';

// Marketing Pages
import HomePage from './components/marketing/HomePage';
import FeaturesPage from './components/marketing/FeaturesPage';
import TeamPage from './components/marketing/TeamPage';
import GetAddonPage from './components/marketing/GetAddonPage';
import RegisterPage from './components/marketing/RegisterPage'; // For marketing site identity registration

// Solution Pages (Mail Client & Auth)
import LoginPage from './components/solution/LoginPage';
import RegisterClientUserPage from './components/solution/RegisterClientUserPage'; // For email client registration
import InboxDashboard from './components/solution/InboxDashboard';

// --- Firebase Initialization and Global Instances ---
// These variables are declared outside the App component to ensure Firebase is initialized only once
let app;
let auth;
let db;
let appId; // Global variable for the current app ID

// Initialize Firebase only once
// Ensure that __firebase_config is defined (from Canvas environment) and app is not already initialized
if (typeof __firebase_config !== 'undefined' && !app) {
  try {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app); // Initialize Firestore
    appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Use provided app ID
    console.log("Firebase App Initialized successfully!");
    console.log("Firestore DB Initialized successfully!");
    console.log("App ID:", appId);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    // Fallback or provide dummy objects for graceful degradation if initialization fails
    auth = { currentUser: null, onAuthStateChanged: () => {} };
    db = {};
    appId = 'firebase-init-failed';
  }
} else if (!app) { // Case where __firebase_config is undefined (e.g., local dev without Codespaces)
  console.warn("Firebase config not found. Running in a limited mode. Authentication and persistence will not work.");
  // Provide dummy auth and db objects
  auth = { currentUser: null, onAuthStateChanged: () => {} };
  db = {};
  appId = 'no-firebase-app';
}


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // State to track when Firebase Auth listener is ready
  const [message, setMessage] = useState(null); // { show: boolean, type: string, title: string, message: string }

  // Authentication state listener and initial sign-in logic
  useEffect(() => {
    // Only proceed if Firebase Auth is available
    if (!auth || !db) {
      console.warn("Auth or DB not initialized, skipping auth state listener.");
      setIsAuthReady(true); // Treat as ready if Firebase isn't configured at all
      return;
    }

    // Set up the Firebase Auth state change listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in. Get ID token and update currentUser state.
        const idToken = await user.getIdToken();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0], // Use displayName or derive from email
          token: idToken, // Store the ID token
        });
        console.log("onAuthStateChanged: User logged in:", user.email);
      } else {
        // User is signed out. Clear currentUser state.
        setCurrentUser(null);
        console.log("onAuthStateChanged: User logged out.");
      }
      setIsAuthReady(true); // Mark auth listener as ready after its first check
    });

    // Attempt initial sign-in with custom token if available (for Codespaces environment)
    const initialSignIn = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
          console.log("App.jsx: Signed in with custom token!");
        } catch (error) {
          console.error("App.jsx: Error signing in with custom token:", error);
          // Fallback to anonymous sign-in if custom token fails (important for Firebase rules)
          try {
            await signInAnonymously(auth);
            console.log("App.jsx: Signed in anonymously due to custom token failure or absence.");
          } catch (anonError) {
            console.error("App.jsx: Error signing in anonymously:", anonError);
          }
        }
      } else {
        // If no custom token is provided (e.g., local development without Codespaces token)
        try {
          await signInAnonymously(auth);
          console.log("App.jsx: Signed in anonymously as no initial auth token was provided.");
        } catch (anonError) {
          console.error("App.jsx: Error signing in anonymously:", anonError);
        }
      }
    };
    initialSignIn();

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs only once on component mount

  // Memoized callback for displaying messages
  const showMessageBox = useCallback((type, title, message) => {
    setMessage({ show: true, type, title, message });
    setTimeout(() => {
      setMessage(null); // Auto-hide after 5 seconds
    }, 5000);
  }, []);

  // Callback for successful login (updates App.jsx state based on Firebase user object)
  const handleLoginSuccess = useCallback((user) => {
    setCurrentUser(user);
    showMessageBox('success', 'Login Successful!', `Welcome back, ${user.name || user.email}!`);
    console.log('App.jsx handleLoginSuccess: currentUser state updated for', user.email);
  }, [showMessageBox]);

  // Callback for logout (uses Firebase signOut)
  const handleLogout = useCallback(async () => {
    if (!auth) return; // Ensure auth object exists before trying to sign out

    console.log('App.jsx handleLogout: Initiating Firebase signOut...');
    try {
      await signOut(auth); // Firebase signOut handles clearing session
      // onAuthStateChanged listener will automatically set currentUser to null
    } catch (error) {
      console.error("App.jsx handleLogout: Firebase signOut failed:", error);
      showMessageBox('error', 'Logout Error', error.message || 'Failed to log out from Firebase.');
    }
  }, [showMessageBox]);


  // Only render the application once Firebase authentication state has been initialized
  // This prevents issues where components try to access currentUser before it's set
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-blue-400">
        <svg className="animate-spin h-8 w-8 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading application...
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {message && (
          <MessageBox
            type={message.type}
            title={message.title}
            description={message.description}
            onClose={() => setMessage(null)}
          />
        )}
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main>
          <Routes>
            {/* Marketing Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/get-addon" element={<GetAddonPage />} />
            <Route
                path="/register-identity"
                element={<RegisterPage showMessageBox={showMessageBox} />}
            />

            {/* Authentication Routes for BoldChain Mail Client */}
            <Route
                path="/login"
                element={<LoginPage showMessageBox={showMessageBox} onLoginSuccess={handleLoginSuccess} auth={auth} />}
            />
            <Route
                path="/register-client"
                element={<RegisterClientUserPage showMessageBox={showMessageBox} auth={auth} />}
            />

            {/* Mail Client Route (Protected) */}
            <Route
                path="/mail"
                element={
                    <PrivateRoute isLoggedIn={!!currentUser}> {/* Use !!currentUser to convert to boolean */}
                            <InboxDashboard
                                currentUser={currentUser}
                                token={currentUser?.token} // Pass ID token
                                showMessageBox={showMessageBox}
                                db={db} // Pass Firestore instance
                                appId={appId} // Pass the global app ID
                            />
                    </PrivateRoute>
                }
            />

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


// PrivateRoute component to protect routes (ensure it's defined within the same file or imported)
function PrivateRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
