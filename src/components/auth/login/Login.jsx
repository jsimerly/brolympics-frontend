import React, { useState } from "react";
import LoginWithEmail from "./LoginWithEmail";
import LoginWithPhone from "./LoginWithPhone";
import LoginWithGoogle from "./LoginWithGoogle";

const Login = () => {
  const [error, setError] = useState("");

  return (
    <div className="p-4">
      <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
      {error && (
        <p className="mb-4 text-sm text-center text-red-500">{error}</p>
      )}

      <LoginWithEmail setError={setError} />

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="px-3 text-sm text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      <LoginWithPhone setError={setError} />

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="px-3 text-sm text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      <LoginWithGoogle setError={setError} />
    </div>
  );
};

export default Login;
