import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type Tone = "neutral" | "accent" | "price" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-black/70 text-white backdrop-blur-sm",
  accent: "bg-accent/15 text-accent",
  price: "bg-price/15 text-price",
  danger: "bg-danger/15 text-danger",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
