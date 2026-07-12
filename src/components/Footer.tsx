import { useState } from "react";
import { Link } from "react-router-dom";
import { useSubscribeLead } from "../hooks/mutations";
import { useToast } from "../context/useToast";
import { Button, Input } from "./ui";
import logoTny from "../assets/Ativo 17.png";

export function Footer() {
  const { showToast } = useToast();
  const subscribeLead = useSubscribeLead();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribeLead.mutateAsync({ name: nome, email, phone: telefone, marketing_consent: true });
      showToast("Inscrição realizada com sucesso!");
      setNome("");
      setEmail("");
      setTelefone("");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erro ao se inscrever", "error");
    }
  };

  return (
    <footer className="mt-10 border-t border-line bg-surface px-6 py-8 text-ink-muted sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:justify-between">
        <div className="max-w-sm">
          <img src={logoTny} alt="TNY Menswear" className="mb-2 h-9 w-auto" />
          <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">
            Todos os direitos reservados. ®
          </p>
        </div>

        <div className="grid gap-7 text-sm md:grid-cols-3 lg:flex-1">
          <div>
            <p className="mb-3 font-semibold text-ink">Atendimento</p>
            <div className="space-y-1.5 text-ink-muted">
              <p>WhatsApp: (85) 98102-5616</p>
              <p>WhatsApp: (85) 98181-9448</p>
              <Link to="/faq" className="inline-block text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline">
                Dúvidas, trocas e entregas
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-3 font-semibold text-ink">E-mail</p>
            <p className="text-ink-muted">tnymenswear@gmail.com</p>
          </div>
          <div>
            <p className="mb-3 font-semibold text-ink">Redes sociais</p>
            <div className="space-y-1.5 text-ink-muted">
              <p>Instagram: @tnymenswear</p>
              <p>Facebook: TNY Menswear</p>
            </div>
          </div>
        </div>
      </div>

      {/* newsletter */}
      <div className="mx-auto mt-8 max-w-7xl rounded-2xl border border-line bg-surface-2 p-6 sm:p-8">
        <p className="mb-4 text-sm font-semibold text-ink">
          Cadastre-se e receba nossas novidades
        </p>
        <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap">
          <Input
            type="text"
            required
            aria-label="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className="flex-1"
          />
          <Input
            type="email"
            required
            aria-label="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="flex-1"
          />
          <Input
            type="tel"
            required
            aria-label="Seu telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Seu telefone"
            className="flex-1"
          />
          <Button type="submit" size="lg" loading={subscribeLead.isPending} className="flex-shrink-0">
            {subscribeLead.isPending ? "Enviando" : "Inscrever-se"}
          </Button>
        </form>
      </div>
    </footer>
  );
}
