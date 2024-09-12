import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  formatIncompletePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js";

const EnterPhone = ({ onSendCode, phone, setPhone }) => {
  const handlePhoneChange = (value) => {
    const formattedNumber = formatIncompletePhoneNumber(value, "US");
    setPhone(formattedNumber);
  };

  return (
    <form onSubmit={onSendCode} className="space-y-4">
      <div>
        <label htmlFor="phone" className="form-label">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="(555) 555-5555"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="w-full input-tertiary"
          required
        />
      </div>
      <button
        id="send-code-button"
        type="submit"
        className="w-full tertiary-btn"
      >
        Login with Phone
      </button>
      <div id="recaptcha-container"></div>
    </form>
  );
};

const EnterCode = ({ onVerifyCode, verificationCode, setVerificationCode }) => {
  return (
    <form onSubmit={onVerifyCode} className="space-y-4">
      <div>
        <label htmlFor="verificationCode" className="form-label">
          Verification Code
        </label>
        <input
          id="verificationCode"
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full input-tertiary"
          required
        />
      </div>
      <button
        id="verify-code-button"
        type="submit"
        className="w-full tertiary-btn"
      >
        Verify Code
      </button>
    </form>
  );
};

const LoginWithPhone = ({ setError }) => {
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { login, clearRecaptcha } = useAuth();

  const formatToE164 = (phoneNumber) => {
    try {
      const parsedNumber = parsePhoneNumber(phoneNumber, "US");
      return parsedNumber.format("E.164");
    } catch (error) {
      console.error("Error formatting phone number:", error);
      return phoneNumber;
    }
  };

  const handleSendCode = async (e) => {
    console.log("send code");
    e.preventDefault();
    setError("");

    if (!isValidPhoneNumber(phone, "US")) {
      setError("Please enter a valid US phone number.");
      return;
    }

    try {
      const formattedPhone = formatToE164(phone);
      const result = await login("phone", {
        phoneNumber: formattedPhone,
        buttonId: "send-code-button",
      });

      if (result && result.verificationId) {
        setVerificationId(result.verificationId);
        setIsCodeSent(true);
      } else {
        throw new Error("Failed to send verification code");
      }
    } catch (error) {
      setError(error.message);
      clearRecaptcha();
    }
  };

  const handleVerifyCode = async (e) => {
    console.log("verify");
    e.preventDefault();

    if (!verificationId || !verificationCode) {
      setError("Verification ID or code is missing");
      return;
    }

    try {
      const result = await login("phone", {
        verificationId,
        verificationCode,
      });

      if (!result) {
        throw new Error("Failed to verify code");
      }
    } catch (error) {
      console.error("Error in handleVerifyCode:", error);
      setError(error.message);
      clearRecaptcha();
    }
  };

  return (
    <div>
      {!isCodeSent ? (
        <EnterPhone
          onSendCode={handleSendCode}
          phone={phone}
          setPhone={setPhone}
        />
      ) : (
        <EnterCode
          onVerifyCode={handleVerifyCode}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
        />
      )}
    </div>
  );
};

export default LoginWithPhone;
