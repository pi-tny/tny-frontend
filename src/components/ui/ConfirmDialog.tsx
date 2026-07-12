import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** style the confirm button as destructive. */
  danger?: boolean;
}

/**
 * imperative confirm dialog. Returns `confirm(opts)` returning a Promise<boolean>
 * and `dialog`, an element the caller renders once in its tree. Replaces
 * `window.confirm` with a themed modal.
 */
export function useConfirm() {
  const [state, setState] = useState<{
    opts: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ opts, resolve })),
    [],
  );

  const resolve = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  const dialog = state ? (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-[fade-in_0.15s_ease-out]"
      onClick={() => resolve(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-card border border-line bg-surface-2 p-6 shadow-xl animate-[slide-up_0.2s_ease-out]"
      >
        <h2 className="text-lg font-semibold text-ink">{state.opts.title}</h2>
        {state.opts.description && <p className="mt-2 text-sm text-ink-muted">{state.opts.description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => resolve(false)}>
            {state.opts.cancelLabel ?? "Cancelar"}
          </Button>
          <Button variant={state.opts.danger ? "danger" : "primary"} onClick={() => resolve(true)}>
            {state.opts.confirmLabel ?? "Confirmar"}
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
