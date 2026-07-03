import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PRODUTOS } from "../data/produtos";
import { useCarrinho } from "../context/useCarrinho";
import { useToast } from "../context/useToast";

const colorClasses: Record<string, string> = {
  Branco: "border-neutral-300 bg-white",
  Cinza: "border-neutral-400 bg-neutral-400",
  Preto: "border-black bg-black",
  Azul: "border-blue-600 bg-blue-600",
  Amarelo: "border-yellow-400 bg-yellow-400",
  Vermelho: "border-red-600 bg-red-600",
  Verde: "border-green-600 bg-green-600",
  Marrom: "border-amber-800 bg-amber-800",
};

export function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCarrinho();
  const { showToast } = useToast();
  const [selectedColor, setSelectedColor] = useState("Branco");

  const product = PRODUTOS.find((item) => item.id === Number(id));
  const availableColors = product?.colors && product.colors.length > 0 ? product.colors : ["Branco", "Cinza", "Preto", "Azul", "Amarelo", "Vermelho", "Verde", "Marrom"];

  useEffect(() => {
    if (availableColors[0]) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, selectedColor);
    showToast("Adicionado com sucesso!");
  };

  const handleFinalizeOrder = () => {
    if (!product) return;

    addToCart(product, selectedColor);
    showToast("Adicionado com sucesso!");
    navigate("/checkout");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#060606] p-6 text-white">
        <Link to="/" className="mb-6 inline-block text-sm text-neutral-400">
          ← Voltar para a loja
        </Link>
        <div className="rounded-[24px] border border-white/10 bg-[#141414] p-8 text-center">
          <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
          <p className="mt-2 text-sm text-neutral-400">Não foi possível localizar esse item no catálogo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] p-4 text-white sm:p-6 lg:p-8">
      <Link to="/" className="mb-6 inline-block text-sm text-neutral-400">
        ← Voltar para a loja
      </Link>

      <div className="mx-auto grid max-w-6xl gap-8 rounded-[32px] border border-white/10 bg-[#111111] p-4 shadow-2xl sm:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#191919]">
          <img src={product.image} alt={product.name} className="h-[420px] w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">{product.category}</p>
          <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-emerald-400">R$ {product.price.toFixed(2).replace(".", ",")}</p>

          <p className="mt-5 text-sm leading-7 text-neutral-300">{product.description}</p>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">Cores</p>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${selectedColor === color ? "border-white bg-white text-black" : "border-white/10 bg-[#1c1c1c] text-neutral-200"}`}
                >
                  <span className={`h-4 w-4 rounded-full border ${colorClasses[color] ?? "border-neutral-300 bg-white"}`} />
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
            >
              Adicionar ao carrinho
            </button>
            <button
              type="button"
              onClick={handleFinalizeOrder}
              className="flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Finalizar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
