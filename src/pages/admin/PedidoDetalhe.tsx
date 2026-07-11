import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { adminGetOrder, adminUpdateOrderStatus } from "../../services/api";
import type { OrderDetail, OrderStatus } from "../../types";
import { useToast } from "../../context/useToast";
import { Badge, Button, Spinner, cn } from "../../components/ui";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  orderStatusLabel,
  orderStatusTone,
  PAYMENT_LABEL,
  formatBRL,
  formatDateTime,
} from "../../lib/orders";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right text-ink">{value}</span>
    </div>
  );
}

export function PedidoDetalhe() {
  const { id } = useParams();
  const orderId = Number(id);
  const { showToast } = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<OrderStatus | null>(null);

  useEffect(() => {
    adminGetOrder(orderId)
      .then((o) => {
        setOrder(o);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, [orderId]);

  const changeStatus = async (status: OrderStatus) => {
    setUpdating(status);
    try {
      const updated = await adminUpdateOrderStatus(orderId, status);
      setOrder(updated);
      showToast(`Pedido marcado como "${ORDER_STATUS_LABEL[status]}".`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Erro ao atualizar status", "error");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink-muted">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link to="/admin/pedidos" className="mb-6 inline-block text-sm text-ink-muted hover:text-ink">
          ← Voltar aos pedidos
        </Link>
        <div className="rounded-card border border-danger/20 bg-danger/5 p-8 text-center text-danger">
          {error ?? "Pedido não encontrado"}
        </div>
      </div>
    );
  }

  const whatsappHref = `https://wa.me/${order.phone.replace(/\D/g, "")}`;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/pedidos" className="mb-5 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={15} /> Voltar aos pedidos
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">Pedido #{order.id}</h1>
          <Badge tone={orderStatusTone(order.status)}>{orderStatusLabel(order.status)}</Badge>
        </div>
        <p className="text-sm text-ink-subtle">{formatDateTime(order.created_at)}</p>
      </div>

      {/* Alterar status */}
      <section className="mb-4 rounded-card border border-line bg-surface-2 p-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">Status</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => {
            const isCurrent = order.status === s;
            return (
              <Button
                key={s}
                variant={isCurrent ? "primary" : "outline"}
                size="sm"
                loading={updating === s}
                disabled={isCurrent}
                onClick={() => changeStatus(s)}
              >
                {ORDER_STATUS_LABEL[s]}
              </Button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Cliente */}
        <section className="space-y-3 rounded-card border border-line bg-surface-2 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">Cliente</h2>
          <InfoRow label="Nome" value={order.name} />
          <InfoRow label="Telefone" value={order.phone} />
          {order.email && <InfoRow label="E-mail" value={order.email} />}
          <InfoRow label="Pagamento" value={PAYMENT_LABEL[order.payment_method] ?? order.payment_method} />
          {order.message && <InfoRow label="Mensagem" value={order.message} />}
          {order.notes && <InfoRow label="Observações" value={order.notes} />}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-pill border border-line bg-white/5 px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-white/10"
          >
            <MessageCircle size={16} /> Contatar no WhatsApp
          </a>
        </section>

        {/* Itens */}
        <section className="space-y-3 rounded-card border border-line bg-surface-2 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">Itens</h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className={cn("flex items-center justify-between gap-3 rounded-[14px] border border-line bg-elevated p-3")}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-ink-subtle">
                    {item.color} · {item.size} · {item.quantity}× {formatBRL(item.unit_price)}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{formatBRL(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3 text-base font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatBRL(order.total)}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
