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
    <form onSubmit={handleSendCode} className="space-y-4">
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
    </form>
  );
};

export default LoginWithPhone;
