import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import {
  signInUserWithEmail,
  signInWithPhone,
  confirmPhoneSignIn,
  signInWithGoogle,
  createUserWithEmail,
  logoutFirebase,
  passwordReset,
  clearRecaptcha,
} from "../firebase/loginMethods";
import { getUser } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingInvite, setPendingInvite] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          const data = await getUser();
          setUser(data);

          // Check for pending invite
          if (pendingInvite && user.account_complete) {
            navigate(pendingInvite);
            setPendingInvite(null);
          }
        } catch (error) {
          console.error("Error fetching Django user:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, navigate, pendingInvite]);

  useEffect(() => {
    // Check for invite in the URL
    if (location.pathname.startsWith("/invite/") && !firebaseUser) {
      setPendingInvite(location.pathname);
      navigate("/auth/login", { state: { from: location } });
    }
  }, [location, firebaseUser, navigate]);

  const login = async (method, credentials) => {
    switch (method) {
      case "email":
        return signInUserWithEmail(
          auth,
          credentials.email,
          credentials.password
        );
      case "phone":
        if (credentials.verificationId && credentials.verificationCode) {
          return confirmPhoneSignIn(
            auth,
            credentials.verificationId,
            credentials.verificationCode
          );
        } else {
          return signInWithPhone(
            auth,
            credentials.phoneNumber,
            credentials.buttonId
          );
        }
      case "google":
        return signInWithGoogle(auth);
      default:
        throw new Error(`Unsupported login method: ${method}`);
    }
  };

  const signUp = async (email, password) => {
    try {
      const result = await createUserWithEmail(auth, email, password);

      // Wait for auth state to update
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve();
          }
        });
      });

      return result;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await logoutFirebase(auth);
    setFirebaseUser(null);
    setUser(null);
  };

  const resetPassword = async (email) => {
    return passwordReset(auth, email);
  };

  const value = {
    firebaseUser,
    user,
    login,
    signUp,
    logout,
    resetPassword,
    clearRecaptcha,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
