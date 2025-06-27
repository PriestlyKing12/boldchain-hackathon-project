// src/components/solution/EmailComposer.jsx
import React, { useState, useEffect } from 'react';
import { Send, MailCheck, Lock as LockIcon } from 'lucide-react';
import { sendBoldChainEmail } from '../../api/emails'; // Import API call for sending
import { getAllRegisteredIdentities } from '../../api/identities'; // Import API call for identities

/**
 * Provides the UI for composing and sending a new email via the BoldChain service.
 * This component makes API calls to send emails and to fetch registered identities
 * for validation/suggestions.
 */
const EmailComposer = ({ onSendSuccess, currentSenderEmail, showMessageBox, token }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [registeredIdentities, setRegisteredIdentities] = useState([]); // For recipient suggestions/validation

    // Fetch registered identities on component mount for recipient validation/suggestions
    useEffect(() => {
        const fetchIdentities = async () => {
            try {
                // In a real app, this might be filtered or cached based on user context
                const identities = await getAllRegisteredIdentities(token);
                setRegisteredIdentities(identities.map(id => id.email));
            } catch (error) {
                console.error("Failed to fetch registered identities:", error);
                showMessageBox('error', 'Error', 'Failed to load registered identities for recipient suggestions.');
            }
        };
        fetchIdentities();
    }, [showMessageBox, token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSending) return; // Prevent double submission

        if (!to || !subject || !body) {
            showMessageBox('warning', 'Missing Fields', 'Please fill in all email fields (To, Subject, Body).');
            return;
        }

        if (!to.includes('@') || !to.includes('.')) {
            showMessageBox('error', 'Invalid Recipient', 'Please enter a valid recipient email address.');
            return;
        }

        // Basic check if recipient is a registered identity (for better user experience)
        const isRecipientRegistered = registeredIdentities.some(email => email.toLowerCase() === to.toLowerCase());
        if (!isRecipientRegistered) {
            showMessageBox('warning', 'Recipient Not Registered', `Recipient "${to}" is not a registered BoldChain identity. Email will send, but verification by the recipient's client will fail if they rely on BoldChain.`);
        }

        setIsSending(true);
        try {
            // Call the backend API to send the email
            const response = await sendBoldChainEmail(
                { from: currentSenderEmail, to, subject, body, encrypt: isEncrypted },
                token // Pass authentication token
            );
            
            showMessageBox('success', 'Email Sent!', response.message || 'Your email has been sent and secured by BoldChain.');
            onSendSuccess(); // Callback to parent to switch view
            
            // Clear form fields after successful sending
            setTo('');
            setSubject('');
            setBody('');
            setIsEncrypted(false);

        } catch (error) {
            console.error("Email sending failed:", error);
            showMessageBox('error', 'Sending Failed', `Could not send email: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="compose-email-container">
            <h2 className="compose-email-header">
                <MailCheck className="icon" /> Compose New Email
            </h2>
            <form onSubmit={handleSubmit} className="compose-email-form">
                <div className="form-group">
                    <label htmlFor="from" className="form-label">From:</label>
                    <input
                        id="from"
                        type="email"
                        className="form-input"
                        value={currentSenderEmail}
                        disabled // Sender email is determined by current logged-in user
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="to" className="form-label">To:</label>
                    <input
                        id="to"
                        type="email"
                        className="form-input"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@example.com"
                        list="registeredEmails" // For datalist suggestions
                        required
                    />
                    {/* Datalist for registered email suggestions */}
                    <datalist id="registeredEmails">
                        {registeredIdentities.map(email => (
                            <option key={email} value={email} />
                        ))}
                    </datalist>
                </div>
                <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject:</label>
                    <input
                        id="subject"
                        type="text"
                        className="form-input"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject of the email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="body" className="form-label">Body:</label>
                    <textarea
                        id="body"
                        className="form-input form-textarea"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Your message goes here..."
                        rows="10"
                        required
                    ></textarea>
                </div>
                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="encryptEmail"
                        className="checkbox-input"
                        checked={isEncrypted}
                        onChange={(e) => setIsEncrypted(e.target.checked)}
                    />
                    <label htmlFor="encryptEmail" className="checkbox-label">
                        <LockIcon className="icon" /> Encrypt Email (Requires backend implementation)
                    </label>
                </div>
                <button type="submit" className="btn-primary compose-send-btn" disabled={isSending}>
                    {isSending ? 'Sending...' : <><Send className="mr-2" /> Send BoldChain Mail</>}
                </button>
            </form>
        </div>
    );
};

export default EmailComposer;
