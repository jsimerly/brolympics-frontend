import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import CreateAccount from "./createAccount/CreateAccount";
import Login from "./login/Login";
import VerifyPhone from "./login/VerifyPhone";

const AuthRouter = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";

  return (
    <div className="max-w-md pt-6 pb-3 mx-auto bg-gray-800 rounded-lg shadow-xl">
      <div className="flex justify-around w-full mb-6 text-lg font-semibold">
        <Link
          to="/auth/login"
          className={`w-1/3 text-center ${
            isLoginPage ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
          }`}
        >
          Login
        </Link>
        <span className="text-gray-500">|</span>
        <Link
          to="/auth/create-account"
          className={`w-1/3 text-center${
            !isLoginPage ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
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
  );
};

export default AuthRouter;
