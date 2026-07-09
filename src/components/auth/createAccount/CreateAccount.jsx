import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { afterAuthPath } from "../afterAuthPath";
import LoginWithGoogle from "../login/LoginWithGoogle";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await signUp(email, password);
      navigate(afterAuthPath(location));
    } catch (error) {
      setError(error.message);
      setBusy(false);
    }
  };

  return (
    <div>
      {error && <p className="mb-4 text-sm text-center text-red">{error}</p>}

      <LoginWithGoogle setError={setError} />

      <div className="flex items-center my-5">
        <div className="flex-grow border-t border-gray-200" />
        <span className="px-3 text-xs text-light">or with email</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input-primary"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full input-primary"
            autoComplete="new-password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full input-primary"
            autoComplete="new-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
        >
          {busy ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
