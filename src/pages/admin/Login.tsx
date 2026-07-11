import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { Button, Field, Input } from "../../components/ui";
import logoTNY from "../../assets/Ativo 17.png";

export function LoginAdmin() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Já autenticado: não mostra o login novamente.
  if (status === "authenticated") {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <img src={logoTNY} alt="TNY Menswear" className="h-12 w-auto" />
        </div>

        <div className="rounded-[24px] border border-line bg-surface-2 p-8 sm:p-10">
          <h2 className="text-xl font-bold text-ink">Área administrativa</h2>
          <p className="mt-1 text-sm text-ink-muted">Faça login para acessar o painel.</p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <Field label="E-mail" htmlFor="admin-email" required>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemplo.com"
              />
            </Field>

            <Field label="Senha" htmlFor="admin-password" required>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {loading ? "Entrando" : "Entrar"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-ink-subtle">Acesso restrito a administradores TNY</p>
      </div>
    </div>
  );
}
