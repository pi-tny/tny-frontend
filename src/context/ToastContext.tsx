/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";

export type ToastType = "success" | "error";

export type ToastContextValue = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
  message: string;
  type: ToastType;
  isVisible: boolean;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (msg: string, toastType: ToastType = "success", duration = 3000) => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), duration);
  };

  const hideToast = () => setIsVisible(false);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, message, type, isVisible }}>
      {children}
    </ToastContext.Provider>
  );
}
