import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useInfiniteProducts, useAllStoreCategories } from "../hooks/queries";
import { useDebounce } from "../hooks/useDebounce";
import { SORT_OPTIONS, toSortValue } from "../lib/productFilters";
import { CardProduto } from "../components/CardProduto";
import { SkeletonCard } from "../components/SkeletonCard";
import { Button, Combobox, EmptyState, chipClass, toggleClass } from "../components/ui";

const PAGE_SIZE = 12;
const VISIBLE_CATEGORIES = 8;

export function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const categoria = searchParams.get("categoria");
  const categoryId = categoria ? Number(categoria) : undefined;
  const sort = toSortValue(searchParams.get("ordenar"));
  const onSale = searchParams.get("promo") === "1";
  const inStock = searchParams.get("estoque") === "1";

  const hasActiveFilters = Boolean(q) || categoryId !== undefined || onSale || inStock;

  // debounced search: type freely, the URL `q` (source of truth) follows.
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 350);
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const term = debouncedSearch.trim();
        if (term) next.set("q", term);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, setSearchParams]);

  const categories = useAllStoreCategories().data ?? [];
  const visibleCategories = categories.slice(0, VISIBLE_CATEGORIES);
  const activeCategory = categoryId ? categories.find((c) => c.id === categoryId) : undefined;
  // surface the active category as a chip when it's beyond the visible slice.
  const activeOutside = activeCategory && !visibleCategories.some((c) => c.id === activeCategory.id);

  // filter changes swap the query key, so the list resets to page 1 on its own.
  const productsQuery = useInfiniteProducts({
    q: q || undefined,
    category_id: categoryId,
    on_sale: onSale || undefined,
    in_stock: inStock || undefined,
    sort,
    limit: PAGE_SIZE,
  });
  const items = productsQuery.data?.pages.flatMap((p) => p.data) ?? [];

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  }

  const total = productsQuery.data?.pages[0]?.meta.total ?? 0;
  const hasMore = productsQuery.hasNextPage;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {productsQuery.isLoading ? "Carregando catálogo…" : `${total} produto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
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

      {/* filter bar */}
      <div className="flex flex-col gap-4 rounded-card border border-line bg-surface-2 p-4 sm:p-5">
        {/* search */}
        <div className="flex items-center gap-2 rounded-pill border border-line bg-elevated px-3 py-2 text-ink-muted transition-colors focus-within:border-accent/60">
          <Search size={16} className="flex-shrink-0" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Buscar produtos"
            placeholder="Buscar produtos..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
        </div>

        {/* categories: priority chips + searchable overflow */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => updateParam("categoria", null)} className={chipClass(categoryId === undefined)}>
            Todos
          </button>
          {activeOutside && activeCategory && (
            <button onClick={() => updateParam("categoria", null)} className={chipClass(true)}>
              {activeCategory.name}
            </button>
          )}
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("categoria", String(cat.id))}
              className={chipClass(categoryId === cat.id)}
            >
              {cat.name}
            </button>
          ))}
          {categories.length > VISIBLE_CATEGORIES && (
            <Combobox
              className="flex-shrink-0"
              triggerClassName="!w-auto !py-2 border-line bg-surface-2 text-ink-muted hover:border-line-strong"
              items={categories.map((c) => ({ value: c.id, label: c.name }))}
              isSelected={(v) => categoryId === v}
              onSelect={(v) => updateParam("categoria", String(v))}
              closeOnSelect
              searchPlaceholder="Buscar categoria..."
              emptyLabel={(term) => (term ? `Nenhuma categoria para "${term}"` : "Nenhuma categoria.")}
              triggerContent={
                <span className="inline-flex items-center gap-1.5">
                  <Plus size={14} /> Mais categorias
                </span>
              }
            />
          )}
        </div>

        {/* sorting + toggles */}
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

      {/* error */}
      {productsQuery.error && (
        <div className="rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">
          {productsQuery.error.message}
        </div>
      )}

      {/* grid */}
      {productsQuery.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 && !productsQuery.error ? (
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
            {items.map((p) => (
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

          {/* load more (appends below) */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-ink-subtle">
              Mostrando {items.length} de {total} produtos
            </p>
            {hasMore && (
              <Button
                variant="ghost"
                size="lg"
                loading={productsQuery.isFetchingNextPage}
                onClick={() => productsQuery.fetchNextPage()}
              >
                {productsQuery.isFetchingNextPage ? "Carregando" : "Carregar mais"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
