// src/components/solution/EmailViewer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Lock as LockIcon, Unlock } from 'lucide-react';
import VerificationDisplay from './VerificationDisplay'; // Import the new VerificationDisplay
import { decryptEmailBody, verifyReceivedEmail } from '../../api/emails'; // Import API calls
import { formatDateTime } from '../../utils/helpers'; // Import the helper function

/**
 * Displays the full content of a selected email, handles decryption,
 * and shows BoldChain verification status.
 * This component will make API calls to decrypt and verify emails.
 */
const EmailViewer = ({ email, onBack, currentUserEmail, showMessageBox, token }) => {
    const [displayedBody, setDisplayedBody] = useState(email.body);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptionError, setDecryptionError] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(email.boldChain?.verificationStatus || 'Pending');
    const [verificationDetails, setVerificationDetails] = useState(email.boldChain?.verificationDetails || 'Awaiting verification.');
    const [isVerifying, setIsVerifying] = useState(false);

    // Effect to reset displayed body when email prop changes
    useEffect(() => {
        if (email.isEncrypted) {
            setDisplayedBody("Encrypted message. Click 'Decrypt' to view.");
            setDecryptionError(null);
        } else {
            setDisplayedBody(email.body);
        }
        // Also reset verification status if the email changes and it wasn't pre-verified
        setVerificationStatus(email.boldChain?.verificationStatus || 'Pending');
        setVerificationDetails(email.boldChain?.verificationDetails || 'Awaiting verification.');
    }, [email]);

    // Handle decryption
    const handleDecrypt = useCallback(async () => {
        if (!email.isEncrypted) {
            showMessageBox('info', 'Not Encrypted', 'This email is not marked as encrypted.');
            return;
        }
        // In a real system, the decryptionKeyContext would be more complex,
        // potentially requiring user input (e.g., password) or derived from their wallet.
        // For this frontend placeholder, we'll use a simple placeholder.
        const decryptionKeyContext = email.id; // Using email ID as a simple context placeholder

        setIsDecrypting(true);
        setDecryptionError(null);
        try {
            // Call backend API for decryption
            const response = await decryptEmailBody(email.body, decryptionKeyContext, token);
            setDisplayedBody(response.decryptedBody);
            showMessageBox('success', 'Decrypted!', 'Email content has been successfully decrypted.');
        } catch (error) {
            console.error("Decryption API failed:", error);
            setDecryptionError(`Decryption failed: ${error.message}.`);
            showMessageBox('error', 'Decryption Failed', `Could not decrypt email: ${error.message}`);
        } finally {
            setIsDecrypting(false);
        }
    }, [email, showMessageBox, token]);


    // Handle on-demand verification (if not already verified on receipt)
    const handleVerify = useCallback(async () => {
        if (verificationStatus === 'Verified' || isVerifying) {
            showMessageBox('info', 'Already Verified', 'This email is already verified or verification is in progress.');
            return;
        }
        
        setIsVerifying(true);
        setVerificationDetails('Verifying...');
        try {
            // IMPORTANT: In a real system, `rawEmailContent` would be the *actual raw email text*
            // including all original headers and body. This cannot be easily reconstructed
            // from the parsed `email` object alone on the frontend.
            // This is a major point for backend integration: The backend email processor
            // would store the raw email and provide an endpoint to verify it by ID.
            const simulatedRawContent = JSON.stringify({
                to: email.to,
                from: email.senderEmail,
                subject: email.subject,
                body: email.body, // This would be the received encrypted/plaintext body
                boldChainSignature: email.boldChain?.signature,
                boldChainHash: email.boldChain?.hash,
                boldChainSenderWallet: email.boldChain?.senderWallet
            });

            const response = await verifyReceivedEmail(simulatedRawContent, token);
            setVerificationStatus(response.status);
            setVerificationDetails(response.details);
            showMessageBox('success', 'Verification Complete', `Email status: ${response.status}`);
        } catch (error) {
            console.error("Verification API failed:", error);
            setVerificationStatus('Error');
            setVerificationDetails(`Verification failed: ${error.message}`);
            showMessageBox('error', 'Verification Failed', `Could not verify email: ${error.message}`);
        } finally {
            setIsVerifying(false);
        }
    }, [email, verificationStatus, isVerifying, showMessageBox, token]);


    return (
        <div className="read-email-container">
            <button onClick={onBack} className="back-button">
                <ArrowLeft className="mr-2" /> Back to {email.status === 'Sent' ? 'Sent' : 'Inbox'}
            </button>

            <div className="email-header-read">
                <h2 className="email-subject-read">{email.subject || '(No Subject)'}</h2>
                <div className="email-meta-read">
                    <span className="email-sender-read">From: {email.senderEmail}</span>
                    <span className="email-to-read">To: {email.to}</span>
                    <span className="email-timestamp-read">{formatDateTime(email.timestamp)}</span>
                </div>
            </div>

            <div className="email-body-read">
                {email.isEncrypted && (
                    <div className="encryption-notice">
                        <LockIcon className="mr-2 text-blue-400" /> This message is encrypted.
                        <button onClick={handleDecrypt} className="decrypt-button" disabled={isDecrypting}>
                            {isDecrypting ? 'Decrypting...' : <><Unlock className="mr-2" />Decrypt</>}
                        </button>
                        {decryptionError && <p className="text-red-500 text-sm mt-2">{decryptionError}</p>}
                    </div>
                )}
                <pre className="email-body-content">{displayedBody}</pre>
            </div>

            {/* Display BoldChain verification status */}
            <VerificationDisplay
                status={verificationStatus}
                details={verificationDetails}
                signature={email.boldChain?.signature}
                hash={email.boldChain?.hash}
                senderWallet={email.boldChain?.senderWallet}
            />

            {/* Option to manually trigger verification if status is pending/unverified
                This button would typically be more prominent if auto-verification isn't instant or reliable.
            */}
            {verificationStatus !== 'Verified' && verificationStatus !== 'Tampered' && (
                <button onClick={handleVerify} className="btn-primary mt-4" disabled={isVerifying}>
                    {isVerifying ? 'Verifying...' : 'Re-verify Email'}
                </button>
            )}
        </div>
    );
};

export default EmailViewer;
