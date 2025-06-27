// src/components/solution/EmailListItem.jsx
import React from 'react';
import { Mail, CheckCircle, XCircle, AlertCircle, Lock } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers'; // Import the helper function

/**
 * Displays a summary of an email in a list (e.g., Inbox or Sent).
 * Includes sender/recipient, subject, timestamp, and verification status icons.
 */
const EmailListItem = ({ email, onSelectEmail, isSentBox = false }) => {
    const senderOrRecipient = isSentBox ? `To: ${email.to}` : `From: ${email.senderEmail}`;
    const subjectPreview = email.subject ? email.subject : "(No Subject)";
    const timestamp = formatDateTime(email.timestamp); // Use helper for formatting

    let statusIcon = <Mail className="status-icon text-gray-500" />;
    let statusText = "";
    let statusColorClass = "";

    // IMPORTANT: In a production setup, email.boldChain.verificationStatus
    // would be populated by the backend after it performs cryptographic verification.
    if (email.boldChain?.verificationStatus) {
        switch (email.boldChain.verificationStatus) {
            case 'Verified':
                statusIcon = <CheckCircle className="status-icon text-green-500" />;
                statusText = "Verified";
                statusColorClass = "text-green-500";
                break;
            case 'Tampered':
                statusIcon = <XCircle className="status-icon text-red-500" />;
                statusText = "Tampered";
                statusColorClass = "text-red-500";
                break;
            case 'Unverified':
                statusIcon = <AlertCircle className="status-icon text-yellow-500" />;
                statusText = "Unverified";
                statusColorClass = "text-yellow-500";
                break;
            default:
                statusIcon = <Mail className="status-icon text-gray-500" />;
                statusText = "Pending";
                statusColorClass = "text-gray-500";
                break;
        }
    }

    return (
        <div className="email-list-item" onClick={() => onSelectEmail(email)}>
            <div className="email-list-item-header">
                <span className="email-list-item-sender">{senderOrRecipient}</span>
                <span className={`email-list-item-status ${statusColorClass}`}>
                    {email.isEncrypted && <Lock className="inline-block w-4 h-4 mr-1" />} {/* Encryption icon */}
                    {statusIcon} {statusText}
                </span>
            </div>
            <div className="email-list-item-subject">
                {subjectPreview}
            </div>
            <div className="email-list-item-timestamp">
                {timestamp}
            </div>
        </div>
    );
};

export default EmailListItem;
