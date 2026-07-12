import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import {
  adminAddImage,
  adminCreateProduct,
  adminCreateVariant,
  adminDeleteImage,
  adminDeleteVariant,
  adminSetProductCategories,
  adminUpdateImage,
  adminUpdateProduct,
  adminUpdateVariant,
} from "../../services/api";
import { useAdminProduct, useAllCategories } from "../../hooks/queries";
import { useCreateCategory } from "../../hooks/mutations";
import type { Category, ProductDetail } from "../../types";
import { useToast } from "../../context/useToast";
import { categorySchema, productSchema, validateForm } from "../../lib/validation";
import { Button, Combobox, Field, Input, Spinner, useConfirm } from "../../components/ui";

type VariantRow = {
  key: string;
  id?: number;
  variant_sku: string;
  color: string;
  size: string;
  quantity: string;
  price: string;
};

type ImageRow = {
  key: string;
  id?: number;
  url: string;
  alt_text: string;
  variantKey: string | null; // points to a VariantRow.key; null means a product-wide image
};

function newKey(): string {
  return crypto.randomUUID();
}

function toNumberOrNull(v: string): number | null {
  const trimmed = v.trim();
  return trimmed === "" ? null : Number(trimmed);
}

// turn a loaded product into editable rows, wiring each image to its variant row.
function buildRows(initial: ProductDetail | null): { variants: VariantRow[]; images: ImageRow[] } {
  if (!initial) return { variants: [], images: [] };
  const variants: VariantRow[] = initial.variants.map((v) => ({
    key: newKey(),
    id: v.id,
    variant_sku: v.variant_sku,
    color: v.color,
    size: v.size,
    quantity: String(v.quantity),
    price: v.price != null ? String(v.price) : "",
  }));
  const keyByVariantId = new Map(variants.map((r) => [r.id, r.key]));
  const images: ImageRow[] = initial.images.map((im) => ({
    key: newKey(),
    id: im.id,
    url: im.url,
    alt_text: im.alt_text ?? "",
    variantKey: im.variant_id != null ? (keyByVariantId.get(im.variant_id) ?? null) : null,
  }));
  return { variants, images };
}

export function CadastroProduto() {
  const { id } = useParams();
  const productId = id ? Number(id) : null;
  const { data, isLoading, error } = useAdminProduct(productId ?? undefined);

  if (productId && isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink-muted">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-danger/20 bg-danger/5 p-8 text-center text-danger">
        {error.message}
      </div>
    );
  }

  // remount the form per product (or "new") so its state seeds from `initial`.
  return <ProductForm key={productId ?? "new"} productId={productId} initial={data ?? null} />;
}

// searchable multi-select for categories, with inline creation of a new one.
function CategoryPicker({
  categories,
  selected,
  onToggle,
}: {
  categories: Category[];
  selected: number[];
  onToggle: (id: number) => void;
}) {
  const { showToast } = useToast();
  const createCategory = useCreateCategory();
  const items = categories.map((c) => ({ value: c.id, label: c.name, description: c.description }));
  const byId = new Map(categories.map((c) => [c.id, c] as const));
  const selectedCats = selected.map((id) => byId.get(id)).filter((c): c is Category => Boolean(c));

  const handleCreate = (name: string, clearQuery: () => void) => {
    if (!validateForm(categorySchema, { name }, (m) => showToast(m, "error"))) return;
    createCategory.mutate(
      { name: name.trim(), description: null },
      {
        onSuccess: (cat) => {
          onToggle(cat.id); // newly created is unselected, so this selects it
          showToast(`Categoria "${cat.name}" criada.`);
          clearQuery();
        },
        onError: (e) => showToast(e instanceof Error ? e.message : "Erro ao criar categoria", "error"),
      },
    );
  };

  return (
    <div className="space-y-3">
      <Combobox
        items={items}
        isSelected={(v) => selected.includes(v)}
        onSelect={onToggle}
        triggerContent={<span className="text-ink-subtle">Buscar e selecionar categorias…</span>}
        searchPlaceholder="Buscar categoria..."
        emptyLabel={(q) => (q ? `Nenhuma categoria encontrada para "${q}"` : "Nenhuma categoria cadastrada.")}
        footer={({ query, clearQuery }) => {
          const exact = items.some((i) => i.label.trim().toLowerCase() === query.toLowerCase());
          if (!query || exact) return null;
          return (
            <button
              type="button"
              onClick={() => handleCreate(query, clearQuery)}
              disabled={createCategory.isPending}
              className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-left text-sm text-accent transition-colors hover:bg-accent/10 disabled:opacity-60"
            >
              <Plus size={15} className="flex-shrink-0" /> Criar “{query}”
            </button>
          );
        }}
      />

      {selectedCats.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-subtle">
            {selectedCats.length} selecionada{selectedCats.length !== 1 ? "s" : ""}:
          </span>
          {selectedCats.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 rounded-pill border border-accent/60 bg-accent/15 px-3 py-1 text-sm text-accent"
            >
              {cat.name}
              <button
                type="button"
                onClick={() => onToggle(cat.id)}
                aria-label={`Remover ${cat.name}`}
                className="text-accent/70 transition-colors hover:text-accent"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ink-subtle">Nenhuma categoria selecionada.</p>
      )}
    </div>
  );
}

