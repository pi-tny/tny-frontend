import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCarrinho } from "../context/useCarrinho";
import { Button, EmptyState, SafeImage, cn } from "../components/ui";

function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function Carrinho() {
  const { cart, totalItems, subtotal, updateQuantity, removeFromCart, gerarMensagemWhatsApp } = useCarrinho();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const getItemKey = (id: number, color: string, size: string) => `${id}-${color}-${size}`;


  const handleCheckout = () => {
    const message = encodeURIComponent(gerarMensagemWhatsApp());
    window.open(`https://wa.me/5585981025616?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <Link to="/produtos" className="mb-5 inline-block text-sm text-ink-muted transition-colors duration-200 hover:text-ink">
        ← Continuar comprando
      </Link>

      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Carrinho</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          {/* ─── Lista de itens ─── */}
          <div className="space-y-3">
            {cart.length === 0 ? (
              <EmptyState
                title="Seu carrinho está vazio"
                description="Adicione um produto para começar."
                action={
                  <Link
                    to="/produtos"
                    className="inline-flex rounded-pill bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100"
                  >
                    Ver produtos
                  </Link>
                }
              />
            ) : (
              cart.map((item) => {
                const key = getItemKey(item.id, item.color, item.size);
                const isConfirming = confirmDelete === key;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-[20px] border border-line bg-surface-2 p-3.5 sm:gap-4 sm:p-4"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 flex-shrink-0 rounded-[14px] object-cover sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium sm:text-base">{item.name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {item.color} · {item.size}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-price tabular-nums">
                        {formatBRL(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {/* Quantidade */}
                      <div className="flex items-center gap-1 rounded-pill border border-line bg-elevated px-1.5 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, -1)}
                          disabled={item.quantity <= 1}
                          aria-label="Diminuir quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, 1)}
                          aria-label="Aumentar quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-white/10 active:scale-90"
                        >
                          +
                        </button>
                      </div>
                      {/* Ações: ver produto + excluir → confirmar/cancelar */}
                      {isConfirming ? (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-pill border border-line px-2.5 py-1 text-[11px] font-medium text-ink-muted transition-all duration-200 hover:text-ink active:scale-95"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              removeFromCart(item.id, item.color, item.size);
                              setConfirmDelete(null);
                            }}
                            className="rounded-pill bg-danger px-2.5 py-1 text-[11px] font-semibold text-black transition-all duration-200 hover:brightness-110 active:scale-95"
                          >
                            Confirmar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/produto/${item.id}`}
                            aria-label={`Ver ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-subtle transition-colors duration-200 hover:bg-white/10 hover:text-ink"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(key)}
                            aria-label={`Remover ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-subtle transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ─── Resumo ─── */}
          <div className="rounded-[24px] border border-line bg-surface-2 p-5 md:sticky md:top-24 md:self-start">
            <h2 className="text-base font-semibold">Resumo do pedido</h2>
            <div className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <div className="flex items-center justify-between">
                <span>
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})
                </span>
                <span className="tabular-nums">{formatBRL(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Entrega</span>
                <span className="font-medium text-price">A combinar</span>
              </div>
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatBRL(subtotal)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className={cn(
                "mt-5 block rounded-pill bg-white px-4 py-3 text-center text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100 active:scale-[0.98]",
                cart.length === 0 && "pointer-events-none opacity-40",
              )}
            >
              Finalizar pedido
            </Link>
            <Button
              variant="ghost"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="mt-2 w-full"
            >
              Enviar direto pelo WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
