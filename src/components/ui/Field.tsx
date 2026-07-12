import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

const inputBase =
  "w-full rounded-pill border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-subtle focus:border-accent/60";

/** input styled with the design system tokens. */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(inputBase, className)} {...props} />;
  },
);

/** field with a visible label + input, following accessibility guidelines. */
export function Field({
  label,
  htmlFor,
  required,
  helper,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {children}
      {helper && <p className="text-xs text-ink-subtle">{helper}</p>}
    </div>
  );
}
