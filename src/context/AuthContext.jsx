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

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          const data = await getUser();
          setUser(data);
        } catch (error) {
          console.error("Error fetching Django user:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

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
    return createUserWithEmail(auth, email, password);
  };

  const logout = async () => {
    await logoutFirebase(auth);
    setFirebaseUser(null);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
