// src/components/GetAddonPage.jsx
import React from 'react';
import { Download } from 'lucide-react';

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

export default GetAddonPage;
