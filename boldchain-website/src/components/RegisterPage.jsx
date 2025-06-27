// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { initialRegisteredIdentities } from '../utils/constants'; // Using initialRegisteredIdentities from constants

const RegisterPage = ({ showMessageBox }) => {
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  // Local state for registered identities, for demonstration on this page only.
  // In a real system, this data would come from a backend.
  const [currentRegisteredIdentities, setCurrentRegisteredIdentities] = useState(initialRegisteredIdentities);


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

    // Check if wallet or email is already registered in our local demo store
    if (Object.values(currentRegisteredIdentities).includes(email.toLowerCase()) || 
        Object.keys(currentRegisteredIdentities).includes(walletAddress.toLowerCase())) {
        showMessageBox('error', 'Already Registered', 'This email or wallet address is already registered.');
        return;
    }

    // Simulate success and update local state for display
    const newIdentities = {
      ...currentRegisteredIdentities,
      [walletAddress.toLowerCase()]: email,
    };
    setCurrentRegisteredIdentities(newIdentities);
    
    showMessageBox('success', 'Identity Registered!', `"${email}" linked to "${walletAddress}" (in-memory for demo).`);
    setEmail('');
    setWalletAddress('');

    // In a real scenario, you would send this to your backend here:
    // const response = await fetch('/api/register-identity', { method: 'POST', body: JSON.stringify({ email, walletAddress }) });
    // if (response.ok) { showMessageBox('success', ...); } else { showMessageBox('error', ...); }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16 card card-blue-border">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center">
        <UserPlus className="mr-2" /> Register New BoldChain Identity
      </h1>
      <p className="text-gray-600 mb-8">
        This page simulates the process of registering an email address to a blockchain wallet for BoldChain verification.
        <br/>
        <strong className="text-red-500">Note: This registration is in-memory for the demo and resets on page refresh. In a real system, this would be an on-chain transaction via your backend.</strong>
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
          {Object.entries(currentRegisteredIdentities).map(([wallet, emailAddr]) => (
            <li key={wallet} className="flex items-start">
              <span className="font-semibold">{emailAddr}:</span> <code className="bg-gray-100 p-1 rounded text-sm break-all">{wallet}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegisterPage;
