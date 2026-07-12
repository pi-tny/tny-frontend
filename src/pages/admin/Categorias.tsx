import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Search, Trash2, X } from "lucide-react";
import { useAdminCategories } from "../../hooks/queries";
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "../../hooks/mutations";
import type { Category } from "../../types";
import { useToast } from "../../context/useToast";
import { useDebounce } from "../../hooks/useDebounce";
import { categorySchema, validateForm } from "../../lib/validation";
import { Button, EmptyState, Field, Input, Spinner, useConfirm } from "../../components/ui";

export function Categorias() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { confirm, dialog } = useConfirm();
  const { data, isLoading, error } = useAdminCategories();
  const categories = data?.data ?? [];
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const saving = createCategory.isPending || updateCategory.isPending;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const q = useDebounce(search.trim().toLowerCase(), 250);
  const filtered = q
    ? categories.filter(
        (c) => c.name.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q),
      )
    : categories;

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(categorySchema, { name }, (m) => showToast(m, "error"))) return;
    const body = { name: name.trim(), description: description.trim() || null };
    const onError = (err: unknown) =>
      showToast(err instanceof Error ? err.message : "Erro ao salvar categoria", "error");
    const onSuccess = () => {
      showToast(editingId ? "Categoria atualizada." : "Categoria criada.");
      resetForm();
    };
    if (editingId) updateCategory.mutate({ id: editingId, body }, { onSuccess, onError });
    else createCategory.mutate(body, { onSuccess, onError });
  };

  const handleDelete = async (cat: Category) => {
    const ok = await confirm({
      title: "Excluir categoria",
      description: `A categoria "${cat.name}" será excluída.`,
      confirmLabel: "Excluir",
      danger: true,
    });
    if (!ok) return;
    deleteCategory.mutate(cat.id, {
      onSuccess: () => {
        showToast("Categoria excluída.");
        if (editingId === cat.id) resetForm();
      },
      onError: (err) => showToast(err instanceof Error ? err.message : "Erro ao excluir categoria", "error"),
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft size={16} /> Painel
        </Button>
      </div>

      {/* create/edit form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-card border border-line bg-surface-2 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
            {editingId ? "Editar categoria" : "Nova categoria"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink">
              <X size={14} /> Cancelar edição
            </button>
          )}
        </div>
        <Field label="Nome" htmlFor="cat-name" required>
          <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Camisetas" maxLength={100} />
        </Field>
        <Field label="Descrição" htmlFor="cat-desc">
          <Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="opcional" maxLength={255} />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            {editingId ? "Salvar" : "Criar categoria"}
          </Button>
        </div>
      </form>

      {/* search */}
      {categories.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-pill border border-line bg-surface-2 px-3 py-2 text-ink-muted focus-within:border-accent/60">
          <Search size={16} className="flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categoria..."
            aria-label="Buscar categoria"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
        </div>
      )}

      {/* list */}
      {error && (
        <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">{error.message}</div>
      )}
      {isLoading ? (
        <div className="flex min-h-[20vh] items-center justify-center text-ink-muted">
          <Spinner className="h-6 w-6" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState title="Nenhuma categoria" description="Crie a primeira categoria acima." />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nada encontrado" description={`Nenhuma categoria encontrada para "${search.trim()}".`} />
      ) : (
        <div className="space-y-2">
          {filtered.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 rounded-card border border-line bg-surface-2 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{cat.name}</p>
                {cat.description && <p className="truncate text-xs text-ink-subtle">{cat.description}</p>}
              </div>
              <Button size="sm" variant="ghost" onClick={() => startEdit(cat)} aria-label="Editar categoria">
                <Pencil size={14} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(cat)} aria-label="Excluir categoria">
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
      {dialog}
    </div>
  );
}
