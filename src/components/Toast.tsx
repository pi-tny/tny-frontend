import { useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { ToastType } from "../context/ToastContext";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = "success", isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 z-50 flex max-w-[calc(100vw-2rem)] animate-slide-up items-center gap-2.5 rounded-xl px-5 py-3 text-black shadow-2xl ${
        isError ? "bg-danger" : "bg-price"
      }`}
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <Icon size={18} className="flex-shrink-0" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
};
