import { Link } from "react-router-dom";

export function Institucional() {
  return (
    <div>
      <Link to="/" className="mb-6 inline-block text-sm text-ink-muted transition-colors hover:text-ink">
        ← Voltar
      </Link>

      <div className="mx-auto max-w-5xl rounded-[32px] border border-line bg-surface p-6 shadow-2xl sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Institucional</p>
        <h1 className="mt-2 text-3xl font-bold">Sobre a TNY</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">
          Loja de roupas masculinas referência no mercado regional há mais de 15 anos.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-line bg-surface-2 p-5">
            <p className="text-lg font-semibold">Quem Somos?</p>
            <p className="mt-2 text-sm text-ink-muted">
              A TNY é uma empresa de moda masculina construída há mais de 15 anos, comprometida com a integridade e o
              atendimento de qualidade.
            </p>
          </div>
          <div className="rounded-[24px] border border-line bg-surface-2 p-5">
            <p className="text-lg font-semibold">Localização</p>
            <p className="mt-2 text-sm text-ink-muted">Rua Dedé Gama, 178 - Croata II, Pacajus - Ceará.</p>
          </div>
          <div className="rounded-[24px] border border-line bg-surface-2 p-5">
            <p className="text-lg font-semibold">Valores</p>
            <p className="mt-2 text-sm text-ink-muted">
              Integridade, inovação e atendimento de qualidade para construir uma relação sólida com o cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
