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

const Notification = ({ message, className, onClose }) => {
  return (
    <div className={`${className} p-2 fixed top-[70px] left-0 right-0 z-50 mx-6 rounded-md border-errorRed bg-white border text-neutralDark`}>
      <div className='flex items-start justify-between'>      
        {message}
        <button onClick={onClose}><CloseIcon/></button>
      </div>
    </div>
  );
};

export default Notification;