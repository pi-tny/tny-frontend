import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function PedidoConfirmado() {
  const location = useLocation();
  const state = (location.state as { orderId?: number; total?: number } | null) ?? {};

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-price/10">
        <CheckCircle size={40} className="text-price" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-ink sm:text-3xl">Pedido enviado!</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        Seu pedido foi registrado. Continue a conversa no WhatsApp para confirmar o pagamento e a entrega.
      </p>

      {(state.orderId || state.total != null) && (
        <div className="mt-6 w-full max-w-xs rounded-card border border-line bg-surface-2 p-5 text-sm">
          {state.orderId && (
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Nº do pedido</span>
              <span className="font-semibold tabular-nums">#{state.orderId}</span>
            </div>
          )}
          {state.total != null && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-ink-muted">Total</span>
              <span className="font-semibold tabular-nums text-price">{formatBRL(state.total)}</span>
            </div>
          )}
        </div>
      )}

      <Link
        to="/produtos"
        className="mt-7 inline-flex rounded-pill bg-white px-7 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100 active:scale-95"
      >
        Continuar comprando
      </Link>
    </div>
  );
}
