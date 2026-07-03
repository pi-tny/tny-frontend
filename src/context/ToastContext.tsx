import { createContext, useState, type ReactNode } from "react";

export type ToastContextValue = {
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
  message: string;
  isVisible: boolean;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (msg: string, duration = 3000) => {
    setMessage(msg);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, message, isVisible }}>
      {children}
    </ToastContext.Provider>
  );
}
