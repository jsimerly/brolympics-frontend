/** Provider linking + prior-account proof.
 *
 * Linking attaches another sign-in method (email/password, phone, Google) to
 * the CURRENT firebase user -- one uid, so all history is shared for free.
 * The prior-account helpers sign into an OLD account in a throwaway secondary
 * app (never touching the live session) and hand back its id token, which the
 * merge endpoint uses as proof of ownership.
 */
import { deleteApp, initializeApp } from "firebase/app";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  RecaptchaVerifier,
  connectAuthEmulator,
  getAuth,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./firebaseConfig";

const LINK_ERRORS = {
  "auth/credential-already-in-use":
    "That sign-in method belongs to another account. Use “Link a previous account” to bring its history over first.",
  "auth/email-already-in-use":
    "That email belongs to another account. Use “Link a previous account” to bring its history over first.",
  "auth/account-exists-with-different-credential":
    "That sign-in method belongs to another account. Use “Link a previous account” to bring its history over first.",
  "auth/provider-already-linked": "That method is already linked here.",
  "auth/requires-recent-login":
    "For security, sign out and back in, then try again.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/weak-password": "That password is too weak — try a longer one.",
  "auth/invalid-phone-number": "That phone number doesn't look right.",
  "auth/invalid-verification-code": "That code didn't match. Try again.",
  "auth/code-expired": "That code expired — request a new one.",
  "auth/popup-blocked": "Your browser blocked the popup — allow popups and retry.",
  "auth/popup-closed-by-user": "The popup closed before finishing. Try again.",
  "auth/invalid-credential": "Those details didn't match an account.",
  "auth/user-not-found": "Those details didn't match an account.",
  "auth/wrong-password": "Those details didn't match an account.",
};

const friendly = (error, fallback) =>
  new Error(LINK_ERRORS[error?.code] || fallback);

export const linkGoogle = async (auth) => {
  try {
    return await linkWithPopup(auth.currentUser, new GoogleAuthProvider());
  } catch (error) {
    throw friendly(error, "Couldn't link Google. Try again.");
  }
};

export const linkEmailPassword = async (auth, email, password) => {
  try {
    return await linkWithCredential(
      auth.currentUser,
      EmailAuthProvider.credential(email, password)
    );
  } catch (error) {
    throw friendly(error, "Couldn't link email & password. Try again.");
  }
};

/** Sends the SMS; returns a confirmation whose .confirm(code) finishes the
 * link. buttonId hosts the invisible reCAPTCHA. */
export const startPhoneLink = async (auth, phoneNumber, buttonId) => {
  const verifier = new RecaptchaVerifier(auth, buttonId, { size: "invisible" });
  try {
    const confirmation = await linkWithPhoneNumber(
      auth.currentUser,
      phoneNumber,
      verifier
    );
    return {
      confirm: async (code) => {
        try {
          return await confirmation.confirm(code);
        } catch (error) {
          throw friendly(error, "That code didn't work. Try again.");
        } finally {
          verifier.clear();
        }
      },
      cancel: () => verifier.clear(),
    };
  } catch (error) {
    verifier.clear();
    throw friendly(error, "Couldn't send the code. Check the number.");
  }
};

/** A throwaway firebase app: sign into the OLD account without disturbing
 * the live session, resolve its id token, then tear everything down. */
const withSecondaryAuth = async (run) => {
  const secondary = initializeApp(app.options, `prior-proof-${Date.now()}`);
  const secondaryAuth = getAuth(secondary);
  if (import.meta.env.VITE_FB_AUTH_EMULATOR) {
    connectAuthEmulator(
      secondaryAuth,
      `http://${import.meta.env.VITE_FB_AUTH_EMULATOR}`,
      { disableWarnings: true }
    );
  }
  const teardown = async () => {
    await secondaryAuth.signOut().catch(() => {});
    await deleteApp(secondary).catch(() => {});
  };
  return run(secondaryAuth, teardown);
};

export const priorAccountTokenWithEmail = (email, password) =>
  withSecondaryAuth(async (secondaryAuth, teardown) => {
    try {
      const cred = await signInWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      return await cred.user.getIdToken();
    } catch (error) {
      throw friendly(error, "Couldn't sign into that account.");
    } finally {
      await teardown();
    }
  });

export const priorAccountTokenWithGoogle = () =>
  withSecondaryAuth(async (secondaryAuth, teardown) => {
    try {
      const cred = await signInWithPopup(
        secondaryAuth,
        new GoogleAuthProvider()
      );
      return await cred.user.getIdToken();
    } catch (error) {
      throw friendly(error, "Couldn't sign into that account.");
    } finally {
      await teardown();
    }
  });

/** Phone proof is two-step: send the SMS now, resolve the token on
 * .confirm(code). Teardown runs whichever way it ends. */
export const startPriorAccountPhoneProof = (phoneNumber, buttonId) =>
  withSecondaryAuth(async (secondaryAuth, teardown) => {
    const verifier = new RecaptchaVerifier(secondaryAuth, buttonId, {
      size: "invisible",
    });
    try {
      const confirmation = await signInWithPhoneNumber(
        secondaryAuth,
        phoneNumber,
        verifier
      );
      return {
        confirm: async (code) => {
          try {
            const cred = await confirmation.confirm(code);
            return await cred.user.getIdToken();
          } catch (error) {
            throw friendly(error, "That code didn't work. Try again.");
          } finally {
            verifier.clear();
            await teardown();
          }
        },
        cancel: async () => {
          verifier.clear();
          await teardown();
        },
      };
    } catch (error) {
      verifier.clear();
      await teardown();
      throw friendly(error, "Couldn't send the code. Check the number.");
    }
  });