function ProductForm({ productId, initial }: { productId: number | null; initial: ProductDetail | null }) {
  const isEdit = productId !== null;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { confirm, dialog } = useConfirm();
  const categories = useAllCategories().data ?? [];

  const [initialRows] = useState(() => buildRows(initial));
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [promo, setPromo] = useState(
    initial?.promotional_price != null ? String(initial.promotional_price) : "",
  );
  const [active, setActive] = useState(initial?.active ?? true);
  const [selectedCats, setSelectedCats] = useState<number[]>(initial?.categories.map((c) => c.id) ?? []);
  const [variants, setVariants] = useState<VariantRow[]>(initialRows.variants);
  const [images, setImages] = useState<ImageRow[]>(initialRows.images);

  const toggleCategory = (catId: number) => {
    setSelectedCats((prev) => (prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]));
  };

  // variants
  const addVariant = () =>
    setVariants((prev) => [...prev, { key: newKey(), variant_sku: "", color: "", size: "", quantity: "0", price: "" }]);

  const updateVariant = (key: string, field: keyof VariantRow, value: string) =>
    setVariants((prev) => prev.map((v) => (v.key === key ? { ...v, [field]: value } : v)));

  const removeVariant = async (row: VariantRow) => {
    if (row.id) {
      if (!(await confirm({ title: "Remover variante", description: "Esta variante será removida do produto.", confirmLabel: "Remover", danger: true }))) return;
      try {
        await adminDeleteVariant(row.id);
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Erro ao remover variante", "error");
        return;
      }
    }
    setVariants((prev) => prev.filter((v) => v.key !== row.key));
  };

  // images
  const addImage = () =>
    setImages((prev) => [...prev, { key: newKey(), url: "", alt_text: "", variantKey: null }]);

  function updateImage<K extends keyof ImageRow>(key: string, field: K, value: ImageRow[K]) {
    setImages((prev) => prev.map((im) => (im.key === key ? { ...im, [field]: value } : im)));
  }

  const removeImage = async (row: ImageRow) => {
    if (row.id) {
      if (!(await confirm({ title: "Remover imagem", description: "Esta imagem será removida do produto.", confirmLabel: "Remover", danger: true }))) return;
      try {
        await adminDeleteImage(row.id);
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Erro ao remover imagem", "error");
        return;
      }
    }
    setImages((prev) => prev.filter((im) => im.key !== row.key));
  };

  const buildVariantBody = (v: VariantRow) => ({
    variant_sku: v.variant_sku.trim() || `${sku}-${v.color}-${v.size}`.toUpperCase().replace(/\s+/g, ""),
    color: v.color.trim(),
    size: v.size.trim(),
    quantity: Number(v.quantity || "0"),
    price: toNumberOrNull(v.price),
  });

  // saving a product spans several endpoints (product, categories, variants,
  // images) in order, so we run the whole flow inside one mutation.
  const saveProduct = useMutation({
    mutationFn: async () => {
      const core = {
        sku: sku.trim(),
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        promotional_price: toNumberOrNull(promo),
        active,
      };

      // map each local variantKey to its real variant id, so images can reference it
      const variantIdByKey: Record<string, number> = {};

      if (isEdit && productId) {
        await adminUpdateProduct(productId, core);
        await adminSetProductCategories(productId, selectedCats);
        for (const v of variants) {
          if (v.id) {
            await adminUpdateVariant(v.id, buildVariantBody(v));
            variantIdByKey[v.key] = v.id;
          } else {
            const created = await adminCreateVariant(productId, buildVariantBody(v));
            variantIdByKey[v.key] = created.id;
          }
        }
        for (const [i, im] of images.entries()) {
          const variant_id = im.variantKey ? (variantIdByKey[im.variantKey] ?? null) : null;
          if (im.id) {
            await adminUpdateImage(im.id, { variant_id, alt_text: im.alt_text || null, position: i });
          } else if (im.url.trim()) {
            await adminAddImage(productId, { url: im.url.trim(), alt_text: im.alt_text || undefined, variant_id, position: i });
          }
        }
      } else {
        const created = await adminCreateProduct({ ...core, category_ids: selectedCats });
        for (const v of variants) {
          const cv = await adminCreateVariant(created.id, buildVariantBody(v));
          variantIdByKey[v.key] = cv.id;
        }
        for (const [i, im] of images.entries()) {
          if (!im.url.trim()) continue;
          const variant_id = im.variantKey ? (variantIdByKey[im.variantKey] ?? null) : null;
          await adminAddImage(created.id, { url: im.url.trim(), alt_text: im.alt_text || undefined, variant_id, position: i });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      showToast(isEdit ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      navigate("/admin/gerenciar-estoque");
    },
    onError: (err) => showToast(err instanceof Error ? err.message : "Erro ao salvar produto", "error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = validateForm(
      productSchema,
      { sku, name, description, price: Number(price) },
      (m) => showToast(m, "error"),
      "Preencha SKU, nome, descrição e um preço válido.",
    );
    if (!parsed) return;
    saveProduct.mutate();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/gerenciar-estoque")} className="mb-6">
        <ArrowLeft size={16} /> Voltar
      </Button>

      <h1 className="mb-8 text-3xl font-bold">{isEdit ? "Editar produto" : "Cadastrar produto"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* core fields */}
        <section className="space-y-4 rounded-card border border-line bg-surface-2 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">Dados</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SKU" htmlFor="p-sku" required>
              <Input id="p-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="TNY-001" />
            </Field>
            <Field label="Nome" htmlFor="p-name" required>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Camiseta TNY" />
            </Field>
          </div>
          <Field label="Descrição" htmlFor="p-desc" required>
            <textarea
              id="p-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descreva o produto..."
              className="w-full rounded-[20px] border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-subtle focus:border-accent/60"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Preço (R$)" htmlFor="p-price" required>
              <Input id="p-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0,00" />
            </Field>
            <Field label="Preço promocional (R$)" htmlFor="p-promo" helper="Deve ser menor que o preço base.">
              <Input id="p-promo" type="number" min="0" step="0.01" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="opcional" />
            </Field>
          </div>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
            Produto ativo (visível na loja)
          </label>
        </section>

        {/* categories */}
        <section className="space-y-3 rounded-card border border-line bg-surface-2 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">Categorias</h2>
          <CategoryPicker categories={categories} selected={selectedCats} onToggle={toggleCategory} />
        </section>

        {/* variants */}
        <section className="space-y-3 rounded-card border border-line bg-surface-2 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">Variantes (cor / tamanho / estoque)</h2>
            <Button type="button" variant="ghost" size="sm" onClick={addVariant}>
              <Plus size={14} /> Adicionar
            </Button>
          </div>
          {variants.length === 0 ? (
            <p className="text-sm text-ink-subtle">Nenhuma variante. Adicione ao menos uma para vender o produto.</p>
          ) : (
            <div className="space-y-2">
              {variants.map((v) => (
                <div key={v.key} className="grid grid-cols-2 gap-2 rounded-[16px] border border-line bg-elevated p-3 sm:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_auto]">
                  <Input value={v.variant_sku} onChange={(e) => updateVariant(v.key, "variant_sku", e.target.value)} placeholder="SKU (auto)" aria-label="SKU da variante" />
                  <Input value={v.color} onChange={(e) => updateVariant(v.key, "color", e.target.value)} placeholder="Cor" aria-label="Cor" />
                  <Input value={v.size} onChange={(e) => updateVariant(v.key, "size", e.target.value)} placeholder="Tam." aria-label="Tamanho" />
                  <Input type="number" min="0" value={v.quantity} onChange={(e) => updateVariant(v.key, "quantity", e.target.value)} placeholder="Qtd" aria-label="Quantidade" />
                  <Input type="number" min="0" step="0.01" value={v.price} onChange={(e) => updateVariant(v.key, "price", e.target.value)} placeholder="Preço" aria-label="Preço da variante" />
                  <button type="button" onClick={() => removeVariant(v)} aria-label="Remover variante" className="flex items-center justify-center text-ink-subtle transition-colors hover:text-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* images */}
        <section className="space-y-3 rounded-card border border-line bg-surface-2 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">Imagens (URL)</h2>
            <Button type="button" variant="ghost" size="sm" onClick={addImage}>
              <Plus size={14} /> Adicionar
            </Button>
          </div>
          {images.length === 0 ? (
            <p className="text-sm text-ink-subtle">
              Nenhuma imagem. A primeira imagem geral vira a capa; atribua imagens a uma cor (variante) para a galeria da loja.
            </p>
          ) : (
            <div className="space-y-2">
              {images.map((im) => (
                <div key={im.key} className="space-y-2 rounded-[16px] border border-line bg-elevated p-3">
                  <div className="flex items-center gap-2">
                    {im.url.trim() && (
                      <img src={im.url} alt="" className="h-11 w-11 flex-shrink-0 rounded-lg border border-line object-cover" />
                    )}
                    <Input
                      value={im.url}
                      disabled={Boolean(im.id)}
                      onChange={(e) => updateImage(im.key, "url", e.target.value)}
                      placeholder="https://..."
                      aria-label="URL da imagem"
                      title={im.id ? "A URL de imagens já salvas não pode ser alterada." : undefined}
                      className="flex-1 disabled:opacity-60"
                    />
                    <button type="button" onClick={() => removeImage(im)} aria-label="Remover imagem" className="flex items-center justify-center text-ink-subtle transition-colors hover:text-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={im.variantKey ?? ""}
                      onChange={(e) => updateImage(im.key, "variantKey", e.target.value || null)}
                      aria-label="Atribuir imagem a"
                      className="rounded-pill border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent/60"
                    >
                      <option value="" className="bg-surface text-ink">Produto (geral)</option>
                      {variants.map((v) => (
                        <option key={v.key} value={v.key} className="bg-surface text-ink">
                          {(v.color || "?") + " · " + (v.size || "?")}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={im.alt_text}
                      onChange={(e) => updateImage(im.key, "alt_text", e.target.value)}
                      placeholder="texto alternativo (opcional)"
                      aria-label="Texto alternativo"
                      className="flex-1 py-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate("/admin/gerenciar-estoque")}>
            Cancelar
          </Button>
          <Button type="submit" size="lg" loading={saveProduct.isPending}>
            {saveProduct.isPending ? "Salvando" : isEdit ? "Salvar alterações" : "Cadastrar produto"}
          </Button>
        </div>
      </form>
      {dialog}
    </div>
  );
}
