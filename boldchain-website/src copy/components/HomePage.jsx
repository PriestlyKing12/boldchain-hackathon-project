// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Lock } from 'lucide-react'; 

const HomePage = () => (
  <div className="max-w-6xl mx-auto px-6 py-16 text-center hero-section">
    <h1 className="hero-headline">
      <span>End the Era of</span>
      <span>Email Fraud with</span>
      <span style={{ color: '#00f0ff', textShadow: '0 0 15px rgba(0,240,255,0.8)' }}>BoldChain</span>
    </h1>
    <p className="hero-subheadline">
      Tailored for enterprises, BoldChain revolutionizes email security by leveraging cryptographic sender verification and decentralized identity.
    </p>
    <div className="flex justify-center space-x-4 mb-12">
      <Link 
        to="/register-identity" // Link changed from /demo to /register-identity
        className="btn-primary-hero" 
      >
        <Zap className="mr-2" /> Register Your Identity
      </Link>
      <Link 
        to="/features" 
        className="btn-secondary-hero" 
      >
        <Lock className="mr-2" /> Learn More
      </Link>
    </div>

    {/* Value Proposition Card Section (Glassmorphic) */}
    <div className="card">
      <h2 className="text-3xl font-bold mb-6">Why BoldChain?</h2> 
      <div className="home-features-grid gap-8">
        {/* Feature 1: Unrivaled Security */}
        <div className="flex-col items-center p-4 feature-card">
          <img 
            src="https://cdn.pixabay.com/photo/2020/02/15/16/50/security-4851428_1280.jpg" 
            alt="Unrivaled Security - Lock Icon" 
            className="feature-card-image" 
            onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/160x160/0b122b/00f0ff?text=Security'}} 
          />
          <h3 className="text-xl font-bold mb-2">Unrivaled Security</h3>
          <p className="text-center">Cryptographic proof eliminates phishing, impersonation, and tampering.</p>
        </div>
        
        {/* Feature 2: Decentralized Trust */}
        <div className="flex-col items-center p-4 feature-card">
          <img 
            src="https://media.istockphoto.com/id/1367327123/photo/decentralized-autonomous-organization-dao-3d-illustration.jpg?s=1024x1024&w=is&k=20&c=HGE0EMYT6tHeYWk6Ar0jTQScrrwJ7RVnKf18fNnFnU=" 
            alt="Decentralized Trust - DAO/Blockchain" 
            className="feature-card-image"
            onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/160x160/0b122b/00ff8c?text=Decentralized'}} 
          />
          <h3 className="text-xl font-bold mb-2">Decentralized Trust</h3>
          <p className="text-center">Identities verified on an immutable blockchain, no central authority to breach.</p>
        </div>
        
        {/* Feature 3: Seamless Integration */}
        <div className="flex-col items-center p-4 feature-card">
          <img 
            src="https://cdn.pixabay.com/photo/2023/01/03/08/12/bitcoin-7693848_1280.png" 
            alt="Seamless Integration - Network Connections" 
            className="feature-card-image"
            onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/160x160/0b122b/00f0ff?text=Integration'}} 
          />
          <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
          <p className="text-center">Easily integrates into existing clients like Outlook and Gmail.</p>
        </div>
      </div>
    </div>
  </div>
);

export default HomePage;
