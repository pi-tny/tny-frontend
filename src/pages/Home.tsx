import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUTOS } from "../data/produtos";

const featuredProducts = PRODUTOS.slice(0, 4);

export function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredProducts = selectedCategory === "Todos"
    ? featuredProducts
    : featuredProducts.filter((product) => product.category === selectedCategory);

  const handleProductClick = (product: (typeof featuredProducts)[number]) => {
    navigate(`/produto/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section>
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
              <p className="mb-4 max-w-xl text-sm text-neutral-300 sm:text-base">
                Encontre peças premium, confortáveis e com acabamento refinado para aproveitar a estação com elegância.
              </p>
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
              { name: "Moda Feminina", image: "data:image/avif;base64,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" },
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
            <button className="text-sm text-neutral-400">Ver tudo</button>
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

      <footer className="mt-8 border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-center text-sm text-neutral-500 sm:px-6 lg:px-8">
          <p className="font-semibold uppercase tracking-[0.3em] text-white">TNY Modas</p>
          <p>CNPJ: 00.000.000/0001-00</p>
          <p>Rua Principal, 123 - Fortaleza, Ceará</p>
          <p className="pt-2">© 2026 TNY. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
