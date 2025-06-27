    // src/utils/constants.js

    /**
     * Production-Ready Constants for BoldChain Frontend.
     *
     * IMPORTANT FOR BACKEND TEAM:
     * This file now contains only static configuration values.
     * All dynamic data (e.g., user identities, mock users, email data)
     * will be managed by the backend API.
     *
     * Frontend components should make API calls to fetch or submit
     * such data, as defined in `src/api/` modules.
     */

    // Example: API Base URL (replace with your actual backend URL)
    export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    // Example: Blockchain Network ID (if relevant for client-side display)
    export const BLOCKCHAIN_NETWORK_ID = 'BoldChain-Mainnet-v1.0';

    // Add any other truly static, global configuration values here.
    