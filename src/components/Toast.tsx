import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 z-50">
      <p className="font-semibold">{message}</p>
    </div>
  );
};
