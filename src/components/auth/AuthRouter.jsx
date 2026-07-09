import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import CreateAccount from "./createAccount/CreateAccount";
import Login from "./login/Login";
import VerifyPhone from "./login/VerifyPhone";
import RingStrip from "../Util/RingStrip";
import { isInviteBound } from "./afterAuthPath";
import brologo from "../../assets/imgs/brologo.webp";

const AuthRouter = () => {
  const location = useLocation();
  const isCreatePage = location.pathname === "/auth/create-account";

  return (
    <div className="max-w-md pt-8 pb-16 mx-auto container-padding">
      <div className="flex flex-col items-center pb-6">
        <img src={brologo} alt="Brolympics" className="h-12" />
        <RingStrip className="w-20 mt-3" />
        {isInviteBound(location) && (
          <p className="px-4 py-2 mt-4 text-sm text-center border rounded-lg border-tertiary/40 bg-tertiary/5">
            <span className="font-semibold">You're invited!</span> Sign in to
            claim your spot.
          </p>
        )}
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <div className="flex text-sm font-semibold border-b border-gray-100">
          {[
            ["/auth/login", "Sign In", !isCreatePage],
            ["/auth/create-account", "Create Account", isCreatePage],
          ].map(([to, label, active]) => (
            <Link
              key={to}
              to={to}
              state={location.state}
              className={`w-1/2 py-3 text-center transition-colors ${
                active
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-light"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="p-6">
          <Routes>
            <Route path="create-account" element={<CreateAccount />} />
            <Route path="login" element={<Login />} />
            <Route path="verify-phone" element={<VerifyPhone />} />
            <Route path="*" element={<Navigate to="login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
