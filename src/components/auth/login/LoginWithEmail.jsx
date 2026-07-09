import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { afterAuthPath } from "../afterAuthPath";

const LoginWithEmail = ({ setError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login("email", { email, password });
      navigate(afterAuthPath(location));
    } catch (error) {
      setError(error.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleEmailLogin} className="space-y-4">
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
          autoComplete="current-password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full py-2.5 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
      >
        {busy ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginWithEmail;
