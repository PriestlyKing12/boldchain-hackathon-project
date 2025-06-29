// src/api/auth.js
// Firebase Authentication specific imports
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

/**
 * Logs in a user using Firebase Authentication.
 * @param {Object} auth - The Firebase Auth instance from App.jsx.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{uid: string, email: string, name: string, token: string}>} - User object with Firebase UID and ID token.
 */
export const loginUser = async (auth, email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Get the ID token for API calls
    console.log("Firebase Auth: Login successful for", user.email);
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0], // Use displayName if available, or derive from email
      token: token,
    };
  } catch (error) {
    console.error("Firebase Auth: Login failed:", error.code, error.message);
    let errorMessage = "Login failed. Please check your credentials.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many login attempts. Please try again later.";
    }
    throw new Error(errorMessage);
  }
};

/**
 * Registers a new user using Firebase Authentication.
 * Note: Firebase Auth doesn't have a 'name' field directly in createUserWithEmailAndPassword.
 * You'd typically store name in Firestore after successful registration.
 * For this mock, we'll simulate setting a display name.
 * @param {Object} auth - The Firebase Auth instance from App.jsx.
 * @param {string} name - User's display name (will be set as displayName).
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{uid: string, email: string, name: string, token: string}>} - User object with Firebase UID and ID token.
 */
export const registerNewSystemUser = async (auth, name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optional: Set display name immediately after creation (not directly part of createUserWithEmailAndPassword)
    // In a real app, you might update profile in Firestore after this.
    // await updateProfile(user, { displayName: name }); // If you want to set display name in Firebase Auth itself

    const token = await user.getIdToken();
    console.log("Firebase Auth: Registration successful for", user.email);
    return {
      uid: user.uid,
      email: user.email,
      name: name, // Use the provided name
      token: token,
    };
  } catch (error) {
    console.error("Firebase Auth: Registration failed:", error.code, error.message);
    let errorMessage = "Registration failed. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already registered.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password is too weak. Please use at least 6 characters.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email address.";
    }
    throw new Error(errorMessage);
  }
};
