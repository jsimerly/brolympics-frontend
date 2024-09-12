import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { syncUserWithBackend } from "../api/auth";

// Recaptcha Verification
let recaptchaVerifier = null;

const initializeRecaptcha = (auth, buttonId) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA verified");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired");
      },
    });
  }
  return recaptchaVerifier;
};

export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
};

// Sign-In
export const signInUserWithEmail = async (auth, email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await syncUserWithBackend(userCredential.user);
    return userCredential;
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "The email address is not valid.";
        break;
      case "auth/invalid-credential":
        errorMessage = "The credentials entered are invalid.";
        break;
      case "auth/user-disabled":
        errorMessage = "This user account has been disabled.";
        break;
      case "auth/user-not-found":
        errorMessage = "There is no user corresponding to this email.";
        break;
      case "auth/wrong-password":
        errorMessage = "The password is invalid for the given email.";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "Too many unsuccessful login attempts. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "A network error occurred. Please check your connection.";
        break;
      default:
        errorMessage = "An unexpected error occurred. Please try again later.";
    }
    throw new Error(errorMessage);
  }
};

export const signInWithPhone = async (auth, phoneNumber, buttonId) => {
  try {
    const appVerifier = initializeRecaptcha(auth, buttonId);
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    return confirmationResult;
  } catch (error) {
    clearRecaptcha();
    let errorMessage;
    switch (error.code) {
      case "auth/invalid-phone-number":
        errorMessage =
          "The phone number is not valid. Please check and try again.";
        break;
      case "auth/missing-phone-number":
        errorMessage = "Please enter a phone number.";
        break;
      case "auth/quota-exceeded":
        errorMessage = "SMS quota exceeded. Please try again later.";
        break;
      case "auth/user-disabled":
        errorMessage =
          "This phone number has been disabled. Please contact support.";
        break;
      case "auth/operation-not-allowed":
        errorMessage =
          "Phone authentication is not enabled. Please contact support.";
        break;
      default:
        errorMessage = "An unexpected error occurred. Please try again later.";
    }
    throw new Error(errorMessage);
  }
};

export const confirmPhoneSignIn = async (
  auth,
  verificationId,
  verificationCode
) => {
  try {
    console.log("confirmPhoneSignin");
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    const result = await signInWithCredential(auth, credential);
    await syncUserWithBackend(result.user);
    clearRecaptcha();
    return result;
  } catch (error) {
    clearRecaptcha();
    console.error("Error in confirmPhoneSignIn:", error);
    let errorMessage;
    switch (error.code) {
      case "auth/invalid-verification-code":
        errorMessage =
          "The verification code is not valid. Please check and try again.";
        break;
      case "auth/missing-verification-code":
        errorMessage = "Please enter the verification code.";
        break;
      case "auth/code-expired":
        errorMessage =
          "The verification code has expired. Please request a new one.";
        break;
      default:
        errorMessage = "An unexpected error occurred. Please try again later.";
    }
    throw new Error(errorMessage);
  }
};

export const signInWithGoogle = async (auth) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await syncUserWithBackend(result.user);
    return result;
  } catch (error) {
    console.error("Error in signInWithGoogle:", error);
    let errorMessage;
    switch (error.code) {
      case "auth/account-exists-with-different-credential":
        errorMessage =
          "An account already exists with the same email address but different sign-in credentials. Try signing in using a different method.";
        break;
      case "auth/popup-blocked":
        errorMessage =
          "The sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
        break;
      case "auth/popup-closed-by-user":
        errorMessage =
          "The sign-in popup was closed before completing the sign-in process. Please try again.";
        break;
      case "auth/cancelled-popup-request":
        errorMessage = "The sign-in process was cancelled. Please try again.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "A network error occurred. Please check your internet connection and try again.";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "Too many unsuccessful sign-in attempts. Please try again later.";
        break;
      case "auth/user-disabled":
        errorMessage =
          "This account has been disabled. Please contact support for assistance.";
        break;
      default:
        errorMessage =
          "An unexpected error occurred during sign-in. Please try again.";
    }
    throw new Error(errorMessage);
  }
};

// Create Account
export const createUserWithEmail = async (auth, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await syncUserWithBackend(userCredential.user);
    return userCredential;
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage =
          "The email address is already in use by another account.";
        break;
      case "auth/invalid-email":
        errorMessage = "The email address is not valid.";
        break;
      case "auth/operation-not-allowed":
        errorMessage =
          "Email/password accounts are not enabled. Please contact support.";
        break;
      case "auth/weak-password":
        errorMessage =
          "The password is too weak. Please choose a stronger password.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "A network error occurred. Please check your connection.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many requests. Please try again later.";
        break;
      default:
        errorMessage = "An unexpected error occurred. Please try again later.";
    }
    throw new Error(errorMessage);
  }
};

// Sign Out
export const logoutFirebase = (auth) => {
  return auth.signOut();
};

// Password Reset
export const passwordReset = (auth, email) => {
  return sendPasswordResetEmail(auth, email);
};
