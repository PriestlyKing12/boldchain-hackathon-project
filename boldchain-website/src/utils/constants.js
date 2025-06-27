// src/utils/constants.js

/**
 * Frontend-only Simulation Data for Demo & UI Display Purposes.
 *
 * IMPORTANT FOR BACKEND TEAM:
 * These arrays/objects (initialRegisteredIdentities, MOCK_USERS) are NOT persistent.
 * They reside solely in the user's browser memory.
 *
 * In a real production system, the data for user identities, profiles, and
 * any blockchain registrations would be managed and persisted by the backend API
 * and a secure database (e.g., Firestore, SQL).
 *
 * Your backend will need to provide the actual API endpoints for:
 * 1. User authentication/login (if needed for the marketing site's future features).
 * 2. Registering new identities (email to wallet address mapping) persistently.
 * 3. Looking up registered identities from the blockchain or a cached layer.
 * 4. Storing and retrieving actual user profiles.
 */

export const initialRegisteredIdentities = {
    '0xdavidwalletaddress1234567890abcdef': 'david@energycorp.com',
    '0xalicewalletaddressabcdef1234567890': 'alice@energycorp.com',
    '0xbobwalletaddress0987654321fedcba987': 'bob@consulting.com',
};

export const MOCK_USERS = [
    { id: 'user_david', name: 'David', email: 'david@energycorp.com', wallet: '0xdavidwalletaddress1234567890abcdef' },
    { id: 'user_alice', name: 'Alice', email: 'alice@energycorp.com', wallet: '0xalicewalletaddressabcdef1234567890' },
    { id: 'user_bob', name: 'Bob', email: 'bob@consulting.com', wallet: '0xbobwalletaddress0987654321fedcba987' },
];
