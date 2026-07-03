import { Link } from "react-router-dom";

export function Institucional() {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-block text-sm text-neutral-400">
          ← Voltar
        </Link>

        <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#121212] p-6 shadow-2xl sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Institucional</p>
        <h1 className="mt-2 text-3xl font-semibold">Sobre a TNY</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-300">
          Loja de roupas masculinas referência no mercado regional a mais de 15 anos.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <p className="text-lg font-semibold">Quem Somos?</p>
            <p className="mt-2 text-sm text-neutral-400">A TNY é uma empresa de moda masculina construida a mais de 15 anos, comprometida com a integridade e atendimento de qualidade</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <p className="text-lg font-semibold">Localização</p>
            <p className="mt-2 text-sm text-neutral-400">Rua Dedé Gama, 178 - Croata II, Pacajus - Ceará.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <p className="text-lg font-semibold">Valores</p>
            <p className="mt-2 text-sm text-neutral-400">Integridade, inovação e atendimento de qualidade para construir uma relação solida com o cliente.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
