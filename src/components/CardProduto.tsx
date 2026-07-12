import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { getProductById } from "../services/api";
import { keys } from "../hooks/queries";
import { useCarrinho } from "../context/useCarrinho";
import { useToast } from "../context/useToast";
import { Badge, SafeImage, Spinner } from "./ui";

interface CardProdutoProps {
  id: number;
  name: string;
  image: string;
  price: number;
  promotional_price?: number | null;
  badge?: string;
}

function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function CardProduto({ id, name, image, price, promotional_price, badge }: CardProdutoProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToCart } = useCarrinho();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  const isOnSale = !!promotional_price && promotional_price < price;
  const displayBadge = badge ?? (isOnSale ? "Promoção" : undefined);

  // adds the cover variant (first one in stock) without leaving the listing.
  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      // reuse the product detail cache shared with the product page.
      const detail = await queryClient.fetchQuery({
        queryKey: keys.product(id),
        queryFn: () => getProductById(id),
      });
      const variant = detail.variants.find((v) => v.quantity > 0) ?? detail.variants[0];
      if (!variant) {
        showToast("Selecione as opções na página do produto.", "error");
        navigate(`/produto/${id}`);
        return;
      }
      if (variant.quantity <= 0) {
        showToast("Produto sem estoque no momento.", "error");
        return;
      }
      addToCart(
        { id, name, price, promotional_price, image },
        variant.color,
        variant.size,
        variant.id,
      );
      showToast("Adicionado ao carrinho!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erro ao adicionar", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article
      onClick={() => navigate(`/produto/${id}`)}
      className="group cursor-pointer overflow-hidden rounded-card border border-line bg-surface-2 transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
    >
      {/* 3:4 portrait image */}
      <div className="relative overflow-hidden">
        <div className="aspect-[3/4]">
          <SafeImage
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
        {displayBadge && (
          <Badge tone={isOnSale ? "accent" : "neutral"} className="absolute left-3 top-3">
            {displayBadge}
          </Badge>
        )}
      </div>

      {/* content */}
      <div className="p-4">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-ink">{name}</p>
        <div className="mt-2 flex items-baseline gap-2 tabular-nums">
          {isOnSale ? (
            <>
              <p className="text-base font-bold text-price">{formatBRL(promotional_price)}</p>
              <p className="text-xs text-ink-subtle line-through">{formatBRL(price)}</p>
            </>
          ) : (
            <p className="text-base font-bold text-ink">{formatBRL(price)}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={adding}
          aria-label={`Adicionar ${name} ao carrinho`}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill border border-line bg-white/5 py-2 text-xs font-semibold text-ink transition-all duration-200 hover:border-accent/50 hover:bg-white/10 active:scale-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          {adding ? <Spinner className="h-3.5 w-3.5" /> : <ShoppingBag size={14} />}
          {adding ? "Adicionando" : "Adicionar"}
        </button>
      </div>
    </article>
  );
}
