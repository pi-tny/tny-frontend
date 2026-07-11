import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { subscribeLead } from "../services/api";
import { useToast } from "../context/useToast";
import { Button, Field, Input } from "../components/ui";

export function Revendedor() {
  const { showToast } = useToast();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cidade, setCidade] = useState("");
  const [parceria, setParceria] = useState("Loja física");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await subscribeLead({ name: nome, email, phone: whatsapp, marketing_consent: true });
      setSuccess(true);
      showToast("Solicitação enviada com sucesso!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erro ao enviar solicitação", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/" className="mb-6 inline-block text-sm text-ink-muted transition-colors hover:text-ink">
        ← Voltar
      </Link>

      <div className="mx-auto max-w-5xl rounded-[32px] border border-line bg-surface p-6 shadow-2xl sm:p-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Parceria comercial</p>
          <h1 className="mt-2 text-3xl font-bold">Seja revendedor TNY</h1>
          <p className="mt-3 text-sm text-ink-muted">
            Preencha os dados abaixo para entrar em contato com a equipe comercial da TNY.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {success ? (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-price/20 bg-price/5 p-10 text-center">
              <CheckCircle size={40} className="mb-4 text-price" />
              <p className="font-semibold text-ink">Solicitação recebida!</p>
              <p className="mt-2 text-sm text-ink-muted">
                Nossa equipe entrará em contato em breve pelo WhatsApp ou e-mail.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-[24px] border border-line bg-surface-2 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome" htmlFor="rev-nome" required>
                  <Input id="rev-nome" required autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
                </Field>
                <Field label="E-mail" htmlFor="rev-email" required>
                  <Input id="rev-email" required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="WhatsApp" htmlFor="rev-whatsapp" required>
                  <Input id="rev-whatsapp" required type="tel" autoComplete="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(85) 98102-5616" />
                </Field>
                <Field label="Cidade" htmlFor="rev-cidade">
                  <Input id="rev-cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Sua cidade" />
                </Field>
              </div>

              <Field label="Tipo de parceria" htmlFor="rev-parceria">
                <select
                  id="rev-parceria"
                  value={parceria}
                  onChange={(e) => setParceria(e.target.value)}
                  className="w-full rounded-pill border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent/60"
                >
                  <option className="bg-surface text-ink">Loja física</option>
                  <option className="bg-surface text-ink">Loja online</option>
                  <option className="bg-surface text-ink">Atacadista</option>
                  <option className="bg-surface text-ink">Influenciador</option>
                </select>
              </Field>

              <Field label="Mensagem" htmlFor="rev-mensagem">
                <textarea
                  id="rev-mensagem"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="min-h-28 w-full rounded-[20px] border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-subtle focus:border-accent/60"
                  placeholder={`Tipo: ${parceria}${cidade ? ` — Cidade: ${cidade}` : ""}. Conte um pouco sobre seu projeto.`}
                />
              </Field>

              <Button type="submit" size="lg" loading={loading} className="w-full">
                {loading ? "Enviando" : "Enviar solicitação"}
              </Button>
            </form>
          )}

          <div className="space-y-4 rounded-[24px] border border-line bg-surface-2 p-5">
            <div className="rounded-[20px] border border-line bg-elevated p-4">
              <p className="text-sm font-semibold text-ink">Por que virar revendedor?</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                <li>• Margens competitivas</li>
                <li>• Catálogo atualizado</li>
                <li>• Suporte comercial</li>
                <li>• Venda direta e logística simples</li>
              </ul>
            </div>
            <Link
              to="/carrinho"
              className="block w-full rounded-pill border border-line bg-white/5 px-4 py-3 text-center text-sm font-medium text-ink transition hover:bg-white/10"
            >
              Ver carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}