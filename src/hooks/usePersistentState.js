import { useEffect, useState } from "react";

/** useState that survives refresh via sessionStorage. Values must be
 * JSON-serializable; storage failures degrade to plain state. */
const usePersistentState = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable -- state still works in memory */
    }
  }, [key, value]);
  return [value, setValue];
};

export const clearPersistentState = (...keys) => {
  for (const key of keys) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
};

export default usePersistentState;
