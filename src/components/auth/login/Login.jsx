import { useState } from "react";
import LoginWithEmail from "./LoginWithEmail";
import LoginWithPhone from "./LoginWithPhone";
import LoginWithGoogle from "./LoginWithGoogle";

const Divider = ({ children }) => (
  <div className="flex items-center my-5">
    <div className="flex-grow border-t border-gray-200" />
    <span className="px-3 text-xs text-light">{children}</span>
    <div className="flex-grow border-t border-gray-200" />
  </div>
);

const Login = () => {
  const [error, setError] = useState("");
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div>
      {error && <p className="mb-4 text-sm text-center text-red">{error}</p>}

      <LoginWithGoogle setError={setError} />

      <Divider>or with email</Divider>

      <LoginWithEmail setError={setError} />

      {showPhone ? (
        <>
          <Divider>or with your phone</Divider>
          <LoginWithPhone setError={setError} />
        </>
      ) : (
        <button
          className="w-full pt-4 text-sm font-semibold text-center text-primary"
          onClick={() => setShowPhone(true)}
        >
          Use your phone number instead
        </button>
      )}
    </div>
  );
};

export default Login;
