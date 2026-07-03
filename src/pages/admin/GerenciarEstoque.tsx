import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Produto } from "../../types";

const PRODUTOS_STORAGE_KEY = "tny_produtos";

export function GerenciarEstoque() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar produtos do localStorage
    const storedProdutos = localStorage.getItem(PRODUTOS_STORAGE_KEY);
    if (storedProdutos) {
      try {
        const parsedProdutos = JSON.parse(storedProdutos);
        setProdutos(parsedProdutos);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setProdutos([]);
      }
    }
    setIsLoading(false);
  }, []);

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      const updatedProdutos = produtos.filter((p) => p.id !== id);
      setProdutos(updatedProdutos);
      localStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(updatedProdutos));
    }
  };

  const handleClearAll = () => {
    if (confirm("Tem certeza que deseja deletar TODOS os produtos?")) {
      setProdutos([]);
      localStorage.removeItem(PRODUTOS_STORAGE_KEY);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Estoque</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition"
            >
              ← Voltar
            </button>
            <button
              onClick={() => navigate("/admin/cadastro-produto")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition font-semibold"
            >
              + Novo Produto
            </button>
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="bg-[#141414] border border-white/10 rounded-xl p-8 text-center">
            <p className="text-neutral-400 mb-4">Nenhum produto cadastrado ainda.</p>
            <button
              onClick={() => navigate("/admin/cadastro-produto")}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition font-semibold inline-block"
            >
              Cadastrar Primeiro Produto
            </button>
          </div>
        ) : (
          <>
            <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#1a1a1a]">
                      <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Imagem</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Categoria</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Preço</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr key={produto.id} className="border-b border-white/10 hover:bg-[#1a1a1a] transition">
                        <td className="px-6 py-4 text-sm text-neutral-400">{produto.id}</td>
                        <td className="px-6 py-4">
                          {produto.image && (
                            <img
                              src={produto.image}
                              alt={produto.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{produto.name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-400">{produto.category || "-"}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-emerald-400 text-right">
                          R$ {produto.price.toFixed(2).replace(".", ",")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {produto.badge ? (
                            <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">
                              {produto.badge}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-neutral-600/20 text-neutral-400 text-xs rounded-full">
                              Normal
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(produto.id)}
                            className="px-3 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs rounded transition"
                          >
                            Deletar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-neutral-400">
                Total de produtos: <span className="text-white font-semibold">{produtos.length}</span>
              </div>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg transition font-semibold"
              >
                Limpar Estoque
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
