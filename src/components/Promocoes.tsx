import { Link, useNavigate } from "react-router-dom";
import { PRODUTOS } from "../data/produtos";

const promoProducts = PRODUTOS.slice(0, 4);

export function Promocoes() {
  const navigate = useNavigate();

  const handleProductClick = (product: (typeof promoProducts)[number]) => {
    navigate(`/produto/${product.id}`);
  };
  return (
    <div className="min-h-screen bg-[#060606] pb-10 text-white font-sans">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#141414] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80"
            alt="Promoção de moda"
            className="h-56 w-full object-cover"
          />
          <div className="p-5 sm:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Campanha especial</p>
            <h2 className="mt-2 text-2xl font-semibold">Estilo com desconto por tempo limitado</h2>
            <p className="mt-2 text-sm text-neutral-300">Garanta conjuntos modernos com valores acessiveis.</p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Produtos em oferta</h2>
            <span className="text-sm text-neutral-400">Oferta Limitada</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {promoProducts.map((product) => (
              <article key={product.id} onClick={() => handleProductClick(product)} className="cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] transition hover:-translate-y-1 hover:border-white/20">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
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

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mais vendidos</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {promoProducts.slice(0, 4).map((product) => (
              <article key={`${product.id}-best`} onClick={() => handleProductClick(product)} className="cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] transition hover:-translate-y-1 hover:border-white/20">
                <img src={product.image} alt={product.name} className="h-36 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm text-neutral-300">{product.name}</p>
                  <p className="mt-1 text-base font-semibold text-white">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="rounded-[24px] border border-white/10 bg-[#141414] p-6 text-sm text-neutral-400">
          <p className="font-semibold uppercase tracking-[0.3em] text-white">Contato TNY</p>
          <p className="mt-2">WhatsApp: (85) 98102-5616</p>
          <p>E-mail: contato@tny.com.br</p>
          <p>Instagram: @tnymenswear</p>
          <Link to="/carrinho" className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
            Ir para o carrinho
          </Link>
        </div>
      </main>
    </div>
  );
}