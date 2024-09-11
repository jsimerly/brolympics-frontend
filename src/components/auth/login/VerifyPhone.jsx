import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const VerifyPhone = () => {
  const [verCode, setVerCode] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationId, phoneNumber } = location.state || {};

  useEffect(() => {
    if (!verificationId || !phoneNumber) {
      navigate("/auth/login");
    }
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, [verificationId, phoneNumber, navigate]);

  const handleCodeChange = (index, value) => {
    const newVerCode = [...verCode];

    if (value.length === 6) {
      // Handle pasting of entire code
      for (let i = 0; i < 6; i++) {
        newVerCode[i] = value[i] || "";
      }
      setVerCode(newVerCode);
      inputRefs.current[5]?.focus();
    } else {
      // Handle single digit input
      newVerCode[index] = value.slice(-1);
      setVerCode(newVerCode);

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && verCode[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmCode = async () => {
    try {
      setError("");
      const code = verCode.join("");
      await login("phone", { verificationId, verificationCode: code });
      navigate("/");
    } catch (error) {
      setError(
        error.message || "An unexpected error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="p-3">
      <h2 className="text-center header-2">Verify Phone Number</h2>
      <p className="mb-4 text-center text-near-black">
        Enter the 6-digit code sent to <br /> {phoneNumber}
      </p>
      {error && (
        <p className="mb-4 text-sm text-center text-red-500">{error}</p>
      )}
      <div className="mb-4">
        <div className="flex justify-between">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={6}
              className="w-12 h-12 text-xl text-center border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={verCode[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => {
                e.preventDefault();
                const pastedData = e.clipboardData
                  .getData("text/plain")
                  .slice(0, 6);
                handleCodeChange(index, pastedData);
              }}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleConfirmCode}
        className="w-full primary-btn"
      >
        Confirm Code
      </button>
      <p className="mt-4 text-[12px] text-center">
        Didn't get a code? Touch luck, just try again later.
      </p>
    </div>
  );
};

export default VerifyPhone;
