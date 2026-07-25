import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";

// Firebase config from Firebase console (these are public-safe values)
const firebaseConfig = {
  apiKey: "AIzaSyAkQonic-U2m62vyeUFEM198BQj9VmJwrI",
  authDomain: "gymweb-8a3d4.firebaseapp.com",
  projectId: "gymweb-8a3d4",
  storageBucket: "gymweb-8a3d4.firebasestorage.app",
  messagingSenderId: "227810370754",
  appId: "1:227810370754:web:a10ea98147d40ebb9a875b",
  measurementId: "G-41T48TSGVE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Add required scopes
googleProvider.addScope("email");
googleProvider.addScope("profile");
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * Returns the Firebase ID token after Google popup sign-in.
 * Falls back to redirect flow if popup is blocked.
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      idToken,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    };
  } catch (error) {
    // Popup was closed by user — don't throw a scary error
    if (
      error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request"
    ) {
      throw new Error("POPUP_CLOSED");
    }

    // Popup was blocked by the browser — use redirect instead
    if (error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider);
      // The page will reload; result is handled by checkRedirectResult()
      return null;
    }

    // Network or other error
    throw error;
  }
};

/**
 * Call this once on app mount to handle the result of a redirect sign-in.
 * Returns { idToken, displayName, email, photoURL } or null if no redirect.
 */
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const idToken = await result.user.getIdToken();
    return {
      idToken,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    };
  } catch {
    return null;
  }
};

export const firebaseSignOut = () => signOut(auth);
