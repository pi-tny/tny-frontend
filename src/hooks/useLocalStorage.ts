import { useCallback, useEffect, useState } from "react";

// state persisted to localStorage under `key`, kept in sync across tabs.
// mirrors the useState api, so callers get `[value, setValue]`.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // reflect changes made in other tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) setValue(JSON.parse(e.newValue) as T);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const set = useCallback<React.Dispatch<React.SetStateAction<T>>>((next) => {
    setValue(next);
  }, []);

  return [value, set] as const;
}
