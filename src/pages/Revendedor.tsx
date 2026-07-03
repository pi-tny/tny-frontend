import { Link } from "react-router-dom";

export function Revendedor() {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-block text-sm text-neutral-400">
          ← Voltar
        </Link>

        <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#121212] p-6 shadow-2xl sm:p-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Parceria comercial</p>
          <h1 className="mt-2 text-3xl font-semibold">Seja revendedor TNY</h1>
          <p className="mt-3 text-sm text-neutral-300">
            Preencha os dados abaixo para entrar em contato com a equipe comercial da TNY.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="space-y-4 rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-neutral-300">
                Nome
                <input className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-3 py-3 text-sm outline-none" placeholder="Seu nome" />
              </label>
              <label className="text-sm text-neutral-300">
                E-mail
                <input className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-3 py-3 text-sm outline-none" placeholder="seu@email.com" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-neutral-300">
                WhatsApp
                <input className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-3 py-3 text-sm outline-none" placeholder="(85) 98102-5616" />
              </label>
              <label className="text-sm text-neutral-300">
                Cidade
                <input className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-3 py-3 text-sm outline-none" placeholder="Sua cidade" />
              </label>
            </div>

            <label className="text-sm text-neutral-300">
              Tipo de parceria
              <select className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-3 py-3 text-sm outline-none">
                <option>Loja física</option>
                <option>Loja online</option>
                <option>Atacadista</option>
                <option>Influenciador</option>
              </select>
            </label>

            <label className="text-sm text-neutral-300">
              Mensagem
              <textarea className="mt-1 min-h-28 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-3 py-3 text-sm outline-none" placeholder="Conte um pouco sobre seu projeto ou objetivo." />
            </label>

            <button type="button" className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black">
              Enviar solicitação
            </button>
          </form>

          <div className="space-y-4 rounded-[24px] border border-white/10 bg-[#171717] p-5">
            <div className="rounded-[20px] border border-white/10 bg-[#0f0f10] p-4">
              <p className="text-sm font-semibold text-white">Por que virar revendedor?</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                <li>• Margens competitivas</li>
                <li>• Catálogo atualizado</li>
                <li>• Suporte comercial</li>
                <li>• Venda direta e logística simples</li>
              </ul>
            </div>
            <Link to="/carrinho" className="block w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white">
              Ver carrinho
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
