import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Produto } from "../../types";

const PRODUTOS_STORAGE_KEY = "tny_produtos";

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalPromocoes: 0,
  });

  // PROTEÇÃO: Verifica se está autenticado ao carregar a página
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_auth");
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Carregar estatísticas do localStorage
    const storedProdutos = localStorage.getItem(PRODUTOS_STORAGE_KEY);
    if (storedProdutos) {
      try {
        const produtos: Produto[] = JSON.parse(storedProdutos);
        const promocoes = produtos.filter((p) => p.badge === "Promoção").length;
        setStats({
          totalProducts: produtos.length,
          totalPromocoes: promocoes,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    }
  }, []);

  // Botão de Logout para você sair quando terminar
  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Dashboard Administrativo</h1>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition"
            >
              Sair
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition"
            >
              ← Voltar para Loja
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <div className="text-neutral-400 text-sm mb-2">Total de Produtos</div>
            <div className="text-4xl font-bold text-emerald-400">{stats.totalProducts}</div>
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <div className="text-neutral-400 text-sm mb-2">Produtos em Promoção</div>
            <div className="text-4xl font-bold text-emerald-400">{stats.totalPromocoes}</div>
          </div>
        </div>

        {/* Menu Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/admin/cadastro-produto")}
            className="bg-[#141414] border border-white/10 hover:border-emerald-500/50 rounded-xl p-8 text-left transition group"
          >
            <div className="text-3xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">Cadastrar Produto</h2>
            <p className="text-neutral-400 text-sm group-hover:text-neutral-300 transition">
              Adicione novos produtos ao catálogo com imagens, preços e promoções.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/gerenciar-estoque")}
            className="bg-[#141414] border border-white/10 hover:border-emerald-500/50 rounded-xl p-8 text-left transition group"
          >
            <div className="text-3xl mb-4">📊</div>
            <h2 className="text-xl font-bold mb-2">Gerenciar Estoque</h2>
            <p className="text-neutral-400 text-sm group-hover:text-neutral-300 transition">
              Visualize, edite e delete produtos do seu catálogo.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}