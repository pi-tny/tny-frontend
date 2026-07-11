import { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import { adminDeleteLead, adminListLeads } from "../../services/api";
import type { Lead, PaginationMeta } from "../../types";
import { useToast } from "../../context/useToast";
import { Badge, Button, EmptyState, Spinner } from "../../components/ui";
import { formatDateTime } from "../../lib/orders";

const PAGE_SIZE = 20;

type State = { items: Lead[]; meta: PaginationMeta | null; loading: boolean; error: string | null };
type Action =
  | { type: "FETCH" }
  | { type: "SUCCESS"; items: Lead[]; meta: PaginationMeta }
  | { type: "ERROR"; error: string }
  | { type: "REMOVE"; id: number };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "FETCH":
      return { ...s, loading: true, error: null };
    case "SUCCESS":
      return { items: a.items, meta: a.meta, loading: false, error: null };
    case "ERROR":
      return { ...s, loading: false, error: a.error };
    case "REMOVE":
      return { ...s, items: s.items.filter((l) => l.id !== a.id) };
  }
}

export function Leads() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [state, dispatch] = useReducer(reducer, { items: [], meta: null, loading: true, error: null });

  useEffect(() => {
    dispatch({ type: "FETCH" });
    adminListLeads({ q: query || undefined, page, limit: PAGE_SIZE })
      .then((res) => dispatch({ type: "SUCCESS", items: res.data, meta: res.meta }))
      .catch((err: Error) => dispatch({ type: "ERROR", error: err.message }));
  }, [query, page]);

  const submitSearch = () => {
    setQuery(searchRef.current?.value.trim() ?? "");
    setPage(1);
  };

  const handleDelete = async (lead: Lead) => {
    if (!confirm(`Excluir o lead "${lead.name}"? (LGPD)`)) return;
    try {
      await adminDeleteLead(lead.id);
      dispatch({ type: "REMOVE", id: lead.id });
      showToast("Lead excluído.");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erro ao excluir lead", "error");
    }
  };

  const total = state.meta?.total ?? 0;
  const totalPages = state.meta?.total_pages ?? 1;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-ink-muted">{total} contato{total !== 1 ? "s" : ""} capturado{total !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft size={16} /> Painel
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-pill border border-line bg-surface-2 px-3 py-2 text-ink-muted focus-within:border-accent/60">
        <Search size={16} className="flex-shrink-0" />
        <input
          ref={searchRef}
          defaultValue={query}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          placeholder="Buscar por nome ou e-mail..."
          aria-label="Buscar leads"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
        />
        <Button size="sm" onClick={submitSearch}>
          Buscar
        </Button>
      </div>

      {state.error && (
        <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 p-4 text-center text-sm text-danger">{state.error}</div>
      )}

      {state.loading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-ink-muted">
          <Spinner className="h-6 w-6" />
        </div>
      ) : state.items.length === 0 ? (
        <EmptyState title="Nenhum lead encontrado" description="Cadastros da newsletter e do formulário de revendedor aparecem aqui." />
      ) : (
        <div className="space-y-2">
          {state.items.map((lead) => (
            <div key={lead.id} className="flex items-center gap-3 rounded-card border border-line bg-surface-2 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium">{lead.name}</p>
                  {lead.marketing_consent && <Badge tone="price">Opt-in</Badge>}
                </div>
                <p className="truncate text-xs text-ink-subtle">
                  {lead.email} · {lead.phone} · {formatDateTime(lead.created_at)}
                </p>
              </div>
              <Button size="sm" variant="danger" onClick={() => handleDelete(lead)} aria-label={`Excluir ${lead.name}`}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}

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
