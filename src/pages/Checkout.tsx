import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrinho } from "../context/useCarrinho";
import { useToast } from "../context/useToast";
import { useCreateOrder } from "../hooks/mutations";
import { checkoutSchema, validateForm } from "../lib/validation";
import { Button, Field, Input, SafeImage } from "../components/ui";

const PAYMENT_OPTIONS = [
  { value: "to_be_defined", label: "A definir" },
  { value: "pix", label: "Pix" },
  { value: "credit_card", label: "Cartão de crédito" },
  { value: "cash", label: "Dinheiro" },
  { value: "bank_transfer", label: "Transferência bancária" },
  { value: "boleto", label: "Boleto" },
];

function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function Checkout() {
  const { cart, subtotal, updateQuantity, gerarMensagemWhatsApp, clearCart } = useCarrinho();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("to_be_defined");
  const createOrder = useCreateOrder();

  const allHaveVariantId = cart.every((item) => item.variantId !== undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validateForm(checkoutSchema, { name, phone }, (m) => showToast(m, "error"))) return;
    try {
      if (allHaveVariantId) {
        const order = await createOrder.mutateAsync({
          name,
          phone,
          email: email || undefined,
          payment_method: paymentMethod,
          items: cart.map((item) => ({ variant_id: item.variantId!, quantity: item.quantity })),
        });
        clearCart();
        window.open(order.whatsapp_url, "_blank", "noopener,noreferrer");
        navigate("/pedido-confirmado", { state: { orderId: order.id, total: order.total } });
      } else {
        const mensagem = gerarMensagemWhatsApp();
        clearCart();
        window.open(`https://wa.me/5585981025616?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener,noreferrer");
        navigate("/pedido-confirmado", { state: {} });
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erro ao finalizar pedido", "error");
    }
  };

  return (
    <div>
      <Link to="/carrinho" className="mb-5 inline-block text-sm text-ink-muted transition-colors duration-200 hover:text-ink">
        ← Voltar ao carrinho
      </Link>

      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Finalizar pedido</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {cart.length} {cart.length === 1 ? "produto" : "produtos"} no pedido
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
            {/* order summary */}
            <div className="rounded-[24px] border border-line bg-surface-2 p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-muted">Produtos selecionados</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex items-center gap-3 rounded-[16px] border border-line bg-elevated p-3"
                  >
                    <SafeImage src={item.image} alt={item.name} className="h-14 w-14 flex-shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-ink-subtle">
                        {item.color} · {item.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-pill border border-line bg-surface px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.color, item.size, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="Diminuir quantidade"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink transition-all duration-200 hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        −
                      </button>
                      <span className="min-w-[1.25rem] text-center text-xs font-medium tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.color, item.size, 1)}
                        aria-label="Aumentar quantidade"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink transition-all duration-200 hover:bg-white/10 active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatBRL(subtotal)}</span>
              </div>
            </div>

            {/* customer form */}
            <div className="rounded-[24px] border border-line bg-surface-2 p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-muted">Seus dados</h3>
              <div className="space-y-4">
                <Field label="Nome completo" htmlFor="checkout-name" required>
                  <Input
                    id="checkout-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </Field>
                <Field label="WhatsApp / Telefone" htmlFor="checkout-phone" required>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(85) 99999-9999"
                  />
                </Field>
                <Field label="E-mail (opcional)" htmlFor="checkout-email">
                  <Input
                    id="checkout-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </Field>
                <Field label="Forma de pagamento" htmlFor="checkout-payment">
                  <select
                    id="checkout-payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-pill border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent/60"
                  >
                    {PAYMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-surface text-ink">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Button type="submit" size="lg" loading={createOrder.isPending} disabled={cart.length === 0} className="mt-1 w-full">
                  {createOrder.isPending ? "Enviando" : "Finalizar via WhatsApp"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
