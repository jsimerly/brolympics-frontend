import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const LoginWithEmail = ({ setError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      await login("email", { email, password });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleEmailLogin} className="mb-4">
      <span>By Email</span>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login with Email
      </button>
    </form>
  );
};

export default LoginWithEmail;
