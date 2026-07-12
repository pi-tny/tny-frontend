import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { useAdminAdmins } from "../../hooks/queries";
import { useCreateAdmin, useDeleteAdmin, useUpdateAdmin } from "../../hooks/mutations";
import type { Admin, AdminUpdate } from "../../types";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/useToast";
import { adminEditSchema, adminSchema, validateForm } from "../../lib/validation";
import { Badge, Button, EmptyState, Field, Input, Spinner } from "../../components/ui";

export function Admins() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { admin: currentAdmin } = useAuth();

  const { data, isLoading, error } = useAdminAdmins();
  const admins = data ?? [];
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const saving = createAdmin.isPending || updateAdmin.isPending;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setActive(true);
  };

  const startEdit = (a: Admin) => {
    setEditingId(a.id);
    setName(a.name);
    setEmail(a.email);
    setPassword("");
    setActive(a.active);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = editingId ? adminEditSchema : adminSchema;
    if (!validateForm(schema, { name, email, password }, (m) => showToast(m, "error"))) return;
    const onError = (err: unknown) =>
      showToast(err instanceof Error ? err.message : "Erro ao salvar administrador", "error");
    if (editingId) {
      const body: AdminUpdate = { name: name.trim(), email: email.trim(), active };
      if (password.trim()) body.password = password.trim();
      updateAdmin.mutate(
        { id: editingId, body },
        { onSuccess: () => { showToast("Administrador atualizado."); resetForm(); }, onError },
      );
    } else {
      createAdmin.mutate(
        { name: name.trim(), email: email.trim(), password: password.trim() },
        { onSuccess: () => { showToast("Administrador criado."); resetForm(); }, onError },
      );
    }
  };

  const handleDelete = (a: Admin) => {
    if (a.id === currentAdmin?.id) return;
    if (!confirm(`Excluir o administrador "${a.name}"?`)) return;
    deleteAdmin.mutate(a.id, {
      onSuccess: () => {
        showToast("Administrador excluído.");
        if (editingId === a.id) resetForm();
      },
      onError: (err) => showToast(err instanceof Error ? err.message : "Erro ao excluir administrador", "error"),
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Administradores</h1>
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft size={16} /> Painel
        </Button>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-card border border-line bg-surface-2 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
            {editingId ? "Editar administrador" : "Novo administrador"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink">
              <X size={14} /> Cancelar
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" htmlFor="adm-name" required>
            <Input id="adm-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
          </Field>
          <Field label="E-mail" htmlFor="adm-email" required>
            <Input id="adm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@tny.dev" />
          </Field>
        </div>
        <Field
          label={editingId ? "Nova senha (deixe em branco para manter)" : "Senha"}
          htmlFor="adm-password"
          required={!editingId}
          helper="Mínimo de 6 caracteres."
        >
          <Input
            id="adm-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        {editingId && (
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
            Ativo (pode fazer login)
          </label>
        )}
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            {editingId ? "Salvar" : "Criar administrador"}
          </Button>
        </div>
      </form>

      {/* list */}
      {error && (
        <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">{error.message}</div>
      )}
      {isLoading ? (
        <div className="flex min-h-[20vh] items-center justify-center text-ink-muted">
          <Spinner className="h-6 w-6" />
        </div>
      ) : admins.length === 0 ? (
        <EmptyState title="Nenhum administrador" description="Crie o primeiro acima." />
      ) : (
        <div className="space-y-2">
          {admins.map((a) => {
            const isSelf = a.id === currentAdmin?.id;
            return (
              <div key={a.id} className="flex items-center gap-3 rounded-card border border-line bg-surface-2 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    {isSelf && <Badge tone="accent">Você</Badge>}
                    {!a.active && <Badge tone="danger">Inativo</Badge>}
                  </div>
                  <p className="truncate text-xs text-ink-subtle">{a.email}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => startEdit(a)} aria-label="Editar administrador">
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(a)}
                  disabled={isSelf}
                  aria-label="Excluir administrador"
                  title={isSelf ? "Você não pode excluir a si mesmo" : undefined}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
