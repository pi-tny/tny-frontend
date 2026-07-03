export function ProductDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-[#111] min-h-screen text-white p-4">
      <button onClick={onBack} className="text-xs text-neutral-400 mb-4">← Voltar</button>
      
      <div className="h-80 bg-neutral-900 rounded-2xl mb-6" />
      
      <h1 className="text-2xl font-bold mb-2">T-shirt Premium</h1>
      <p className="text-xl font-semibold mb-4 text-emerald-400">R$ 89,90</p>
      
      <p className="text-neutral-400 text-sm mb-6">
        Descrição detalhada do produto.
      </p>
      
      <button className="w-full bg-white text-black font-bold py-4 rounded-xl">
        Adicionar ao Carrinho
      </button>
    </div>
  );
}