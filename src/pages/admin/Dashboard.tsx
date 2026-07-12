import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  LogOut,
  Package,
  ShieldCheck,
  Store,
  Tags,
  Users,
  Warehouse,
} from "lucide-react";
import { useAdminLeads, useAdminOrders, useAdminProducts } from "../../hooks/queries";
import { useAuth } from "../../context/useAuth";
import { Button } from "../../components/ui";

const CARDS = [
  { icon: ClipboardList, title: "Pedidos", desc: "Acompanhe pedidos e atualize o status.", to: "/admin/pedidos" },
  { icon: Package, title: "Cadastrar produto", desc: "Novo produto com variantes e imagens.", to: "/admin/cadastro-produto" },
  { icon: Warehouse, title: "Gerenciar estoque", desc: "Edite produtos e ajuste o estoque.", to: "/admin/gerenciar-estoque" },
  { icon: Tags, title: "Categorias", desc: "Organize o catálogo por categorias.", to: "/admin/categorias" },
  { icon: Users, title: "Leads", desc: "Contatos capturados (newsletter/revenda).", to: "/admin/leads" },
  { icon: ShieldCheck, title: "Administradores", desc: "Gerencie o acesso ao painel.", to: "/admin/admins" },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const productsTotal = useAdminProducts({ limit: 1 }).data?.meta.total;
  const newOrdersTotal = useAdminOrders({ status: "new", limit: 1 }).data?.meta.total;
  const leadsTotal = useAdminLeads("", 1, 1).data?.meta.total;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const statItems = [
    { label: "Produtos", value: productsTotal },
    { label: "Pedidos novos", value: newOrdersTotal },
    { label: "Leads", value: leadsTotal },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Painel administrativo</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {admin ? `Bem-vindo, ${admin.name}.` : "Gerencie o catálogo da TNY."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Store size={16} /> Ver loja
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            <LogOut size={16} /> Sair
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {statItems.map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-surface-2 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-ink-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-accent">{s.value ?? "—"}</p>
          </div>
        ))}
      </div>

      {/* navigation */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <button
            key={card.to}
            onClick={() => navigate(card.to)}
            className="group rounded-card border border-line bg-surface-2 p-8 text-left transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <card.icon size={28} className="text-accent" />
            <h2 className="mt-4 text-xl font-bold">{card.title}</h2>
            <p className="mt-2 text-sm text-ink-muted transition-colors group-hover:text-ink">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
