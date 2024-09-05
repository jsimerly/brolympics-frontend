import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  formatIncompletePhoneNumber,
  isValidPhoneNumber,
} from "libphonenumber-js";

const formatToE164 = (phoneNumber) => {
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    return `+${digitsOnly}`;
  } else {
    return phoneNumber;
  }
};

const LoginWithPhone = ({ setError }) => {
  const [phone, setPhone] = useState("");
  const { login, clearRecaptcha } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (value) => {
    // Format the phone number as the user types
    const formattedNumber = formatIncompletePhoneNumber(value, "US");
    setPhone(formattedNumber);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

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
      // Navigate to the verification page, passing the verificationId and phone number
      navigate("/auth/verify-phone", {
        state: {
          verificationId: result.verificationId,
          phoneNumber: formattedPhone,
        },
      });
    } catch (error) {
      setError(error.message);
      clearRecaptcha();
    }
  };

  return (
    <form onSubmit={handleSendCode} className="mb-4">
      <span className="block mb-2 text-sm font-bold text-gray-300">
        By Phone
      </span>
      <div className="mb-4">
        <input
          type="tel"
          id="phone"
          placeholder="(555) 555-5555"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="w-full p-2 mb-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        id="send-code-button"
        type="submit"
        className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login with Phone
      </button>
    </form>
  );
};

export default LoginWithPhone;
