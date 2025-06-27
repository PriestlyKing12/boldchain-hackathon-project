// src/api/auth.js
import { API_BASE_URL } from '../utils/constants';

/**
 * @file Frontend API client for User Authentication services.
 * This module defines functions that interact with the backend's authentication endpoints.
 * All sensitive operations (password hashing, JWT generation, session management)
 * are handled securely on the backend.
 */

const AUTH_API_BASE_URL = `${API_BASE_URL}/auth`; // Example: /api/auth

/**
 * Logs a user in by sending credentials to the backend.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves with user data and/or a token on success.
 * @throws {Error} If the login fails (e.g., invalid credentials, network error).
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend should send meaningful error messages
      throw new Error(data.message || 'Login failed.');
    }

    // Example: Backend might return a user object and an access token
    return data; // { user: { id, email, name }, token: '...' }
  } catch (error) {
    console.error('API Error (loginUser):', error);
    throw error; // Re-throw to be handled by UI components
  }
};

/**
 * Logs a user out by invalidating their session/token on the backend.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Object>} A promise that resolves with a success message.
 * @throws {Error} If logout fails.
 */
export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token for authentication
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed.');
    }

    return data; // { message: 'Logged out successfully' }
  } catch (error) {
    console.error('API Error (logoutUser):', error);
    throw error;
  }
};

/**
 * Registers a new user.
 * This is distinct from BoldChain identity registration. This is for system access.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} name - The user's name.
 * @returns {Promise<Object>} A promise that resolves with new user data.
 * @throws {Error} If registration fails.
 */
export const registerNewSystemUser = async (email, password, name) => {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'User registration failed.');
    }

    return data; // { user: { id, email, name } }
  } catch (error) {
    console.error('API Error (registerNewSystemUser):', error);
    throw error;
  }
};

// Add other authentication-related functions as needed (e.g., refreshToken, forgotPassword)
