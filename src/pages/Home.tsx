import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUTOS } from "../data/produtos";

export function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  // Estado para controlar se mostramos tudo ou apenas os 4 primeiros
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Define quais produtos devem ser exibidos baseado no estado mostrarTodos
  const produtosExibidos = mostrarTodos ? PRODUTOS : PRODUTOS.slice(0, 4);

  const filteredProducts = selectedCategory === "Todos"
    ? produtosExibidos
    : produtosExibidos.filter((product) => product.category === selectedCategory);

  const handleProductClick = (product: (typeof PRODUTOS)[number]) => {
    navigate(`/produto/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section>
          {/* Banner */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#151515] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80"
              alt="Banner promocional da loja"
              className="h-80 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <p className="mb-2 text-sm uppercase tracking-[0.35em] text-neutral-300">Coleção de verão</p>
              <h2 className="mb-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
                Estilo moderno para dias quentes e noites especiais
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link to="/promocoes" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]">
                  Ver promoções
                </Link>
                <Link to="/carrinho" className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                  Ver carrinho
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categorias</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Todos", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQrGh0t0eOHJm8epZmolwelw4QK_eUAwY8z5Jxs-t0lA&s=10" },
              { name: "T-Shirts", image: "https://rewert.cdn.magazord.com.br/img/2025/09/produto/8558/camiseta-lisa-preta.jpg" },
              { name: "Gola Polo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIWAU-sLnE3NIWt_x5zbcYvnmmB5A_pPvYeRVxWS5VSM0hyMW-wpsl_HrC&s=10" },
              { name: "Bermudas", image: "https://images.tcdn.com.br/img/img_prod/990591/bermuda_chronic_tactel_02258_6551_1_e0ac03b2b830176cfd5b17ad3615a7dd.jpg" },
              { name: "Shorts", image: "https://bluhen.cdn.magazord.com.br/img/2024/11/produto/8300/short-linho-cordova-masculino-bluhen-1-1.png?ims=fit-in/635x865/filters:fill(white)" },
              { name: "Calças", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUYcfp32MiQsvY7CyH18ri9rkWRTqjquCmd-FbsG6c6Q&s=10" },
            ].map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center gap-2 rounded-[24px] border p-3 transition ${selectedCategory === category.name ? "border-white bg-white text-black" : "border-white/10 bg-[#141414] text-neutral-300"}`}
              >
                <img src={category.image} alt={category.name} className="h-20 w-20 rounded-full object-cover" />
                <p className="text-center text-sm">{category.name}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Por tempo limitado!</h2>
            <button 
              onClick={() => setMostrarTodos(!mostrarTodos)} 
              className="text-sm text-neutral-400 hover:text-white transition"
            >
              {mostrarTodos ? "Ver menos" : "Ver tudo"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    {product.badge}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-neutral-300">{product.name}</p>
                  <p className="mt-1 text-base font-semibold text-white">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-white/10 bg-[#000]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-center text-sm text-neutral-500 sm:px-6 lg:px-8">
          <p className="font-semibold uppercase tracking-[0.3em] text-white">TNY CONCEITO</p>
          <p>CNPJ: 00.000.000/0001-00</p>
          <p>Rua Dedé Gama, 178 - Croata II, Pacajus - Ceará</p>
          <p className="pt-2">©TNY. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}