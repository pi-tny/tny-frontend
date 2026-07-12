import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "./cn";
import { useClickOutside } from "./useClickOutside";

export interface ComboboxItem {
  value: number;
  label: string;
  description?: string | null;
}

interface ComboboxProps {
  items: ComboboxItem[];
  /** whether a given item's value is currently selected (drives the check mark). */
  isSelected: (value: number) => boolean;
  /** parent decides toggle (multi) vs replace (single) semantics. */
  onSelect: (value: number) => void;
  /** content rendered inside the trigger button. */
  triggerContent: ReactNode;
  searchPlaceholder?: string;
  /** rendered when no item matches the current query. */
  emptyLabel?: (query: string) => ReactNode;
  /** extra row at the bottom of the list (e.g. a "create" action). */
  footer?: (ctx: { query: string; close: () => void; clearQuery: () => void }) => ReactNode;
  /** close the popover after a selection (use for single-select). */
  closeOnSelect?: boolean;
  align?: "left" | "right";
  className?: string;
  /** merged after the default trigger classes (e.g. to size it like a chip). */
  triggerClassName?: string;
  disabled?: boolean;
}

/**
 * searchable dropdown (Command-style) built on the design tokens. Selection state
 * is fully controlled by the parent; this component only owns open/query/keyboard.
 */
export function Combobox({
  items,
  isSelected,
  onSelect,
  triggerContent,
  searchPlaceholder = "Buscar...",
  emptyLabel,
  footer,
  closeOnSelect = false,
  align = "left",
  className,
  triggerClassName,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => setOpen(false);
  useClickOutside(containerRef, close, open);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.label.toLowerCase().includes(q));
  }, [items, query]);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    setQuery("");
    setHighlight(0);
    // focus the search field once the popover is mounted.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelect = (value: number) => {
    onSelect(value);
    if (closeOnSelect) close();
  };

  const footerContent = footer
    ? footer({ query: query.trim(), close, clearQuery: () => setQuery("") })
    : null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[highlight];
      if (item) handleSelect(item.value);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => (open ? close() : openMenu())}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-pill border border-line bg-elevated px-4 py-3 text-left text-sm text-ink outline-none transition-colors duration-200 hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent/70 disabled:opacity-60",
          triggerClassName,
        )}
      >
        <span className="min-w-0 flex-1 truncate">{triggerContent}</span>
        <ChevronDown size={16} className={cn("flex-shrink-0 text-ink-subtle transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-30 mt-2 w-full min-w-[15rem] origin-top overflow-hidden rounded-[16px] border border-line bg-surface-2 shadow-xl animate-[fade-in_0.15s_ease-out]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-ink-muted">
            <Search size={15} className="flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
            />
          </div>

          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-center text-xs text-ink-subtle">
                {emptyLabel ? emptyLabel(query.trim()) : "Nenhum resultado."}
              </li>
            ) : (
              filtered.map((it, i) => {
                const selected = isSelected(it.value);
                return (
                  <li key={it.value} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(it.value)}
                      onMouseEnter={() => setHighlight(i)}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                        i === highlight ? "bg-white/5" : "",
                        selected ? "text-accent" : "text-ink",
                      )}
                    >
                      <Check
                        size={15}
                        className={cn("flex-shrink-0", selected ? "opacity-100" : "opacity-0")}
                      />
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {footerContent && <div className="border-t border-line p-1">{footerContent}</div>}
        </div>
      )}
    </div>
  );
}
