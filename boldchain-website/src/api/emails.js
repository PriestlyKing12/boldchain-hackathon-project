// src/api/emails.js
import { API_BASE_URL } from '../utils/constants';

/**
 * @file Frontend API client for BoldChain Email sending and verification.
 * This module defines functions to interact with the backend's email service endpoints.
 * All core cryptographic operations (hashing, signing, encryption, decryption)
 * are handled securely on the backend.
 */

const EMAILS_API_BASE_URL = `${API_BASE_URL}/emails`; // Example: /api/emails

/**
 * Sends an email via the BoldChain service.
 * The backend will handle canonicalization, hashing, signing with private key,
 * and actual email dispatch.
 * @param {Object} emailData - The email details.
 * @param {string} emailData.from - The sender's email address.
 * @param {string} emailData.to - The recipient's email address.
 * @param {string} emailData.subject - The email subject.
 * @param {string} emailData.body - The email body (plaintext).
 * @param {boolean} [emailData.encrypt=false] - Whether to request encryption.
 * @param {string} [token] - Authentication token for the sender.
 * @returns {Promise<Object>} A promise resolving with the sent email confirmation (e.g., messageId).
 * @throws {Error} If sending fails.
 */
export const sendBoldChainEmail = async ({ from, to, subject, body, encrypt = false }, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${EMAILS_API_BASE_URL}/send`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ from, to, subject, body, encrypt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send BoldChain email.');
    }

    return data; // Example: { message: 'Email sent successfully', messageId: '...', boldChainSignature: '...' }
  } catch (error) {
    console.error('API Error (sendBoldChainEmail):', error);
    throw error;
  }
};

/**
 * Requests the backend to verify a received email.
 * The backend will extract BoldChain headers, lookup sender's public key,
 * re-hash content, and perform cryptographic signature verification.
 * @param {string} rawEmailContent - The full raw content of the received email (including headers).
 * @param {string} [token] - Optional authentication token if verification is for a logged-in user.
 * @returns {Promise<Object>} A promise resolving with the verification status.
 * @throws {Error} If the verification request fails.
 */
export const verifyReceivedEmail = async (rawEmailContent, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${EMAILS_API_BASE_URL}/verify`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ rawEmailContent }), // Backend parses this to extract relevant parts
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Email verification failed.');
    }

    return data; // Example: { status: 'Verified'|'Tampered'|'Unverified', details: '...', senderEmail: '...', senderWallet: '...' }
  } catch (error) {
    console.error('API Error (verifyReceivedEmail):', error);
    throw error;
  }
};

/**
 * Requests the backend to decrypt an encrypted email body.
 * Assumes the frontend has obtained the necessary keys/context from backend.
 * @param {string} encryptedBody - The encrypted content of the email.
 * @param {string} decryptionKeyContext - Information needed by backend to decrypt (e.g., messageId, user session).
 * @param {string} token - Authentication token.
 * @returns {Promise<Object>} A promise resolving with the decrypted plaintext body.
 * @throws {Error} If decryption fails.
 */
export const decryptEmailBody = async (encryptedBody, decryptionKeyContext, token) => {
  try {
    const response = await fetch(`${EMAILS_API_BASE_URL}/decrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ encryptedBody, decryptionKeyContext }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Email decryption failed.');
    }

    return data; // Example: { decryptedBody: 'Your plaintext message' }
  } catch (error) {
    console.error('API Error (decryptEmailBody):', error);
    throw error;
  }
};

// Add other email-related functions as needed (e.g., fetchInbox, fetchSentEmails)
