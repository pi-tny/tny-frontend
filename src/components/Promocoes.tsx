import { useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import type { ProductSummary, PaginationMeta } from "../types";
import { CardProduto } from "./CardProduto";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./ui";

type PState = {
  products: ProductSummary[];
  meta: PaginationMeta | null;
  loading: boolean;
};
type PAction =
  | { type: "FETCH" }
  | { type: "SUCCESS"; products: ProductSummary[]; meta: PaginationMeta }
  | { type: "ERROR" };

function reducer(s: PState, a: PAction): PState {
  switch (a.type) {
    case "FETCH":
      return { ...s, loading: true };
    case "SUCCESS":
      return { products: a.products, meta: a.meta, loading: false };
    case "ERROR":
      return { ...s, loading: false };
  }
}

export function Promocoes() {
  const [state, dispatch] = useReducer(reducer, { products: [], meta: null, loading: true });

  useEffect(() => {
    dispatch({ type: "FETCH" });
    getProducts({ on_sale: true, limit: 20, sort: "newest" })
      .then((res) => dispatch({ type: "SUCCESS", products: res.data, meta: res.meta }))
      .catch(() => dispatch({ type: "ERROR" }));
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Banner */}
      <section className="overflow-hidden rounded-[28px] border border-line bg-surface-2 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80"
          alt="Promoções TNY"
          className="h-48 w-full object-cover sm:h-56"
        />
        <div className="p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Campanha especial</p>
          <h2 className="mt-1.5 text-xl font-bold sm:text-2xl">Estilo com desconto por tempo limitado</h2>
          <p className="mt-1.5 text-sm text-ink-muted">Garanta conjuntos modernos com valores acessíveis.</p>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Produtos em oferta</h2>
          <span className="text-xs text-ink-muted sm:text-sm">
            {state.loading ? "…" : `${state.products.length} produto${state.products.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {state.loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : state.products.map((p) => (
                <CardProduto
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  image={p.cover_image ?? ""}
                  price={p.price}
                  promotional_price={p.promotional_price}
                  badge="Promoção"
                />
              ))}
        </div>

        {!state.loading && state.products.length === 0 && (
          <EmptyState
            title="Nenhuma promoção no momento"
            description="Volte em breve para conferir nossas ofertas."
            action={
              <Link
                to="/produtos"
                className="inline-flex rounded-pill bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100"
              >
                Ver catálogo completo
              </Link>
            }
          />
        )}

        {/* Leva à listagem completa já filtrada por promoções */}
        {!state.loading && state.products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              to="/produtos?promo=1"
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100 active:scale-95"
            >
              Ver todas as promoções
            </Link>
          </div>
        )}
      </section>

      {/* Contato */}
      <div className="rounded-card border border-line bg-surface-2 p-5 text-sm text-ink-muted sm:p-6">
        <p className="font-semibold uppercase tracking-[0.3em] text-ink">Contato TNY</p>
        <p className="mt-2">WhatsApp: (85) 98102-5616</p>
        <p>Instagram: @tnymenswear</p>
        <Link
          to="/carrinho"
          className="mt-4 inline-flex rounded-pill bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100"
        >
          Ir para o carrinho
        </Link>
      </div>
    </div>
  );
}
