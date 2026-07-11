import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-bold text-white/10">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Página não encontrada</h1>
      <p className="mt-2 text-sm text-ink-muted">O endereço que você acessou não existe.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-pill bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] active:scale-95"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}
