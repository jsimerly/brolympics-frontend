import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const LoginWithGoogle = ({ setError }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError(""); // Clear any previous errors
    try {
      await login("google");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full p-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Login with Google
    </button>
  );
};

export default LoginWithGoogle;
