import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts, useCategories } from "../hooks/queries";
import { CardProduto } from "../components/CardProduto";
import { SkeletonCard } from "../components/SkeletonCard";
import { EmptyState } from "../components/ui";

const CATEGORY_IMAGES: Record<string, string> = {
  "T-Shirts": "https://rewert.cdn.magazord.com.br/img/2025/09/produto/8558/camiseta-lisa-preta.jpg",
  "Gola Polo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIWAU-sLnE3NIWt_x5zbcYvnmmB5A_pPvYeRVxWS5VSM0hyMW-wpsl_HrC&s=10",
  Bermudas: "https://images.tcdn.com.br/img/img_prod/990591/bermuda_chronic_tactel_02258_6551_1_e0ac03b2b830176cfd5b17ad3615a7dd.jpg",
  Shorts: "https://bluhen.cdn.magazord.com.br/img/2024/11/produto/8300/short-linho-cordova-masculino-bluhen-1-1.png?ims=fit-in/635x865/filters:fill(white)",
  Calças: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUYcfp32MiQsvY7CyH18ri9rkWRTqjquCmd-FbsG6c6Q&s=10",
};

const FALLBACK_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQrGh0t0eOHJm8epZmolwelw4QK_eUAwY8z5Jxs-t0lA&s=10";

const PAGE_SIZE = 8;
const FEATURED_CATEGORIES = 8;

export function Home() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? undefined;

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const categories = useCategories().data?.data ?? [];
  const productsQuery = useProducts({
    q: searchTerm,
    category_id: selectedCategoryId ?? undefined,
    limit: PAGE_SIZE,
    sort: "newest",
  });
  const products = productsQuery.data?.data ?? [];
  const meta = productsQuery.data?.meta ?? null;

  const handleCategoryClick = (id: number | null) => {
    setSelectedCategoryId(id);
  };

  // carries the current context (search/category) to the full listing.
  const verTodosParams = new URLSearchParams();
  if (searchTerm) verTodosParams.set("q", searchTerm);
  if (selectedCategoryId) verTodosParams.set("categoria", String(selectedCategoryId));
  const verTodosHref = `/produtos${verTodosParams.toString() ? `?${verTodosParams}` : ""}`;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">

        {/* banner */}
        <section>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface-2 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80"
              alt="Banner TNY"
              className="h-60 w-full object-cover sm:h-72 lg:h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <p className="mb-1.5 text-xs uppercase tracking-[0.35em] text-accent">Coleção de verão</p>
              <h2 className="mb-4 max-w-xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Estilo moderno para dias quentes e noites especiais
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/promocoes"
                  className="inline-flex items-center justify-center rounded-pill bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.03] hover:bg-neutral-100 active:scale-95"
                >
                  Ver promoções
                </Link>
                <Link
                  to="/carrinho"
                  className="inline-flex items-center justify-center rounded-pill border border-line-strong bg-white/10 px-5 py-2.5 text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-95"
                >
                  Ver carrinho
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* categories (always horizontal scroll) */}
        <section>
          <h2 className="mb-3 text-base font-semibold text-ink sm:text-lg">Categorias</h2>
          <div className="relative">
            {/* edge fade to hint scrolling */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-bg to-transparent" />
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {/* "all" */}
              <button
                type="button"
                onClick={() => handleCategoryClick(null)}
                className={`flex w-[72px] flex-shrink-0 flex-col items-center gap-2 rounded-2xl border p-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:w-20 ${
                  selectedCategoryId === null
                    ? "border-white bg-white text-black"
                    : "border-line bg-surface-2 text-ink-muted hover:border-line-strong"
                }`}
              >
                <img
                  src={FALLBACK_IMAGE}
                  alt="Todos"
                  className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                />
                <p className="text-center text-[11px] font-medium sm:text-xs">Todos</p>
              </button>

              {categories.slice(0, FEATURED_CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex w-[72px] flex-shrink-0 flex-col items-center gap-2 rounded-2xl border p-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:w-20 ${
                    selectedCategoryId === cat.id
                      ? "border-white bg-white text-black"
                      : "border-line bg-surface-2 text-ink-muted hover:border-line-strong"
                  }`}
                >
                  <img
                    src={CATEGORY_IMAGES[cat.name] ?? FALLBACK_IMAGE}
                    alt={cat.name}
                    className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                  />
                  <p className="line-clamp-1 text-center text-[11px] font-medium sm:text-xs">{cat.name}</p>
                </button>
              ))}

              {/* delegate full browsing to the catalog page */}
              {categories.length > FEATURED_CATEGORIES && (
                <Link
                  to="/produtos"
                  className="flex w-[72px] flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-line bg-surface-2 p-2.5 text-ink-muted transition-all duration-200 hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:w-20"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong sm:h-14 sm:w-14">
                    <ArrowRight size={20} />
                  </span>
                  <p className="line-clamp-1 text-center text-[11px] font-medium sm:text-xs">Ver todas</p>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* products */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink sm:text-lg">
              {searchTerm ? `Resultados para "${searchTerm}"` : "Novidades"}
            </h2>
            {meta && (
              <span className="text-xs text-ink-subtle sm:text-sm">
                {meta.total} produto{meta.total !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {productsQuery.error && (
            <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">
              {productsQuery.error.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {productsQuery.isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
              : products.map((p) => (
                  <CardProduto
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    image={p.cover_image ?? ""}
                    price={p.price}
                    promotional_price={p.promotional_price}
                  />
                ))}
          </div>

          {!productsQuery.isLoading && products.length === 0 && !productsQuery.error && (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Tente outro filtro ou termo de busca."
            />
          )}

          {/* link to the full listing with filters and pagination */}
          {!productsQuery.isLoading && products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Link
                to={verTodosHref}
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100 active:scale-95"
              >
                Ver todos os produtos
              </Link>
            </div>
          )}
        </section>
    </div>
  );
}
