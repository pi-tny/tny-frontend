import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Pencil, Plus, Search } from "lucide-react";
import { useAdminProduct, useAdminProducts } from "../../hooks/queries";
import { useUpdateProduct, useUpdateVariant } from "../../hooks/mutations";
import type { ApiVariant, ProductSummary } from "../../types";
import { useToast } from "../../context/useToast";
import { Badge, Button, EmptyState, Input, SafeImage, Spinner, cn } from "../../components/ui";

const PAGE_SIZE = 15;

function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

// per-variant stock editor (loads on demand when expanded)
function VariantesEditor({ productId }: { productId: number }) {
  const { showToast } = useToast();
  const { data: product, isLoading, error } = useAdminProduct(productId);
  const variants = product?.variants;
  const updateVariant = useUpdateVariant();
  // per-variant edits; a missing entry means "unchanged from the server value".
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const draftOf = (v: ApiVariant) => drafts[v.id] ?? String(v.quantity);

  const saveQuantity = (v: ApiVariant) => {
    const draft = draftOf(v);
    if (Number(draft) === v.quantity) return;
    updateVariant.mutate(
      { id: v.id, body: { quantity: Number(draft) } },
      {
        onSuccess: () => showToast("Estoque atualizado."),
        onError: (e) => showToast(e instanceof Error ? e.message : "Erro ao salvar estoque", "error"),
      },
    );
  };

  if (error) return <p className="p-4 text-sm text-danger">{error.message}</p>;
  if (isLoading || !variants) {
    return (
      <div className="flex items-center gap-2 p-4 text-sm text-ink-muted">
        <Spinner /> Carregando variantes…
      </div>
    );
  }
  if (variants.length === 0) return <p className="p-4 text-sm text-ink-subtle">Este produto não tem variantes.</p>;

  return (
    <div className="space-y-2 p-4">
      {variants.map((v) => (
        <div key={v.id} className="flex flex-wrap items-center gap-3 rounded-[14px] border border-line bg-elevated p-3">
          <span className="min-w-0 flex-1 text-sm">
            <span className="font-medium">{v.color}</span> · {v.size}
            <span className="ml-2 text-xs text-ink-subtle">{v.variant_sku}</span>
          </span>
          <label className="flex items-center gap-2 text-xs text-ink-muted">
            Estoque
            <Input
              type="number"
              min="0"
              value={draftOf(v)}
              onChange={(e) => setDrafts((d) => ({ ...d, [v.id]: e.target.value }))}
              className="w-24 py-2"
              aria-label={`Estoque ${v.color} ${v.size}`}
            />
          </label>
          <Button
            size="sm"
            variant="ghost"
            loading={updateVariant.isPending && updateVariant.variables?.id === v.id}
            disabled={Number(draftOf(v)) === v.quantity}
            onClick={() => saveQuantity(v)}
          >
            Salvar
          </Button>
        </div>
      ))}
    </div>
  );
}

export function GerenciarEstoque() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading, error } = useAdminProducts({
    q: query || undefined,
    page,
    limit: PAGE_SIZE,
    sort: "newest",
  });
  const items = data?.data ?? [];
  const updateProduct = useUpdateProduct();

  const submitSearch = () => {
    setQuery(searchRef.current?.value.trim() ?? "");
    setPage(1);
  };

  const toggleActive = (p: ProductSummary) => {
    updateProduct.mutate(
      { id: p.id, body: { active: !p.active } },
      {
        onSuccess: (updated) => showToast(updated.active ? "Produto ativado." : "Produto desativado."),
        onError: (e) => showToast(e instanceof Error ? e.message : "Erro ao atualizar produto", "error"),
      },
    );
  };

  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.total_pages ?? 1;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar estoque</h1>
          <p className="mt-1 text-sm text-ink-muted">{total} produto{total !== 1 ? "s" : ""} no catálogo</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft size={16} /> Painel
          </Button>
          <Button onClick={() => navigate("/admin/cadastro-produto")}>
            <Plus size={16} /> Novo produto
          </Button>
        </div>
      </div>

      {/* search */}
      <div className="mb-4 flex items-center gap-2 rounded-pill border border-line bg-surface-2 px-3 py-2 text-ink-muted focus-within:border-accent/60">
        <Search size={16} className="flex-shrink-0" />
        <input
          ref={searchRef}
          defaultValue={query}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          placeholder="Buscar por nome..."
          aria-label="Buscar produtos"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
        />
        <Button size="sm" onClick={submitSearch}>
          Buscar
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-ink-muted">
          <Spinner className="h-6 w-6" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Cadastre um novo produto para começar."
          action={<Button onClick={() => navigate("/admin/cadastro-produto")}>Cadastrar produto</Button>}
        />
      ) : (
        <div className="space-y-2">
          {items.map((p) => {
            const promoPrice = p.promotional_price;
            const isOnSale = promoPrice != null && promoPrice < p.price;
            const expanded = expandedId === p.id;
            return (
              <div key={p.id} className="overflow-hidden rounded-card border border-line bg-surface-2">
                <div className="flex items-center gap-3 p-3 sm:gap-4">
                  <SafeImage
                    src={p.cover_image ?? ""}
                    alt={p.name}
                    className="h-14 w-14 flex-shrink-0 rounded-[12px] border border-line object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-ink-subtle">{p.sku}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {!p.active && <Badge tone="danger">Inativo</Badge>}
                      {isOnSale && <Badge tone="accent">Promoção</Badge>}
                    </div>
                  </div>
                  <div className="hidden text-right tabular-nums sm:block">
                    {isOnSale ? (
                      <>
                        <p className="text-sm font-semibold text-price">{formatBRL(promoPrice)}</p>
                        <p className="text-xs text-ink-subtle line-through">{formatBRL(p.price)}</p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold">{formatBRL(p.price)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(expanded ? null : p.id)}
                      aria-expanded={expanded}
                    >
                      Estoque
                      <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/produtos/${p.id}/editar`)} aria-label="Editar produto">
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant={p.active ? "danger" : "outline"}
                      loading={updateProduct.isPending && updateProduct.variables?.id === p.id}
                      onClick={() => toggleActive(p)}
                    >
                      {p.active ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
                {expanded && (
                  <div className="border-t border-line bg-surface">
                    <VariantesEditor productId={p.id} />
                  </div>
                )}
              </div>
            );
          })}

          {/* pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
                ← Anterior
              </Button>
              <span className="text-sm text-ink-muted">
                {page} / {totalPages}
              </span>
              <Button variant="ghost" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                Próxima →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
