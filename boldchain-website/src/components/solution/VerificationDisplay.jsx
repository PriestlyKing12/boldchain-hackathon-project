// src/components/solution/VerificationDisplay.jsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Displays the BoldChain verification status and details for an email.
 * This data is expected to come from the backend's verification API.
 */
const VerificationDisplay = ({ status, details, signature, hash, senderWallet }) => {
    let icon;
    let statusColorClass;
    let statusText = status;

    switch (status) {
        case 'Verified':
            icon = <CheckCircle className="status-icon text-green-500 mr-2" />;
            statusColorClass = "text-green-500";
            break;
        case 'Tampered':
            icon = <XCircle className="status-icon text-red-500 mr-2" />;
            statusColorClass = "text-red-500";
            break;
        case 'Unverified':
            icon = <AlertCircle className="status-icon text-yellow-500 mr-2" />;
            statusColorClass = "text-yellow-500";
            break;
        default:
            icon = <Info className="status-icon text-gray-500 mr-2" />;
            statusColorClass = "text-gray-500";
            statusText = "Not Processed";
            break;
    }

    return (
        <div className={`boldchain-status ${statusColorClass}`}>
            {icon} <strong>Status: {statusText}</strong>
            {details && <p className="boldchain-details text-sm">{details}</p>}
            {(status !== 'Verified' && signature && hash && senderWallet) && (
                <div className="boldchain-raw-data mt-2 text-xs">
                    <p>Signature: <code className="break-all">{signature}</code></p>
                    <p>Original Hash: <code className="break-all">{hash}</code></p>
                    <p>Sender Wallet: <code className="break-all">{senderWallet}</code></p>
                </div>
            )}
        </div>
    );
};

export default VerificationDisplay;
