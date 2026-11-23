import { useState, useEffect } from "react";

// Works like useState, but the value is also saved in localStorage,
// so it is still there after the page is refreshed.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage can be full or blocked; the app still works without it
    }
  }, [key, value]);

  return [value, setValue];
}
