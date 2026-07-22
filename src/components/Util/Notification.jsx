import { createContext, useContext, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '', tone: 'error', show: false,
  });
  // one timer, always cleared before reuse -- the old per-call timeouts
  // captured stale state and hid NEWER messages early
  const timerRef = useRef();

  const showNotification = (message, tone = 'error') => {
    clearTimeout(timerRef.current);
    if (!message) {
      setNotification((current) => ({ ...current, show: false }));
      return;
    }
    setNotification({ message, tone, show: true });
    timerRef.current = setTimeout(() => {
      setNotification((current) => ({ ...current, show: false }));
    }, 4000);
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

/** Semantic tones -- callers say WHAT happened, never which border class.
 * success: it worked. warning: fix your input / heads up. error: it broke. */
const TONES = {
  success: {
    border: 'border-tertiary',
    icon: 'text-tertiary',
    Icon: CheckCircleOutlineIcon,
  },
  warning: {
    border: 'border-yellow-500',
    icon: 'text-yellow-600',
    Icon: WarningAmberOutlinedIcon,
  },
  error: {
    border: 'border-errorRed',
    icon: 'text-errorRed',
    Icon: ErrorOutlineIcon,
  },
};

const Notification = ({ message, tone = 'error', onClose }) => {
  const { border, icon, Icon } = TONES[tone] || TONES.error;
  return (
    <div
      className={`fixed top-[70px] left-0 right-0 z-50 p-3 mx-4 text-sm bg-white
        border rounded-lg shadow-lg border-l-4 sm:mx-auto sm:max-w-md
        text-near-black ${border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon sx={{ fontSize: 18 }} className={`shrink-0 mt-0.5 ${icon}`} />
        <span className="flex-grow min-w-0 pt-0.5">{message}</span>
        <button onClick={onClose} className="shrink-0 text-light">
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
