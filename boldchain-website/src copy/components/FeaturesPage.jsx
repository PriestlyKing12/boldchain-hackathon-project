// src/components/FeaturesPage.jsx
import React from 'react';
import { Fingerprint, Globe, KeyRound, ShieldCheck } from 'lucide-react';

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

export default FeaturesPage;
