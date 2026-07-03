import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import type { CartItem } from "../types";
import { CarrinhoContext } from "../context/CarrinhoContext";

export function Checkout() {
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const context = useContext(CarrinhoContext);

  useEffect(() => {
    const storedCarrinho = localStorage.getItem("tny_carrinho");
    if (storedCarrinho) {
      try {
        setCarrinho(JSON.parse(storedCarrinho));
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    }
  }, []);

  // Função para lidar com o clique nos botões de + e -
  const handleUpdate = (id: number, color: string, size: string, delta: number) => {
    if (!context) return;
    
    // Atualiza no contexto (que salva no localStorage)
    context.updateQuantity(id, color, size, delta);
    
    // Atualiza o estado local para renderizar imediatamente
    setCarrinho((prev) => 
      prev.map((item) => 
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const total = carrinho.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleEnviarWhatsApp = () => {
    if (!context) return;
    const mensagem = context.gerarMensagemWhatsApp();
    const numeroWhatsApp = "5585981025616"; 
    const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#060606] px-4 py-6 text-white sm:px-6 lg:px-8">
      <Link to="/carrinho" className="mb-6 inline-block text-sm text-neutral-400">
        ← Voltar
      </Link>

      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-[#121212] p-6 shadow-2xl sm:p-8">
        {/* ... (cabeçalho mantido igual) */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Grade de Imagens + Controles de Quantidade */}
          <div className="space-y-4 rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <h3 className="text-sm font-semibold text-neutral-400">Produtos no pedido</h3>
            <div className="grid gap-4">
              {carrinho.map((item, index) => (
                <div key={index} className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#1c1c1c] p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button 
                        onClick={() => handleUpdate(item.id, item.color, item.size, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                      >-</button>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdate(item.id, item.color, item.size, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo da Compra (mantido igual) */}
          <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <h2 className="text-lg font-semibold">Resumo da compra</h2>
            <div className="mt-4 space-y-3 text-sm text-neutral-300">
              {carrinho.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-base font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
            <button 
              onClick={handleEnviarWhatsApp}
              className="mt-6 w-full rounded-full bg-white px-4 py-3 font-semibold text-black hover:bg-neutral-200 transition"
            >
              Enviar para WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}