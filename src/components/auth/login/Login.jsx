import React, { useState } from "react";
import LoginWithEmail from "./LoginWithEmail";
import LoginWithPhone from "./LoginWithPhone";
import LoginWithGoogle from "./LoginWithGoogle";

const Login = () => {
  const [error, setError] = useState("");

  return (
    <div>
      {error && <p className="mb-4 text-center text-small text-red">{error}</p>}

      <LoginWithEmail setError={setError} />

      <div className="my-6 flex-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-small">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <LoginWithPhone setError={setError} />

      <div className="my-6 flex-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-small">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <LoginWithGoogle setError={setError} />
    </div>
  );
};

export default Login;
