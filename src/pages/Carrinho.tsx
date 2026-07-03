import { Link } from "react-router-dom";
import { useCarrinho } from "../context/useCarrinho";

export function Carrinho() {
  const { cart, totalItems, subtotal, updateQuantity, removeFromCart, gerarMensagemWhatsApp } = useCarrinho();

  const handleCheckout = () => {
    const message = encodeURIComponent(gerarMensagemWhatsApp());
    window.open(`https://wa.me/5585981025616?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#060606] px-4 py-6 text-white sm:px-6 lg:px-8">
      <Link to="/" className="mb-6 inline-block text-sm text-neutral-400">
        ← Voltar
      </Link>

      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#121212] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Carrinho</p>
            <h1 className="mt-2 text-3xl font-semibold">Seus itens selecionados</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-neutral-300">
            {totalItems} itens
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-[#171717] p-8 text-center text-neutral-400">
                <p className="text-lg font-semibold text-white">Seu carrinho está vazio</p>
                <p className="mt-2 text-sm">Adicione um produto para começar a montar seu pedido.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-[#171717] p-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <p className="text-base font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-neutral-400">{item.color} • {item.size}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-400">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0f0f10] px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.color, item.size, -1)} className="h-7 w-7 rounded-full text-lg text-white">
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.color, item.size, 1)} className="h-7 w-7 rounded-full text-lg text-white">
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.color, item.size)} className="text-sm text-neutral-400">
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <h2 className="text-lg font-semibold">Resumo</h2>
            <div className="mt-4 space-y-3 text-sm text-neutral-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
            <button onClick={handleCheckout} disabled={cart.length === 0} className="mt-6 w-full rounded-full bg-white px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
