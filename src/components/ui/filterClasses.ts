import { cn } from "./cn";

// shared filter control styles for the storefront and admin filter bars.

/** pill-style selector chip (e.g. category, status). Active = solid white. */
export const chipClass = (active: boolean) =>
  cn(
    "flex-shrink-0 rounded-pill border px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
    active
      ? "border-white bg-white font-medium text-black"
      : "border-line bg-surface-2 text-ink-muted hover:border-line-strong",
  );

/** smaller toggle chip (e.g. promoção, em estoque). Active = subtle gold. */
export const toggleClass = (active: boolean) =>
  cn(
    "rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
    active
      ? "border-accent/60 bg-accent/15 text-accent"
      : "border-line bg-surface-2 text-ink-muted hover:border-line-strong",
  );
