import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';

// Import Lucide React Icons
import { 
  Mail, Send, Inbox as InboxIcon, FileText, CheckCircle, XCircle, AlertCircle, KeyRound, User, ChevronLeft,
  Star, Clock, Trash, Folder, Search, Settings, HelpCircle, LayoutDashboard, Menu, ShieldCheck, Zap, Globe, Users, Code, Phone, UserPlus, Lock, Download, Fingerprint
} from 'lucide-react';

// --- Global BoldChain Simulation Functions and Data ---

/**
 * Global object to simulate blockchain-registered identities for the demo.
 * This is IN-MEMORY ONLY for quick demo, but the registration page modifies it.
 */
const initialRegisteredIdentities = {
  '0xdavidwalletaddress1234567890abcdef': 'david@energycorp.com',
  '0xalicewalletaddressabcdef1234567890': 'alice@energycorp.com',
  '0xbobwalletaddress0987654321fedcba987': 'bob@consulting.com',
};

/**
 * Mock User Profiles for the multi-user demo.
 * These IDs will be used to segregate localStorage data.
 */
const MOCK_USERS = [
  { id: 'user_david', name: 'David (Sender)', email: 'david@energycorp.com', wallet: '0xdavidwalletaddress1234567890abcdef' },
  { id: 'user_alice', name: 'Alice (Recipient)', email: 'alice@energycorp.com', wallet: '0xalicewalletaddressabcdef1234567890' },
  { id: 'user_bob', name: 'Bob (Recipient)', email: 'bob@consulting.com', wallet: '0xbobwalletaddress0987654321fedcba987' },
];

const canonicalizeEmail = (content) => {
  if (!content) return '';
  return content.replace(/\r\n/g, '\n').trim();
};

const hashEmail = async (content) => {
  if (!content) return '';
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
};

const simulateSignEmail = (emailHash, walletAddress) => {
  if (!emailHash || !walletAddress) return '';
  let simulatedCombinedInput = emailHash + walletAddress;
  let hash = 0;
  for (let i = 0; i < simulatedCombinedInput.length; i++) {
      const char = simulatedCombinedInput.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
  }
  return Math.abs(hash).toString(16);
};

const simulateBlockchainLookup = async (walletAddress, registeredIdentitiesMap) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(registeredIdentitiesMap[walletAddress.toLowerCase()] || null);
    }, 500);
  });
};

const simulateVerifySignature = (receivedSignature, emailHash, senderPublicKey) => {
  if (!receivedSignature || !emailHash || !senderPublicKey) return false;
  const reGeneratedSimulatedSignature = simulateSignEmail(emailHash, senderPublicKey);
  return receivedSignature === reGeneratedSimulatedSignature;
};

// --- Local Storage Utilities ---
const getEmailsFromLocalStorage = (userId) => {
  const data = localStorage.getItem(`boldchain_emails_${userId}`);
  return data ? JSON.parse(data) : { sent: [], received: [] };
};

const saveEmailsToLocalStorage = (userId, emails) => {
  localStorage.setItem(`boldchain_emails_${userId}`, JSON.stringify(emails));
};

// --- Common UI Components ---

const MessageBox = ({ show, type, title, message, onClose }) => {
  if (!show) return null;

  const typeClasses = {
    success: 'message-box-success',
    error: 'message-box-error',
    warning: 'message-box-warning',
    info: 'message-box-info',
  };

  const iconComponents = {
    success: <CheckCircle className="message-box-icon" />,
    error: <XCircle className="message-box-icon" />,
    warning: <AlertCircle className="message-box-icon" />,
    info: <Mail className="message-box-icon" />,
  };

  return (
    <div className="message-box-overlay">
      <div className={`message-box-content ${typeClasses[type]}`}>
        {iconComponents[type]}
        <h2 className="message-box-title">{title}</h2>
        <p className="message-box-message">{message}</p>
        <button
          onClick={onClose}
          className="message-box-button"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};

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
        <NavLink to="/demo">Live Demo</NavLink>
        <NavLink to="/register-identity">Register Identity</NavLink>
        <NavLink to="/get-addon">Get Add-on</NavLink>
        <NavLink to="/team">Our Team</NavLink>
      </div>
      <div className="navbar-auth">
        {currentUserName && (
            <span className="navbar-username">{currentUserName}</span>
        )}
        <Link to="/login" className="navbar-switch-user">
            Switch User
        </Link>
        <Menu className="navbar-menu-icon" />
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="navbar-link"
  >
    {children}
  </Link>
);


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
            <li><Link to="/demo">Live Demo</Link></li>
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

// --- Pages (Conceptual Content) ---

