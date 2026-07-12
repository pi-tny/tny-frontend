import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminOrders } from "../../hooks/queries";
import type { OrderStatus } from "../../types";
import { Badge, Button, EmptyState, Spinner, cn } from "../../components/ui";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  orderStatusLabel,
  orderStatusTone,
  formatBRL,
  formatDateTime,
} from "../../lib/orders";

const PAGE_SIZE = 15;

export function Pedidos() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useAdminOrders({
    status: statusFilter ?? undefined,
    page,
    limit: PAGE_SIZE,
  });
  const items = data?.data ?? [];

  const selectStatus = (s: OrderStatus | null) => {
    setStatusFilter(s);
    setPage(1);
  };

  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.total_pages ?? 1;

  const chipClass = (active: boolean) =>
    cn(
      "rounded-pill border px-4 py-2 text-sm transition-colors duration-200",
      active
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-line bg-surface-2 text-ink-muted hover:border-line-strong",
    );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="mt-1 text-sm text-ink-muted">{total} pedido{total !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft size={16} /> Painel
        </Button>
      </div>

      {/* status filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => selectStatus(null)} className={chipClass(statusFilter === null)}>
          Todos
        </button>
        {ORDER_STATUSES.map((s) => (
          <button key={s} onClick={() => selectStatus(s)} className={chipClass(statusFilter === s)}>
            {ORDER_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-ink-muted">
          <Spinner className="h-6 w-6" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="Nenhum pedido encontrado" description="Os pedidos recebidos aparecerão aqui." />
      ) : (
        <div className="space-y-2">
          {items.map((o) => (
            <Link
              key={o.id}
              to={`/admin/pedidos/${o.id}`}
              className="flex items-center gap-4 rounded-card border border-line bg-surface-2 p-4 transition-colors hover:border-line-strong"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">#{o.id} · {o.name}</p>
                  <Badge tone={orderStatusTone(o.status)}>{orderStatusLabel(o.status)}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink-subtle">
                  {o.phone} · {formatDateTime(o.created_at)}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums">{formatBRL(o.total)}</p>
            </Link>
          ))}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
                ← Anterior
              </Button>
              <span className="text-sm text-ink-muted">
                {page} / {totalPages}
              </span>
              <Button variant="ghost" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                Próxima →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
