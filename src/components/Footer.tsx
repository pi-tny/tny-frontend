import logoTny from "../assets/Ativo 17.png";
import { useForm } from '@formspree/react';

export function Footer() {
  const [state, handleSubmit] = useForm("mqevvqvn");

  return (
    <footer className="mt-10 border-t border-neutral-800 bg-[#111] px-6 py-8 text-neutral-400 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:justify-between">
        <div className="max-w-sm">
          <img src={logoTny} alt="Logo TNY" className="mb-2 h-10 w-auto" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
            Todos os direitos reservados. ®
          </p>
        </div>

        <div className="grid gap-8 text-sm md:grid-cols-2 lg:grid-cols-3 lg:flex-1">
          <div>
            <p className="mb-3 font-semibold text-white">Atendimento</p>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>Atendimento Online 1: Whatsapp (85) 98102-5616</p>
              <p>Atendimento Online 2: Whatsapp (85) 98181-9448</p>
            </div>
          </div>

          <div>
            <p className="mb-3 font-semibold text-white">E-mail</p>
            <p className="text-sm text-neutral-300">E-mail: tnymenswear@gmail.com</p>
          </div>

          <div>
            <p className="mb-3 font-semibold text-white">Redes sociais</p>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>Instagram: @tnymenswear</p>
              <p>Facebook: TNY Menswear</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 sm:p-6">
        {state.succeeded ? (
          <p className="text-emerald-300 font-semibold">Obrigado pela inscrição!</p>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-white">Cadastre seu e-mail e receba nossas novidades</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                required
                placeholder="Seu e-mail"
                className="flex-1 rounded-full border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-neutral-500"
              />
              <button 
                type="submit" 
                disabled={state.submitting}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
              >
                {state.submitting ? "Enviando..." : "Inscrever-se"}
              </button>
            </form>
          </>
        )}
      </div>
    </footer>
  );
}