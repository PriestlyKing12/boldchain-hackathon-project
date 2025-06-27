// src/components/solution/InboxDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import EmailComposer from './EmailComposer'; // Import EmailComposer
import EmailViewer from './EmailViewer';     // Import EmailViewer
import EmailListItem from './EmailListItem'; // Only for rendering the list, actual list is in Inbox
import { getAllRegisteredIdentities } from '../../api/identities'; // For initial setup
// Importing email API functions to simulate fetch, though actual list rendering is delegated
// import { fetchUserInbox, fetchSentEmails } from '../../api/emails';
import { Mail, Loader } from 'lucide-react'; // For general icon and loader

/**
 * Main dashboard for the BoldChain Email Client.
 * Manages active views (inbox, compose, read), and handles fetching/displaying emails.
 * This component will connect to your backend APIs for real email data.
 */
const InboxDashboard = ({ showMessageBox }) => {
    const [activeView, setActiveView] = useState('inbox'); // 'inbox', 'compose', 'read'
    const [selectedEmail, setSelectedEmail] = useState(null); // The email currently being read
    const [inboxEmails, setInboxEmails] = useState([]);
    const [sentEmails, setSentEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserName, setCurrentUserName] = useState("User"); // Placeholder for logged-in user name
    const [currentUserEmail, setCurrentUserEmail] = useState("user@boldchain.com"); // Placeholder for logged-in user email
    const [token, setToken] = useState("mock-auth-token-123"); // Placeholder for auth token from backend

    // Fetch initial emails and user info from backend on mount
    useEffect(() => {
        const fetchEmailsAndUserInfo = async () => {
            setIsLoading(true);
            try {
                // IMPORTANT FOR BACKEND TEAM:
                // Replace these with actual API calls to your backend:
                // const userResponse = await fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } });
                // const userData = await userResponse.json();
                // setCurrentUserName(userData.name);
                // setCurrentUserEmail(userData.email);

                // const inboxResponse = await fetchUserInbox(token); // Example API call
                // setInboxEmails(inboxResponse.emails);

                // const sentResponse = await fetchSentEmails(token); // Example API call
                // setSentEmails(sentResponse.emails);

                // --- Frontend Simulation for now ---
                // Simulating some initial emails for the Inbox
                const mockInbox = [
                    {
                        id: 'inbox_1', senderEmail: 'alice@energycorp.com', to: currentUserEmail, subject: 'BoldChain: Your First Secure Mail',
                        body: 'Welcome to BoldChain! This is a test email to demonstrate secure communication. It is a very long body just to see how the scrolling works.',
                        timestamp: new Date(Date.now() - 3600000).toISOString(), isEncrypted: false, status: 'Received',
                        boldChain: { verificationStatus: 'Verified', details: 'Sender and content cryptographically verified.', hash: '0xabc123...', signature: '0xdef456...', senderWallet: '0xalicewalletaddressabcdef1234567890' }
                    },
                    {
                        id: 'inbox_2', senderEmail: 'bob@consulting.com', to: currentUserEmail, subject: 'Project Update (Unverified - from regular client)',
                        body: 'Hi, just a quick update on the project. Nothing sensitive here.\n\nBest,\nBob',
                        timestamp: new Date(Date.now() - 7200000).toISOString(), isEncrypted: false, status: 'Received',
                        boldChain: { verificationStatus: 'Unverified', details: 'No BoldChain signature found. Sent via regular email client.', hash: null, signature: null, senderWallet: null }
                    },
                    {
                      id: 'inbox_3', senderEmail: 'charlie@boldchain.com', to: currentUserEmail, subject: 'Encrypted Message from Support',
                      body: 'VGhpcyBpcyBhbiBlbmNyeXB0ZWQgZGVtbyBtZXNzYWdlLiBJdCBjb250YWlucyBzZW5zaXRpdmUgaW5mb3JtYXRpb24u', // Base64 encoded placeholder
                      timestamp: new Date(Date.now() - 10800000).toISOString(), isEncrypted: true, status: 'Received',
                      encryptionKey: 'key_for_inbox_3', // Simulated key
                      boldChain: { verificationStatus: 'Verified', details: 'Sender and content cryptographically verified. Encrypted.', hash: '0xghi789...', signature: '0xjkL012...', senderWallet: '0xcharliewalletaddress321fedcba987654321' }
                    },
                ];

                const mockSent = [
                    {
                        id: 'sent_1', senderEmail: currentUserEmail, to: 'david@energycorp.com', subject: 'Re: BoldChain Testing',
                        body: 'Confirming receipt of your test email. BoldChain works great!',
                        timestamp: new Date(Date.now() - 3000000).toISOString(), isEncrypted: false, status: 'Sent',
                        boldChain: { verificationStatus: 'Verified', details: 'Sent with BoldChain signature.', hash: '0xdef987...', signature: '0xuvw654...', senderWallet: '0xuserwalletaddress000000000000000000000' }
                    },
                ];

                setInboxEmails(mockInbox);
                setSentEmails(mockSent);
                setCurrentUserName("Current User"); // Mock logged-in user
                setCurrentUserEmail("currentuser@boldchain.com"); // Mock logged-in email
                // --- End Frontend Simulation ---

            } catch (error) {
                console.error("Failed to fetch initial emails or user info:", error);
                showMessageBox('error', 'Loading Error', 'Failed to load emails or user information. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmailsAndUserInfo();
    }, [showMessageBox, token]);


    // Function to refetch emails (e.g., after sending a new one)
    const refreshEmails = useCallback(async () => {
        setIsLoading(true);
        try {
            // Replace with actual backend API calls
            // const inboxResponse = await fetchUserInbox(token);
            // setInboxEmails(inboxResponse.emails);
            // const sentResponse = await fetchSentEmails(token);
            // setSentEmails(sentResponse.emails);

            // --- Re-run simulation for now ---
            const mockInbox = [
                {
                    id: 'inbox_1', senderEmail: 'alice@energycorp.com', to: currentUserEmail, subject: 'BoldChain: Your First Secure Mail',
                    body: 'Welcome to BoldChain! This is a test email to demonstrate secure communication. It is a very long body just to see how the scrolling works.',
                    timestamp: new Date(Date.now() - 3600000).toISOString(), isEncrypted: false, status: 'Received',
                    boldChain: { verificationStatus: 'Verified', details: 'Sender and content cryptographically verified.', hash: '0xabc123...', signature: '0xdef456...', senderWallet: '0xalicewalletaddressabcdef1234567890' }
                },
                {
                    id: 'inbox_2', senderEmail: 'bob@consulting.com', to: currentUserEmail, subject: 'Project Update (Unverified - from regular client)',
                    body: 'Hi, just a quick update on the project. Nothing sensitive here.\n\nBest,\nBob',
                    timestamp: new Date(Date.now() - 7200000).toISOString(), isEncrypted: false, status: 'Received',
                    boldChain: { verificationStatus: 'Unverified', details: 'No BoldChain signature found. Sent via regular email client.', hash: null, signature: null, senderWallet: null }
                },
                {
                  id: 'inbox_3', senderEmail: 'charlie@boldchain.com', to: currentUserEmail, subject: 'Encrypted Message from Support',
                  body: 'VGhpcyBpcyBhbiBlbmNyeXB0ZWQgZGVtbyBtZXNzYWdlLiBJdCBjb250YWlucyBzZW5zaXRpdmUgaW5mb3JtYXRpb24u', // Base64 encoded placeholder
                  timestamp: new Date(Date.now() - 10800000).toISOString(), isEncrypted: true, status: 'Received',
                  encryptionKey: 'key_for_inbox_3', // Simulated key
                  boldChain: { verificationStatus: 'Verified', details: 'Sender and content cryptographically verified. Encrypted.', hash: '0xghi789...', signature: '0xjkL012...', senderWallet: '0xcharliewalletaddress321fedcba987654321' }
                },
            ];

            const mockSent = [
                {
                    id: 'sent_1', senderEmail: currentUserEmail, to: 'david@energycorp.com', subject: 'Re: BoldChain Testing',
                    body: 'Confirming receipt of your test email. BoldChain works great!',
                    timestamp: new Date(Date.now() - 3000000).toISOString(), isEncrypted: false, status: 'Sent',
                    boldChain: { verificationStatus: 'Verified', details: 'Sent with BoldChain signature.', hash: '0xdef987...', signature: '0xuvw654...', senderWallet: '0xuserwalletaddress000000000000000000000' }
                },
            ];
            setInboxEmails(mockInbox);
            setSentEmails(mockSent);
            // --- End re-run simulation ---

        } catch (error) {
            console.error("Failed to refresh emails:", error);
            showMessageBox('error', 'Refresh Error', 'Failed to refresh emails. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [showMessageBox, currentUserEmail, token]);


    const handleNavigate = useCallback((view, email = null) => {
        setActiveView(view);
        setSelectedEmail(email);
        if (view === 'inbox' || view === 'sent') {
            refreshEmails(); // Refresh emails when returning to list views
        }
    }, [refreshEmails]);

    const handleSendSuccess = useCallback(() => {
        handleNavigate('sent'); // Go to sent folder after successful send
    }, [handleNavigate]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex-center flex-grow">
                    <Loader className="spinner" size={50} />
                    <p className="ml-4 text-xl text-gray-400">Loading emails...</p>
                </div>
            );
        }

        switch (activeView) {
            case 'compose':
                return (
                    <EmailComposer
                        onSendSuccess={handleSendSuccess}
                        currentSenderEmail={currentUserEmail}
                        showMessageBox={showMessageBox}
                        token={token} // Pass token for API calls
                    />
                );
            case 'inbox':
                return (
                    <div className="inbox-container">
                        <h2 className="inbox-header"><Mail className="icon" /> Inbox</h2>
                        <div className="email-list">
                            {inboxEmails.length > 0 ? (
                                inboxEmails
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map(email => (
                                        <EmailListItem
                                            key={email.id}
                                            email={email}
                                            onSelectEmail={(e) => handleNavigate('read', e)}
                                        />
                                    ))
                            ) : (
                                <p className="no-emails-message">Your inbox is empty.</p>
                            )}
                        </div>
                    </div>
                );
            case 'sent':
                return (
                    <div className="inbox-container">
                        <h2 className="inbox-header"><Mail className="icon" /> Sent</h2>
                        <div className="email-list">
                            {sentEmails.length > 0 ? (
                                sentEmails
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map(email => (
                                        <EmailListItem
                                            key={email.id}
                                            email={email}
                                            onSelectEmail={(e) => handleNavigate('read', e)}
                                            isSentBox={true}
                                        />
                                    ))
                            ) : (
                                <p className="no-emails-message">You haven't sent any emails yet.</p>
                            )}
                        </div>
                    </div>
                );
            case 'read':
                return selectedEmail ? (
                    <EmailViewer
                        email={selectedEmail}
                        onBack={() => handleNavigate(selectedEmail.status === 'Sent' ? 'sent' : 'inbox')}
                        currentUserEmail={currentUserEmail}
                        showMessageBox={showMessageBox}
                        token={token} // Pass token for API calls
                    />
                ) : (
                    <div className="flex-center flex-grow">
                        <p className="text-gray-400">Select an email to read.</p>
                    </div>
                );
            default:
                return (
                    <div className="flex-center flex-grow">
                        <p className="text-gray-400">Welcome to BoldChain Mail.</p>
                    </div>
                );
        }
    };

    return (
        <div className="boldchain-email-client-container">
            <Sidebar
                onCompose={() => handleNavigate('compose')}
                onInbox={() => handleNavigate('inbox')}
                onSent={() => handleNavigate('sent')}
                currentUserName={currentUserName}
            />
            <div className="email-content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default InboxDashboard;
