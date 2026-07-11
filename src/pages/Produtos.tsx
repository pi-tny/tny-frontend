import { useEffect, useReducer, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getProducts, getCategories } from "../services/api";
import type { ProductSummary, Category, PaginationMeta } from "../types";
import { CardProduto } from "../components/CardProduto";
import { SkeletonCard } from "../components/SkeletonCard";
import { Button, EmptyState, cn } from "../components/ui";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "newest", label: "Novidades" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name", label: "Nome (A–Z)" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

type State = {
  items: ProductSummary[];
  meta: PaginationMeta | null;
  loading: boolean; // primeira carga / troca de filtro
  loadingMore: boolean; // "Carregar mais" (append)
  error: string | null;
};
type Action =
  | { type: "FETCH"; append: boolean }
  | { type: "SUCCESS"; data: ProductSummary[]; meta: PaginationMeta; append: boolean }
  | { type: "ERROR"; error: string };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "FETCH":
      return a.append
        ? { ...s, loadingMore: true, error: null }
        : { ...s, loading: true, error: null };
    case "SUCCESS":
      return {
        loading: false,
        loadingMore: false,
        error: null,
        meta: a.meta,
        items: a.append ? [...s.items, ...a.data] : a.data,
      };
    case "ERROR":
      return { ...s, loading: false, loadingMore: false, error: a.error };
  }
}

export function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const categoria = searchParams.get("categoria");
  const categoryId = categoria ? Number(categoria) : undefined;
  const sortParam = searchParams.get("ordenar") as SortValue | null;
  const sort: SortValue = SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam! : "newest";
  const onSale = searchParams.get("promo") === "1";
  const inStock = searchParams.get("estoque") === "1";

  const hasActiveFilters = Boolean(q) || categoryId !== undefined || onSale || inStock;

  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    items: [],
    meta: null,
    loading: true,
    loadingMore: false,
    error: null,
  });

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const append = page > 1;
    dispatch({ type: "FETCH", append });
    getProducts({
      q: q || undefined,
      category_id: categoryId,
      on_sale: onSale || undefined,
      in_stock: inStock || undefined,
      sort,
      page,
      limit: PAGE_SIZE,
    })
      .then((res) => dispatch({ type: "SUCCESS", data: res.data, meta: res.meta, append }))
      .catch((err: Error) => dispatch({ type: "ERROR", error: err.message }));
  }, [q, categoryId, onSale, inStock, sort, page]);

  // Toda troca de filtro volta para a página 1 (substitui a lista).
  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setPage(1);
  }

  function submitSearch() {
    updateParam("q", searchRef.current?.value.trim() || null);
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams());
    setPage(1);
  }

  const total = state.meta?.total ?? 0;
  const hasMore = state.meta ? page < state.meta.total_pages : false;

  const chipClass = (active: boolean) =>
    cn(
      "flex-shrink-0 rounded-pill border px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
      active
        ? "border-white bg-white font-medium text-black"
        : "border-line bg-surface-2 text-ink-muted hover:border-line-strong",
    );

  const toggleClass = (active: boolean) =>
    cn(
      "rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
      active
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-line bg-surface-2 text-ink-muted hover:border-line-strong",
    );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {state.loading ? "Carregando catálogo…" : `${total} produto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col gap-4 rounded-card border border-line bg-surface-2 p-4 sm:p-5">
        {/* Busca */}
        <div className="flex items-center gap-2 rounded-pill border border-line bg-elevated px-3 py-2 text-ink-muted transition-colors focus-within:border-accent/60">
          <Search size={16} className="flex-shrink-0" />
          <input
            ref={searchRef}
            key={q}
            defaultValue={q}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            aria-label="Buscar produtos"
            placeholder="Buscar produtos..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
          <Button size="sm" onClick={submitSearch}>
            Buscar
          </Button>
        </div>

        {/* Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button onClick={() => updateParam("categoria", null)} className={chipClass(categoryId === undefined)}>
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("categoria", String(cat.id))}
              className={chipClass(categoryId === cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Ordenação + toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-ink-subtle">
            <span className="uppercase tracking-[0.15em]">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => updateParam("ordenar", e.target.value)}
              aria-label="Ordenar produtos"
              className="rounded-pill border border-line bg-elevated px-3 py-2 text-sm text-ink outline-none focus:border-accent/60"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-surface text-ink">
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <button
              aria-pressed={onSale}
              onClick={() => updateParam("promo", onSale ? null : "1")}
              className={toggleClass(onSale)}
            >
              Promoção
            </button>
            <button
              aria-pressed={inStock}
              onClick={() => updateParam("estoque", inStock ? null : "1")}
              className={toggleClass(inStock)}
            >
              Em estoque
            </button>
          </div>
        </div>
      </div>

      {/* Erro */}
      {state.error && (
        <div className="rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">
          {state.error}
        </div>
      )}

      {/* Grid */}
      {state.loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : state.items.length === 0 && !state.error ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Ajuste os filtros ou tente outro termo de busca."
          action={
            hasActiveFilters ? (
              <Button variant="ghost" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {state.items.map((p) => (
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

          {/* Carregar mais (acumula abaixo) */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-ink-subtle">
              Mostrando {state.items.length} de {total} produtos
            </p>
            {hasMore && (
              <Button
                variant="ghost"
                size="lg"
                loading={state.loadingMore}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {state.loadingMore ? "Carregando" : "Carregar mais"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
