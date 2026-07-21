import { createContext, useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: '', className: '', show: false });

  const showNotification = (message, className) => {
    setNotification({ message, className, show: true });
    if (!message) {
      setNotification({...notification, show: false})
    }
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext)
}

import React from 'react'

const Notification = ({ message, className = "", onClose }) => {
  return (
    <div
      className={`fixed top-[70px] left-0 right-0 z-50 p-3 mx-4 text-sm bg-white
        border rounded-lg shadow-lg border-l-4 sm:mx-auto sm:max-w-md
        text-near-black ${className || "border-errorRed"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 pt-0.5">{message}</span>
        <button onClick={onClose} className="shrink-0 text-light">
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};

export default Notification;