const HomePage = () => (
  <div className="max-w-6xl mx-auto px-6 py-16 text-center">
    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
      End the Era of Email Fraud with <span className="text-blue-700">BoldChain</span>
    </h1>
    <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
      Introducing a revolutionary approach to email security: cryptographic authenticity and integrity, powered by decentralized identity on the blockchain.
    </p>
    <div className="flex justify-center space-x-4 mb-12">
      <Link 
        to="/demo" 
        className="btn-primary"
      >
        <Zap className="mr-2" /> Live Demo
      </Link>
      <Link 
        to="/features" 
        className="btn-secondary"
      >
        <Code className="mr-2" /> Learn More
      </Link>
    </div>

    <div className="card">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Why BoldChain?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center p-4">
          <ShieldCheck className="w-16 h-16 text-green-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Unrivaled Security</h3>
          <p className="text-gray-600 text-center">Cryptographic proof eliminates phishing, impersonation, and tampering.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <Globe className="w-16 h-16 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Decentralized Trust</h3>
          <p className="text-gray-600 text-center">Identities verified on an immutable blockchain, removing single points of failure.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <LayoutDashboard className="w-16 h-16 text-orange-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
          <p className="text-gray-600 text-center">Works as an add-on for existing email clients like Outlook and Gmail.</p>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesPage = () => (
  <div className="max-w-6xl mx-auto px-6 py-16">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">BoldChain Features & How It Works</h1>
    <div className="space-y-12">
      {/* Feature 1: Cryptographic Email Fingerprinting */}
      <div className="flex flex-col md:flex-row items-center card">
        <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">1. Unforgeable Email Fingerprints</h2>
          <p className="text-gray-700 text-lg">
            Every outgoing email's content (subject, body, attachments) is transformed into a unique, fixed-length cryptographic hash – its digital "fingerprint." Even a single character change results in a completely different fingerprint, guaranteeing content integrity.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Fingerprint className="w-40 h-40 text-blue-400 opacity-75" />
        </div>
      </div>

      {/* Feature 2: Decentralized Identity Binding */}
      <div className="flex flex-col md:flex-row-reverse items-center card">
        <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-green-700 mb-4">2. Blockchain-Backed Sender Identity</h2>
          <p className="text-gray-700 text-lg">
            Each authorized sender's email address is securely linked to their unique public cryptographic key (wallet address) on an immutable, public blockchain smart contract. This decentralized registry ensures that sender identities are tamper-proof and verifiable by anyone.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Globe className="w-40 h-40 text-green-400 opacity-75" />
        </div>
      </div>

      {/* Feature 3: Digital Signature (Trust Stamp) */}
      <div className="flex flex-col md:flex-row items-center card">
        <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">3. The BoldChain Trust Stamp</h2>
          <p className="text-gray-700 text-lg">
            Your email's fingerprint is cryptographically signed using your secret private key. This creates the "BoldChain Trust Stamp" – an unforgeable digital seal that acts as undeniable proof of origin and content integrity. The private key remains secure on the backend.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <KeyRound className="w-40 h-40 text-purple-400 opacity-75" />
        </div>
      </div>

      {/* Feature 4: Automated Recipient Verification */}
      <div className="flex flex-col md:flex-row-reverse items-center card">
        <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-red-700 mb-4">4. Instant, Automated Verification</h2>
          <p className="text-gray-700 text-lg">
            Upon arrival, the recipient's email gateway automatically runs BoldChain's verification. It re-hashes the email, queries the blockchain for the sender's public key, and verifies the Trust Stamp. Any mismatch flags the email as tampered or unverified, all before it reaches the inbox.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <ShieldCheck className="w-40 h-40 text-red-400 opacity-75" />
        </div>
      </div>
    </div>
  </div>
);


const TeamPage = () => (
  <div className="max-w-6xl mx-auto px-6 py-16">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Meet the BoldChain Team</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Team Member 1 */}
      <TeamMemberCard 
        name="John Doe" 
        role="Lead Engineer & Blockchain Architect" 
        description="Passionate about decentralized systems and cybersecurity. Spearheaded the smart contract design and backend cryptographic implementation." 
        initial="J" 
      />
      {/* Team Member 2 */}
      <TeamMemberCard 
        name="Jane Smith" 
        role="Frontend & UX Lead" 
        description="Focused on creating intuitive and seamless user experiences. Designed the Gmail-inspired UI and integrated the verification visuals." 
        initial="J" 
      />
      {/* Team Member 3 */}
      <TeamMemberCard 
        name="David Johnson" 
        role="Product Strategist & Business Development" 
        description="Driven by solving real-world enterprise security challenges. Defined BoldChain's value proposition and go-to-market strategy." 
        initial="D" 
      />
       {/* Add more team members as needed */}
       <TeamMemberCard 
        name="Alice Brown" 
        role="Research & Compliance Analyst" 
        description="Ensuring BoldChain adheres to the highest security standards and explores future regulatory alignment for verifiable digital identities." 
        initial="A" 
      />
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, description, initial }) => (
  <div className="card flex flex-col items-center text-center">
    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-5xl mb-4">
      {initial}
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
    <p className="text-blue-600 font-semibold mb-3">{role}</p>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const RegisterPage = ({ addRegisteredIdentity, showMessageBox, registeredIdentitiesMap }) => {
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !walletAddress) {
      showMessageBox('error', 'Missing Information', 'Please enter both email and wallet address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showMessageBox('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Basic wallet address validation (starts with 0x and is hexadecimal)
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        showMessageBox('error', 'Invalid Wallet Address', 'Please enter a valid Ethereum-like wallet address (e.g., 0x...).');
        return;
    }

    // Check if wallet or email is already registered
    if (Object.values(registeredIdentitiesMap).includes(email.toLowerCase()) || 
        Object.keys(registeredIdentitiesMap).includes(walletAddress.toLowerCase())) {
        showMessageBox('error', 'Already Registered', 'This email or wallet address is already registered.');
        return;
    }

    // Simulate success
    addRegisteredIdentity(email, walletAddress);
    showMessageBox('success', 'Identity Registered!', `"${email}" linked to "${walletAddress}" (in-memory for demo).`);
    setEmail('');
    setWalletAddress('');
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16 card card-blue-border">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center">
        <UserPlus className="mr-2" /> Register New BoldChain Identity
      </h1>
      <p className="text-gray-600 mb-8">
        This page simulates the process of registering an email address to a blockchain wallet for BoldChain verification.
        <br/>
        <strong className="text-red-500">Note: This registration is in-memory for the demo and resets on page refresh. In a real system, this would be an on-chain transaction.</strong>
      </p>
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="form-group">
          <label htmlFor="registerEmail" className="form-label">Email Address:</label>
          <input
            id="registerEmail"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@yourcompany.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="registerWallet" className="form-label">Blockchain Wallet Address (Public Key):</label>
          <input
            id="registerWallet"
            type="text"
            className="form-input"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
        >
          <UserPlus className="mr-2" /> Register Identity
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Currently Registered Identities (for demo):</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {Object.entries(registeredIdentitiesMap).map(([wallet, emailAddr]) => (
            <li key={wallet} className="flex items-start">
              <span className="font-semibold">{emailAddr}:</span> <code className="bg-gray-100 p-1 rounded text-sm break-all">{wallet}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const GetAddonPage = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 card card-blue-border text-center">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center justify-center">
      <Download className="mr-3" size={40} /> Get the BoldChain Add-on
    </h1>
    <p className="text-xl text-gray-600 mb-10">
      Enhance your existing email experience with BoldChain's trust verification, right where you work.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {/* Outlook Add-in Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <img 
          src="https://placehold.co/120x120/E0F2F7/007bff?text=Outlook" 
          alt="Outlook Logo" 
          className="mx-auto mb-6 rounded-full"
        />
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Outlook Add-in</h2>
        <p className="text-gray-700 mb-4">
          Integrate BoldChain directly into your Microsoft Outlook client (web, desktop, and mobile). Get instant verification status and secure sending options in your familiar interface.
        </p>
        <a 
          href="https://appsource.microsoft.com/en-us/marketplace/apps" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary"
        >
          <Download className="mr-2" size={20} /> Get for Outlook (Coming Soon)
        </a>
      </div>

      {/* Gmail Add-on Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <img 
          src="https://placehold.co/120x120/F0F8EC/28a745?text=Gmail" 
          alt="Gmail Logo" 
          className="mx-auto mb-6 rounded-full"
        />
        <h2 className="text-2xl font-bold text-green-700 mb-4">Gmail Add-on</h2>
        <p className="text-gray-700 mb-4">
          Add BoldChain's powerful email verification to your Google Workspace (Gmail) experience. Get contextual insights into email authenticity directly in your Gmail sidebar.
        </p>
        <a 
          href="https://workspace.google.com/marketplace/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary"
        >
          <Download className="mr-2" size={20} /> Get for Gmail (Coming Soon)
        </a>
      </div>
    </div>

    <p className="text-gray-700 text-lg mt-10">
      **Note:** For the deepest security and to view encrypted messages, use the full BoldChain Web Application. Our add-ons primarily provide seamless linking and contextual verification within your native email client.
    </p>
  </div>
);


// --- DEMO COMPONENT (Your Cloned App) ---
// This is the core email client UI, now multi-user aware
const BoldChainEmailClientDemo = ({ currentUserId, showMessageBox, registeredIdentitiesMap }) => {
  const [currentView, setCurrentView] = useState('inbox');
  const [userEmails, setUserEmails] = useState({ sent: [], received: [] }); // Emails for the *current* user
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeFormResetKey, setComposeFormResetKey] = useState(0);

  // Get current user's profile based on currentUserId
  const currentUserProfile = MOCK_USERS.find(user => user.id === currentUserId);
  const senderWalletAddress = currentUserProfile ? currentUserProfile.wallet : '';
  const senderEmailAddress = currentUserProfile ? currentUserProfile.email : '';


  // --- Email Data Management (LocalStorage) ---
  const loadUserEmails = useCallback(() => {
    if (currentUserId) {
      setUserEmails(getEmailsFromLocalStorage(currentUserId));
    }
  }, [currentUserId]);

  useEffect(() => {
    loadUserEmails(); // Load emails on user switch or initial load

    // Add listener for localStorage changes (for cross-tab updates)
    const handleStorageChange = (event) => {
      if (event.key && event.key.startsWith('boldchain_emails_')) {
          loadUserEmails();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUserId, loadUserEmails]);


  // Handler for sending an email
  const handleSendEmail = async (toEmail, subject, bodyContent, isEncrypted) => {
    const fullEmailContent = `From: ${senderEmailAddress}\nTo: ${toEmail}\nSubject: ${subject}\n\n${bodyContent}`;
    const canonicalContent = canonicalizeEmail(fullEmailContent);
    const emailHash = await hashEmail(canonicalContent);
    const signature = simulateSignEmail(emailHash, senderWalletAddress);

    // Find the recipient's user ID based on their email
    const recipientUserProfile = MOCK_USERS.find(user => user.email.toLowerCase() === toEmail.toLowerCase());
    const recipientUserId = recipientUserProfile ? recipientUserProfile.id : null;


    const emailObject = {
      id: Date.now(),
      senderUserId: currentUserId, // Store actual sender's mock user ID
      recipientUserId: recipientUserId, // Store actual recipient's mock user ID
      from: senderEmailAddress,
      to: toEmail,
      subject: subject,
      body: isEncrypted 
            ? `[ENCRYPTED BOLDCHAIN MESSAGE - View securely in BoldChain App]`
            : bodyContent, // Store encrypted placeholder or plaintext
      originalPlaintextBody: bodyContent, // Always store the original plaintext
      senderWalletAddress: senderWalletAddress,
      generatedHash: emailHash,
      simulatedSignature: signature,
      timestamp: new Date().toISOString(),
      boldChainStatus: '', // Will be updated by ReadEmail component
      isEncrypted: isEncrypted,
    };

    // 1. Save to current user's (sender's) 'sent' box
    const senderEmails = getEmailsFromLocalStorage(currentUserId);
    senderEmails.sent.unshift(emailObject); // Add to beginning
    saveEmailsToLocalStorage(currentUserId, senderEmails);

    // 2. Save to recipient's 'received' box (if recipient is a known demo user)
    // This is how messages appear in another user's inbox in the demo
    if (recipientUserId && recipientUserId !== currentUserId) {
      const recipientEmails = getEmailsFromLocalStorage(recipientUserId);
      recipientEmails.received.unshift(emailObject);
      saveEmailsToLocalStorage(recipientUserId, recipientEmails);
    }
    
    showMessageBox('success', 'Email Sent!', 'A simulated digital signature has been generated. Check the inbox of the recipient!');
    setComposeFormResetKey(prevKey => prevKey + 1);
    setCurrentView('inbox');
    return { hash: emailHash, signature: signature };
  };

  const handleEmailSelect = useCallback((email) => {
    setSelectedEmail(email);
    setCurrentView('read');
  }, []);

  const handleBackToInbox = useCallback(() => {
    setSelectedEmail(null);
    setCurrentView('inbox');
  }, []);

  // Update status for a specific email by ID, and save to localStorage
  const updateEmailStatus = useCallback((id, status, type) => {
    setUserEmails(prevUserEmails => {
      const updatedEmails = { ...prevUserEmails };
      let updatedList = [];
      if (type === 'received') {
        updatedList = updatedEmails.received.map(email =>
          email.id === id ? { ...email, boldChainStatus: status } : email
        );
        updatedEmails.received = updatedList;
      } else if (type === 'sent') { // Ensure sent emails also get their status updated if needed
        updatedList = updatedEmails.sent.map(email =>
          email.id === id ? { ...email, boldChainStatus: status } : email
        );
        updatedEmails.sent = updatedList;
      }
      saveEmailsToLocalStorage(currentUserId, updatedEmails); // Persist updated status
      return updatedEmails;
    });
  }, [currentUserId]);

  return (
    <div className="flex-col h-full bg-gray-50 font-inter text-gray-800">
      <div className="demo-top-bar">
        <div className="flex-center">
          <h1 className="demo-title">BoldChain Mail Demo ({currentUserProfile?.name})</h1>
        </div>
        <div className="demo-search-container">
          <input
            type="text"
            placeholder="Search mail (Demo)"
            className="demo-search-input"
            disabled
          />
          <Search className="demo-search-icon" />
        </div>
        <div className="flex-center space-x-4">
          <div className="demo-user-avatar">
            {currentUserProfile?.name.charAt(0)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onComposeClick={() => { setSelectedEmail(null); setCurrentView('compose'); }}
          onInboxClick={() => { setSelectedEmail(null); setCurrentView('inbox'); }}
          currentView={currentView}
        />

        <div className="email-content-area">
          {currentView === 'compose' && <ComposeEmail 
            key={composeFormResetKey} 
            onSend={handleSendEmail} 
            onDiscard={handleBackToInbox} 
            showMessageBox={showMessageBox} 
            senderWalletAddress={senderWalletAddress} // Pass current user's wallet
            recipientOptions={MOCK_USERS.filter(u => u.id !== currentUserId)} // Recipients other than self
          />}
          {currentView === 'inbox' && <Inbox emails={userEmails.received} onSelectEmail={handleEmailSelect} currentUserId={currentUserId} />}
          {currentView === 'read' && selectedEmail && <ReadEmail selectedEmail={selectedEmail} onBack={handleBackToInbox} updateEmailStatus={updateEmailStatus} showMessageBox={showMessageBox} registeredIdentitiesMap={registeredIdentitiesMap} />}
          {!selectedEmail && currentView === 'read' && (
              <div className="page-panel page-panel-center">
                  <p className="text-gray-500 text-lg">No email selected. Go to Inbox to select one.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};


const Sidebar = ({ onComposeClick, onInboxClick, currentView }) => {
  return (
    <div className="sidebar">
      <button
        onClick={onComposeClick}
        className="sidebar-compose-btn"
      >
        <Send className="icon" /> <span>Compose</span>
      </button>
      <button
        onClick={onComposeClick}
        className="sidebar-compose-btn-mobile"
        title="Compose"
      >
        <Send className="icon" />
      </button>

      <nav className="sidebar-nav">
        <SidebarLink 
          icon={InboxIcon} 
          label="Inbox" 
          onClick={onInboxClick} 
          isActive={currentView === 'inbox'} 
        />
        <SidebarLink icon={Star} label="Important" onClick={() => {}} isActive={false} disabled/>
        <SidebarLink icon={Clock} label="Snoozed" onClick={() => {}} isActive={false} disabled/>
        <SidebarLink icon={Send} label="Sent" onClick={() => {}} isActive={false} disabled/>
        <SidebarLink icon={Trash} label="Bin" onClick={() => {}} isActive={false} disabled/>
        <SidebarLink icon={Folder} label="Drafts" onClick={() => {}} isActive={false} disabled/>
      </nav>
    </div>
  );
};

const SidebarLink = ({ icon: Icon, label, onClick, isActive, disabled }) => {
  const baseClasses = `sidebar-link`;
  const activeClasses = `active`;
  const disabledClasses = `disabled`;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : ''} ${disabled ? disabledClasses : ''}`}
      disabled={disabled}
    >
      <Icon className="icon" /> <span>{label}</span>
    </button>
  );
};


const ComposeEmail = ({ onSend, onDiscard, showMessageBox, senderWalletAddress, recipientOptions }) => {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSendClick = async () => {
    if (!toEmail || !subject || !bodyContent || !senderWalletAddress) {
      showMessageBox('error', 'Missing Information', 'Please fill in To, Subject, Body, and ensure your sender wallet is set.');
      return;
    }

    const recipientUserProfile = MOCK_USERS.find(user => user.email.toLowerCase() === toEmail.toLowerCase());
    if (!recipientUserProfile) {
      showMessageBox('error', 'Unknown Recipient', `Recipient email "${toEmail}" is not a registered demo user. Please use one of the demo user emails or register a new identity.`);
      return;
    }

    setIsLoading(true);
    try {
      await onSend(toEmail, subject, bodyContent, isEncrypted);
      setIsLoading(false);
      setToEmail('');
      setSubject('');
      setBodyContent('');
      setIsEncrypted(false);
    } catch (error) {
      setIsLoading(false);
      showMessageBox('error', 'Sending Failed', 'Could not send email. Please try again.');
      console.error("Sending error:", error);
    }
  };

  return (
    <div className="page-panel relative">
      {isLoading && (
        <div className="absolute-loader">
          <div className="loader-content">
            <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Generating Trust Stamp...</p>
          </div>
        </div>
      )}

      <h2 className="compose-header">
        <Mail className="icon" /> Compose New Message
      </h2>

      <div className="compose-form-field">
        <label htmlFor="composeTo" className="form-label">To:</label>
        <select 
            id="composeTo" 
            className="form-select" 
            value={toEmail} 
            onChange={(e) => setToEmail(e.target.value)}
            required
        >
            <option value="">Select Recipient</option>
            {recipientOptions.map(user => (
                <option key={user.id} value={user.email}>{user.name} ({user.email})</option>
            ))}
        </select>
      </div>
      <div className="compose-form-field">
        <label htmlFor="composeSubject" className="form-label">Subject:</label>
        <input id="composeSubject" type="text" className="form-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Important Update" />
      </div>
      <div className="compose-from-info">
        From: <span>{senderWalletAddress}</span>
      </div>
      <div className="compose-body-field">
        <label htmlFor="composeBody" className="form-label">Message Body:</label>
        <textarea id="composeBody" className="form-textarea compose-textarea" value={bodyContent} onChange={(e) => setBodyContent(e.target.value)} placeholder="Type your message here..."></textarea>
      </div>

      <div className="compose-encryption-checkbox">
          <input
            id="enableEncryption"
            type="checkbox"
            className="checkbox-input"
            checked={isEncrypted}
            onChange={(e) => setIsEncrypted(e.target.checked)}
          />
          <label htmlFor="enableEncryption" className="checkbox-label">
            <Lock className="icon" /> Enable Encryption (Pro Feature)
          </label>
        </div>

      <div className="compose-actions">
        <button
          onClick={handleSendClick}
          className="compose-send-btn"
          disabled={isLoading}
        >
          {isLoading ? (
             <svg className="spinner small-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : <Send className="icon" />}
          {isLoading ? 'Sending...' : 'Send Email'}
        </button>
        <button
          onClick={onDiscard}
          className="compose-discard-btn"
          disabled={isLoading}
        >
          Discard
        </button>
      </div>
    </div>
  );
};

const EmailListItem = ({ email, onSelectEmail, currentUserEmail }) => {
  let statusIcon = <AlertCircle className="w-4 h-4 text-gray-400" />;
  let statusColorClass = 'text-gray-400';

  if (email.boldChainStatus === 'VALID') {
    statusIcon = <CheckCircle className="w-4 h-4 text-green-500" />;
    statusColorClass = 'text-green-500';
  } else if (email.boldChainStatus === 'TAMPERED') {
    statusIcon = <XCircle className="w-4 h-4 text-red-500" />;
    statusColorClass = 'text-red-500';
  } else if (email.boldChainStatus === 'UNVERIFIED') {
    statusIcon = <AlertCircle className="w-4 h-4 text-yellow-500" />;
    statusColorClass = 'text-yellow-500';
  }

  const getProfileInitial = (emailAddr) => {
    return emailAddr ? emailAddr.charAt(0).toUpperCase() : 'U';
  };

  const senderName = MOCK_USERS.find(u => u.email === email.from)?.name || email.from.split('@')[0];
  const recipientName = MOCK_USERS.find(u => u.email === email.to)?.name || email.to.split('@')[0];

  const isSentEmail = email.senderUserId === MOCK_USERS.find(u => u.email === currentUserEmail)?.id;
  const displaySender = isSentEmail ? `To: ${recipientName}` : senderName;
  const displaySubject = email.subject || 'No Subject';
  const displayBodySnippet = (email.body || '').substring(0, 80) + (email.body.length > 80 ? '...' : '');

  return (
    <div
      className="email-list-item"
      onClick={() => onSelectEmail(email)}
    >
      <div className="email-avatar">
        {getProfileInitial(isSentEmail ? email.to : email.from)}
      </div>

      <div className="email-item-content">
        <div className="email-item-top-row">
          <span className={`email-item-sender ${statusColorClass}`}>
            {displaySender}{' '}
            <span className="email-item-status">
              {statusIcon}
              {email.isEncrypted && <Lock className="w-3 h-3 ml-1" />}
            </span>
          </span>
          <span className="email-item-timestamp">
            {new Date(email.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="email-item-subject">
          {displaySubject}
        </div>
        <div className="email-item-snippet">
          {displayBodySnippet}
        </div>
      </div>
    </div>
  );
};


const Inbox = ({ emails, onSelectEmail, currentUserId }) => {
  const currentUserEmail = MOCK_USERS.find(u => u.id === currentUserId)?.email;
  const receivedEmailsForUser = emails.filter(email => email.recipientUserId === currentUserId);

  const sortedEmails = [...receivedEmailsForUser].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="page-panel card-green-border">
      <h2 className="inbox-header">
        <InboxIcon className="icon" /> Inbox
      </h2>
      {sortedEmails.length === 0 ? (
        <div className="inbox-empty">
          <p>Your inbox is empty!</p>
          <p className="text-sm">Have someone send you a BoldChain email.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {sortedEmails.map((email) => (
            <EmailListItem key={email.id} email={email} onSelectEmail={onSelectEmail} currentUserEmail={currentUserEmail} />
          ))}
        </div>
      )}
    </div>
  );
};


const ReadEmail = ({ selectedEmail, onBack, updateEmailStatus, showMessageBox, registeredIdentitiesMap }) => {
  const [verificationResult, setVerificationResult] = useState(selectedEmail.boldChainStatus || '');
  const [verificationDetails, setVerificationDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEditableBody, setCurrentEditableBody] = useState(selectedEmail.originalPlaintextBody); 

  const emailIdRef = React.useRef(selectedEmail.id);

  const handleVerifyEmail = useCallback(async () => {
    if (!selectedEmail || emailIdRef.current !== selectedEmail.id) {
      return;
    }

    setIsLoading(true);
    setVerificationResult('');
    setVerificationDetails('');
    showMessageBox('info', 'Verification in Progress', 'Running BoldChain verification...');

    const extractedSignature = selectedEmail.simulatedSignature;
    const extractedSenderWallet = selectedEmail.senderWalletAddress;
    const fullEmailContentForVerification = `From: ${selectedEmail.senderWalletAddress}\nTo: ${selectedEmail.to}\nSubject: ${selectedEmail.subject}\n\n${currentEditableBody}`;


    if (!extractedSignature || !extractedSenderWallet) {
      setVerificationResult('UNVERIFIED');
      setVerificationDetails('No BoldChain signature headers found or incomplete information to verify.');
      updateEmailStatus(selectedEmail.id, 'UNVERIFIED', selectedEmail.recipientUserId === selectedEmail.senderUserId ? 'sent' : 'received');
      showMessageBox('warning', 'Verification Incomplete', 'Could not find a valid BoldChain signature or sender wallet.');
      setIsLoading(false);
      return;
    }

    try {
      const canonicalReceivedContent = canonicalizeEmail(fullEmailContentForVerification);
      const freshHash = await hashEmail(canonicalReceivedContent);

      const registeredEmail = await simulateBlockchainLookup(extractedSenderWallet, registeredIdentitiesMap);

      if (!registeredEmail) {
        setVerificationResult('UNVERIFIED');
        setVerificationDetails(`Sender wallet '${extractedSenderWallet}' is not registered on BoldChain's identity smart contract.`);
        updateEmailStatus(selectedEmail.id, 'UNVERIFIED', selectedEmail.recipientUserId === selectedEmail.senderUserId ? 'sent' : 'received');
        showMessageBox('warning', 'Verification Failed', 'Sender identity not found on blockchain. Email is unverified.');
        setIsLoading(false);
        return;
      }

      const isSignatureValid = simulateVerifySignature(extractedSignature, freshHash, extractedSenderWallet);

      if (isSignatureValid) {
        const originalContentFromSentEmail = `From: ${selectedEmail.senderWalletAddress}\nTo: ${selectedEmail.to}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.originalPlaintextBody}`;
        const registeredEmailLowerCase = registeredEmail.toLowerCase();
        
        if (originalContentFromSentEmail.toLowerCase().includes(`from: ${registeredEmailLowerCase}`)) {
          setVerificationResult('VALID');
          setVerificationDetails(`Authenticity and Integrity confirmed. Sender '${registeredEmail}' registered on BoldChain.`);
          updateEmailStatus(selectedEmail.id, 'VALID', selectedEmail.recipientUserId === selectedEmail.senderUserId ? 'sent' : 'received');
          showMessageBox('success', 'Email Verified!', 'Authenticity and integrity confirmed. This email is trustworthy!');
        } else {
          setVerificationResult('UNVERIFIED'); 
          setVerificationDetails(`Identity mismatch: 'From' address in email header does not match sender registered on BoldChain (${registeredEmail}).`);
          updateEmailStatus(selectedEmail.id, 'UNVERIFIED', selectedEmail.recipientUserId === selectedEmail.senderUserId ? 'sent' : 'received');
          showMessageBox('error', 'Verification Failed', 'Identity mismatch detected!');
        }
      } else {
        setVerificationResult('TAMPERED');
        setVerificationDetails(`Email content or signature has been TAMPERED with. Cryptographic verification failed. Received content hash does not match signed hash.`);
        updateEmailStatus(selectedEmail.id, 'TAMPERED', selectedEmail.recipientUserId === selectedEmail.senderUserId ? 'sent' : 'received');
        showMessageBox('error', 'Verification Failed', 'Email integrity compromised! Content or signature tampered with.');
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult('UNVERIFIED');
      setVerificationDetails(`An error occurred during verification: ${error.message}`);
      updateEmailStatus(selectedEmail.id, 'UNVERIFIED', selectedEmail.recipientUserId === selectedEmail.senderUserId ? 'sent' : 'received');
      showMessageBox('error', 'Verification Error', 'An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmail, updateEmailStatus, showMessageBox, currentEditableBody, registeredIdentitiesMap]);

  useEffect(() => {
    if (emailIdRef.current !== selectedEmail.id) {
      emailIdRef.current = selectedEmail.id;
      setCurrentEditableBody(selectedEmail.originalPlaintextBody);
      setVerificationResult('');
      setVerificationDetails('');
      handleVerifyEmail();
    } else if (!verificationResult) { 
      handleVerifyEmail();
    }
  }, [selectedEmail, handleVerifyEmail, verificationResult]);


  const getStatusClasses = () => {
    if (verificationResult === 'VALID') return 'status-valid';
    if (verificationResult === 'TAMPERED') return 'status-tampered';
    if (verificationResult === 'UNVERIFIED') return 'status-unverified';
    return 'status-default';
  };

  const getStatusIcon = () => {
    if (verificationResult === 'VALID') return <CheckCircle className="icon" />;
    if (verificationResult === 'TAMPERED') return <XCircle className="icon" />;
    if (verificationResult === 'UNVERIFIED') return <AlertCircle className="icon" />;
    return <KeyRound className="icon" />;
  };
  
  const getProfileInitial = (emailAddr) => {
    return emailAddr ? emailAddr.charAt(0).toUpperCase() : 'U';
  };

  if (!selectedEmail) {
    return (
      <div className="page-panel page-panel-center">
        <p className="text-gray-500 text-lg">Select an email from the inbox to read.</p>
      </div>
    );
  }

  const displayBody = selectedEmail.isEncrypted && verificationResult === 'VALID' 
                      ? selectedEmail.originalPlaintextBody 
                      : selectedEmail.body;

  const isBodyEditable = !selectedEmail.isEncrypted || verificationResult !== 'VALID';

  return (
    <div className="page-panel card-green-border flex-col h-full overflow-y-auto">
      <div className="read-email-header">
        <button
          onClick={onBack}
          className="read-email-back-btn"
        >
          <ChevronLeft className="icon" />
        </button>
        <h2 className="read-email-subject">{selectedEmail.subject}</h2>
      </div>

      <div className={`read-email-status-banner ${getStatusClasses()}`}>
        <p>
          {isLoading ? (
             <svg className="spinner small-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : getStatusIcon()}
          {isLoading ? 'Verifying...' : verificationResult === 'VALID' ? 'EMAIL VERIFIED' : verificationResult === 'TAMPERED' ? 'EMAIL TAMPERED!' : 'EMAIL UNVERIFIED'}
        </p>
        <p className="text-sm">{verificationDetails}</p>
        {selectedEmail.isEncrypted && verificationResult !== 'VALID' && (
             <p className="text-sm text-red-700 font-bold flex items-center">
                <Lock className="w-4 h-4 mr-1"/> Message content encrypted. Cannot decrypt due to verification failure.
            </p>
        )}
      </div>

      <div className="read-email-sender-info">
        <div className="email-avatar">
            {getProfileInitial(selectedEmail.from)}
        </div>
        <div>
          <span>{MOCK_USERS.find(u => u.email === selectedEmail.from)?.name || selectedEmail.from.split('@')[0]}</span>
          <span className="text-sm">&lt;{selectedEmail.from}&gt;</span>
        </div>
      </div>
      <div className="read-email-recipient-info">
        <span>To:</span> {MOCK_USERS.find(u => u.email === selectedEmail.to)?.name || selectedEmail.to.split('@')[0]} &lt;{selectedEmail.to}&gt;
      </div>

      <div className="read-email-body-container">
        <label htmlFor="editableBody" className="form-label">
            Email Body:
        </label>
        <textarea
            id="editableBody"
            className="read-email-body-textarea"
            value={currentEditableBody}
            onChange={(e) => setCurrentEditableBody(e.target.value)}
            disabled={!isBodyEditable}
        ></textarea>
        {isBodyEditable && (
             <button
                onClick={handleVerifyEmail}
                className="read-email-reverify-btn"
                disabled={isLoading}
            >
                {isLoading ? (
                    <svg className="spinner small-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : <KeyRound className="icon" />}
                Re-Verify Mail
            </button>
        )}
       {!isBodyEditable && verificationResult === 'VALID' && !selectedEmail.isEncrypted && (
            <p className="read-email-hint">
                This email is verified and unencrypted. Content shown is as received.
            </p>
        )}
        
      </div>

      <div className="read-email-stamp-details">
        <h3>BoldChain Trust Stamp Details (from simulated email headers):</h3>
        <p className="mt-1">
          **Original Hash (from sender):** <code>{selectedEmail.generatedHash}</code>
        </p>
        <p className="mt-1">
          **Simulated Signature:** <code>{selectedEmail.simulatedSignature}</code>
        </p>
      </div>
    </div>
  );
};


// --- User Selection / Mock Login Page ---
const UserSelectPage = ({ setCurrentUserId, showMessageBox }) => {
  const navigate = useNavigate();

  const handleUserSelect = (userId) => {
    setCurrentUserId(userId);
    showMessageBox('success', 'Logged In!', `Welcome, ${MOCK_USERS.find(u => u.id === userId)?.name}!`);
    navigate('/demo'); // Redirect to demo page after login
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 card card-blue-border text-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center justify-center">
        <UserPlus className="mr-2" /> Select Your Demo User
      </h1>
      <p className="text-gray-600 mb-8">
        Open this page in separate browser tabs to simulate multiple users/devices.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {MOCK_USERS.map(user => (
          <button
            key={user.id}
            onClick={() => handleUserSelect(user.id)}
            className="btn-primary w-full"
          >
            <User className="mr-2" /> Log in as {user.name}
          </button>
        ))}
      </div>
    </div>
  );
};


// --- Main Website App Component ---
const WebsiteApp = () => {
  const [registeredIdentities, setRegisteredIdentities] = useState(initialRegisteredIdentities);
  const [messageBox, setMessageBox] = useState({ show: false, type: '', title: '', message: '' });
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('boldchain_current_user_id') || '');
  
  // Redirect to login if no user selected and not on login or home page
  useEffect(() => {
    if (!currentUserId && window.location.pathname !== '/login' && window.location.pathname !== '/') {
        // Handled by Route's Navigate component
    }
  }, [currentUserId]);

  // Persist user ID to localStorage
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('boldchain_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('boldchain_current_user_id');
    }
  }, [currentUserId]);

  const showMessageBox = useCallback((type, title, message) => {
    setMessageBox({ show: true, type, title, message });
  }, []);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ show: false, type: '', title, message: '' });
  }, []);

  const addRegisteredIdentity = useCallback((email, walletAddress) => {
    setRegisteredIdentities(prev => ({
      ...prev,
      [walletAddress.toLowerCase()]: email,
    }));
    initialRegisteredIdentities[walletAddress.toLowerCase()] = email; 
  }, []);

  const currentUserName = MOCK_USERS.find(user => user.id === currentUserId)?.name || "Guest";

  return (
    <Router>
      <div className="flex-col min-h-screen">
        <MessageBox {...messageBox} onClose={closeMessageBox} />
        <Navbar currentUserName={currentUserName} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/login" element={<UserSelectPage setCurrentUserId={setCurrentUserId} showMessageBox={showMessageBox} />} />
            
            {/* Protected Routes: Conditionally render the element based on currentUserId */}
            <Route 
                path="/demo" 
                element={currentUserId ? (
                    <div className="h-full-minus-header">
                        <BoldChainEmailClientDemo currentUserId={currentUserId} registeredIdentitiesMap={registeredIdentities} showMessageBox={showMessageBox} />
                    </div>
                ) : (
                    <Navigate to="/login" replace />
                )} 
            />
            <Route 
                path="/register-identity" 
                element={currentUserId ? (
                    <RegisterPage addRegisteredIdentity={addRegisteredIdentity} showMessageBox={showMessageBox} registeredIdentitiesMap={registeredIdentities} />
                ) : (
                    <Navigate to="/login" replace />
                )} 
            />
            <Route 
                path="/get-addon" 
                element={currentUserId ? (
                    <GetAddonPage />
                ) : (
                    <Navigate to="/login" replace />
                )} 
            />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default WebsiteApp;
