import { Link } from "react-router-dom";

const FAQ = [
  {
    q: "Como faço um pedido?",
    a: "Escolha o produto, selecione cor e tamanho, adicione ao carrinho e finalize. O pedido é enviado para o nosso WhatsApp, onde combinamos pagamento e entrega.",
  },
  {
    q: "Quais são as formas de pagamento?",
    a: "Aceitamos Pix, cartão de crédito, dinheiro, transferência bancária e boleto. A forma é confirmada com nossa equipe pelo WhatsApp.",
  },
  {
    q: "Como funcionam as trocas?",
    a: "Trocas por tamanho ou defeito podem ser solicitadas em até 7 dias após o recebimento, com o produto sem uso e com etiqueta. Fale com nosso atendimento pelo WhatsApp.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "O prazo varia conforme a região e é combinado no momento do pedido. Para a região de Pacajus/CE, oferecemos entrega local rápida.",
  },
  {
    q: "Vocês atendem revendedores?",
    a: "Sim! Temos condições especiais para revenda. Preencha o formulário na página “Seja revendedor” e nossa equipe entra em contato.",
  },
];

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="mb-6 inline-block text-sm text-ink-muted transition-colors hover:text-ink">
        ← Voltar
      </Link>

      <div className="rounded-[32px] border border-line bg-surface p-6 shadow-2xl sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Ajuda</p>
        <h1 className="mt-2 text-3xl font-bold">Dúvidas, trocas e entregas</h1>
        <p className="mt-3 text-sm text-ink-muted">
          As respostas para as perguntas mais comuns. Não achou o que procurava? Fale com a gente pelo WhatsApp.
        </p>

        <div className="mt-8 space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="group rounded-[20px] border border-line bg-surface-2 p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-ink">
                {item.q}
                <span className="text-accent transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/revendedor"
            className="inline-flex rounded-pill border border-line bg-white/5 px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-white/10"
          >
            Seja revendedor
          </Link>
          <Link
            to="/produtos"
            className="inline-flex rounded-pill bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100"
          >
            Ver produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
