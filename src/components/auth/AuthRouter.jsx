import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import CreateAccount from "./createAccount/CreateAccount";
import Login from "./login/Login";
import VerifyPhone from "./login/VerifyPhone";

const AuthRouter = () => {
  const location = useLocation();
  const isCreatePage = location.pathname === "/auth/create-account";

  return (
    <div className="max-w-md pt-8 mx-auto h-screen-minus-nav container-padding bg-neutral-100">
      <div className="p-6 card">
        <div className="mb-6 text-lg font-semibold flex-between">
          <Link
            to="/auth/login"
            className={`w-1/2 text-center py-2 ${
              !isCreatePage
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-primary"
            }`}
          >
            Login
          </Link>
          <Link
            to="/auth/create-account"
            className={`w-1/2 text-center py-2 ${
              isCreatePage
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-primary"
            }`}
          >
            Create Account
          </Link>
        </div>

        <Routes>
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-phone" element={<VerifyPhone />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AuthRouter;
