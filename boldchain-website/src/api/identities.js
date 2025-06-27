// src/api/identities.js
import { API_BASE_URL } from '../utils/constants';

/**
 * @file Frontend API client for BoldChain Identity management.
 * This module defines functions to register and query email-to-wallet identities
 * via the backend.
 */

const IDENTITIES_API_BASE_URL = `${API_BASE_URL}/identities`; // Example: /api/identities

/**
 * Registers a new BoldChain identity (email address linked to a public wallet address).
 * This will trigger a backend process to interact with the blockchain.
 * @param {string} email - The email address to register.
 * @param {string} walletAddress - The public blockchain wallet address (public key).
 * @param {string} [token] - Optional authentication token for backend authorization.
 * @returns {Promise<Object>} A promise that resolves with the registration confirmation.
 * @throws {Error} If the registration fails (e.g., address already registered, blockchain error).
 */
export const registerBoldChainIdentity = async (email, walletAddress, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${IDENTITIES_API_BASE_URL}/register`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ email, walletAddress }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'BoldChain identity registration failed.');
    }

    return data; // Example: { success: true, message: 'Identity registered successfully', transactionId: '...' }
  } catch (error) {
    console.error('API Error (registerBoldChainIdentity):', error);
    throw error;
  }
};

/**
 * Queries the backend to get a BoldChain identity by email or wallet address.
 * This function is for frontend display/validation purposes.
 * @param {string} query - The email or wallet address to look up.
 * @param {string} [token] - Optional authentication token.
 * @returns {Promise<Object|null>} A promise that resolves with the identity object (email, walletAddress) or null if not found.
 * @throws {Error} If the lookup fails (e.g., network error).
 */
export const getBoldChainIdentity = async (query, token = null) => {
  try {
    // Backend would determine if query is email or wallet and search accordingly
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${IDENTITIES_API_BASE_URL}/lookup?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 404) {
      return null; // Not found
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Identity lookup failed.');
    }

    return data; // Example: { email: 'user@company.com', walletAddress: '0xabc...' }
  } catch (error) {
    console.error('API Error (getBoldChainIdentity):', error);
    throw error;
  }
};

/**
 * Fetches a list of all publicly registered BoldChain identities (if applicable for your app).
 * @param {string} [token] - Optional authentication token.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of identity objects.
 * @throws {Error} If fetching fails.
 */
export const getAllRegisteredIdentities = async (token = null) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${IDENTITIES_API_BASE_URL}/all`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch registered identities.');
    }

    return data; // Example: [{ email: '...', walletAddress: '...' }]
  } catch (error) {
    console.error('API Error (getAllRegisteredIdentities):', error);
    throw error;
  }
};
