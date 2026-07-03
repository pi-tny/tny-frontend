import { useToast } from "../context/useToast";
import type { Produto } from "../types";

interface CardProdutoProps {
  produto: Produto;
  onAddToCart: (produto: Produto) => void;
}

export const CardProduto = ({ produto, onAddToCart }: CardProdutoProps) => {
  const { showToast } = useToast();

  const handleClick = () => {
    onAddToCart(produto);
    showToast("Adicionado com sucesso!");
  };

  return (
    <div className="border border-white/10 bg-[#141414] rounded-[24px] p-4 flex flex-col gap-3">
      <img src={produto.image} alt={produto.name} className="h-48 w-full object-cover rounded-xl" />
      <h3 className="text-white font-semibold">{produto.name}</h3>
      <p className="text-emerald-400 font-bold">R$ {produto.price.toFixed(2).replace(".", ",")}</p>
      <button 
        onClick={handleClick}
        className="bg-white text-black py-2 rounded-lg font-semibold hover:bg-neutral-200"
      >
        Adicionar
      </button>
    </div>
  );
};