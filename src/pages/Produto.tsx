import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, Share2 } from "lucide-react";
import { useProduct, useRelatedProducts } from "../hooks/queries";
import type { ApiImage, ApiVariant, ProductDetail } from "../types";
import { useCarrinho } from "../context/useCarrinho";
import { useToast } from "../context/useToast";
import { CardProduto } from "../components/CardProduto";
import { SkeletonCard } from "../components/SkeletonCard";
import { Button, SafeImage, cn } from "../components/ui";

const COLOR_CLASSES: Record<string, string> = {
  Branco: "bg-white border-neutral-300",
  Cinza: "bg-neutral-400 border-neutral-400",
  Preto: "bg-black border-neutral-700",
  Azul: "bg-blue-600 border-blue-600",
  Amarelo: "bg-yellow-400 border-yellow-400",
  Vermelho: "bg-red-600 border-red-600",
  Verde: "bg-green-600 border-green-600",
  Marrom: "bg-amber-800 border-amber-800",
  Rosa: "bg-pink-400 border-pink-400",
  Roxo: "bg-purple-600 border-purple-600",
  Laranja: "bg-orange-500 border-orange-500",
};

function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

/**
 * gallery by color: if the selected color has its own (variant) images, show
 * those; otherwise fall back to the product's general images, then to the cover.
 */
function resolveDisplayImages(product: ProductDetail, color: string): ApiImage[] {
  const byPosition = (a: ApiImage, b: ApiImage) => a.position - b.position;
  const general = product.images.filter((im) => im.variant_id === null).sort(byPosition);
  const variantIds = new Set(product.variants.filter((v) => v.color === color).map((v) => v.id));
  const variantImgs = product.images
    .filter((im) => im.variant_id != null && variantIds.has(im.variant_id))
    .sort(byPosition);
  const chosen = variantImgs.length ? variantImgs : general;
  if (chosen.length) return chosen;
  return product.cover_image
    ? [{ id: 0, product_id: product.id, variant_id: null, url: product.cover_image, alt_text: null, position: 0 }]
    : [];
}

export function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity } = useCarrinho();
  const { showToast } = useToast();

  const productId = id ? Number(id) : undefined;
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: related = [], isLoading: relatedLoading } = useRelatedProducts(product?.id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [qty, setQty] = useState(1);
  // user's color/size choice, scoped to a product id so it resets on navigation.
  const [choice, setChoice] = useState<{ id: number; color: string; size?: string }>();

  const colors = product ? [...new Set(product.variants.map((v) => v.color))] : [];
  const activeChoice = product && choice?.id === product.id ? choice : undefined;
  const selectedColor = activeChoice?.color ?? colors[0] ?? "";
  const sizesForColor = product
    ? product.variants.filter((v) => v.color === selectedColor).map((v) => v.size)
    : [];
  const selectedSize = activeChoice?.size ?? sizesForColor[0] ?? "";

  // auto carousel: the main image advances every 5s (pauses on hover).
  useEffect(() => {
    if (!product || paused) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const count = resolveDisplayImages(product, selectedColor).length;
    if (count <= 1) return;
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [product, selectedColor, paused]);

  const handleColorSelect = (color: string) => {
    if (!product) return;
    // switch the gallery to the selected color's images (restart at the beginning).
    setChoice({ id: product.id, color });
    setActiveIndex(0);
    setQty(1);
  };

  /* loading */
  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl animate-pulse gap-8 rounded-[28px] border border-line bg-surface p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full rounded-[20px] bg-white/5 md:aspect-[4/5]" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 flex-1 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
        <div className="space-y-4 py-4">
          <div className="h-3 w-24 rounded bg-white/5" />
          <div className="h-8 w-3/4 rounded bg-white/5" />
          <div className="h-6 w-1/4 rounded bg-white/5" />
          <div className="h-24 rounded bg-white/5" />
          <div className="h-10 rounded bg-white/5" />
          <div className="h-10 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  /* error / not found */
  if (error || !product) {
    return (
      <div>
        <Link to="/produtos" className="mb-6 inline-block text-sm text-ink-muted transition-colors hover:text-ink">
          ← Voltar para a loja
        </Link>
        <div className="mx-auto max-w-md rounded-[24px] border border-line bg-surface-2 p-8 text-center">
          <h1 className="text-xl font-semibold">{error?.message ?? "Produto não encontrado"}</h1>
          <Link
            to="/produtos"
            className="mt-4 inline-flex rounded-pill bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant: ApiVariant | undefined = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );
  const outOfStock = selectedVariant ? selectedVariant.quantity === 0 : false;
  const displayPrice = selectedVariant?.final_price ?? product.promotional_price ?? product.price;
  const isOnSale = !!product.promotional_price && product.promotional_price < product.price;

  const maxQty = Math.max(1, selectedVariant?.quantity ?? 1);
  const safeQty = Math.min(qty, maxQty);

  const handleCopySku = async () => {
    try {
      await navigator.clipboard.writeText(product.sku);
      showToast("Referência copiada!");
    } catch {
      showToast("Não foi possível copiar", "error");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link copiado!");
      }
    } catch {
      // user cancelled the share — ignore
    }
  };

  const displayImages = resolveDisplayImages(product, selectedColor);

  const coverUrl = product.cover_image ?? displayImages[0]?.url ?? "";
  const currentImageUrl = displayImages[activeIndex]?.url ?? displayImages[0]?.url ?? "";

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        promotional_price: product.promotional_price,
        image: coverUrl,
      },
      selectedColor,
      selectedSize,
      selectedVariant?.id,
    );
    // addToCart inserts 1 unit; top it up to the chosen quantity.
    if (safeQty > 1) {
      updateQuantity(product.id, selectedColor, selectedSize, safeQty - 1);
    }
    showToast("Adicionado com sucesso!");
  };

  const handleFinalizeOrder = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <div>
      {/* seo / open graph */}
      <Helmet>
        <title>{product.name} | TNY Menswear</title>
        <meta
          name="description"
          content={product.description?.substring(0, 160) || `${product.name} — TNY Menswear`}
        />
        <meta property="og:title" content={`${product.name} | TNY Menswear`} />
        <meta
          property="og:description"
          content={product.description?.substring(0, 160) || `${product.name} — TNY Menswear`}
        />
        {coverUrl && <meta property="og:image" content={coverUrl} />}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      {/* breadcrumb */}
      <nav aria-label="Trilha de navegação" className="mb-5 flex items-center gap-1.5 text-sm text-ink-muted">
        <Link to="/" className="transition-colors hover:text-ink">Início</Link>
        <span className="text-ink-subtle">/</span>
        {product.categories[0] ? (
          <Link
            to={`/produtos?categoria=${product.categories[0].id}`}
            className="transition-colors hover:text-ink"
          >
            {product.categories[0].name}
          </Link>
        ) : (
          <Link to="/produtos" className="transition-colors hover:text-ink">
            Produtos
          </Link>
        )}
        <span className="text-ink-subtle">/</span>
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      {/* details */}
      <div className="mx-auto grid max-w-6xl gap-6 rounded-[28px] border border-line bg-surface p-5 shadow-2xl sm:p-6 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-8">
        {/* images */}
        <div className="flex flex-col gap-3">
          <div
            className="relative overflow-hidden rounded-[20px] border border-line bg-surface-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="aspect-square md:aspect-[4/5]">
              <SafeImage
                src={currentImageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-opacity duration-500"
              />
            </div>
            {/* indicators (when there's more than one image) */}
            {displayImages.length > 1 && (
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {displayImages.map((img, i) => (
                  <span
                    key={img.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/40",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* thumbnail carousel (horizontal) */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {displayImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === activeIndex}
                  className={cn(
                    "aspect-square w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:w-20",
                    i === activeIndex ? "border-accent" : "border-transparent opacity-60 hover:opacity-90",
                  )}
                >
                  <SafeImage src={img.url} alt={img.alt_text ?? product.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* details */}
        <div className="flex flex-col justify-center">
          {product.categories[0] && (
            <p className="text-xs uppercase tracking-[0.35em] text-accent">{product.categories[0].name}</p>
          )}
          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
          <button
            type="button"
            onClick={handleCopySku}
            aria-label={`Copiar referência ${product.sku}`}
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-subtle transition-colors hover:text-ink"
          >
            Ref. {product.sku}
            <Copy size={12} />
          </button>

          {/* price */}
          <div className="mt-3 flex items-baseline gap-3 tabular-nums">
            <p className="text-2xl font-bold text-price">{formatBRL(displayPrice)}</p>
            {isOnSale && <p className="text-base text-ink-subtle line-through">{formatBRL(product.price)}</p>}
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{product.description}</p>
          )}

          {/* colors */}
          {colors.length > 0 && (
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted">Cor</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                      "flex min-h-[40px] items-center gap-2 rounded-pill border px-3 py-2 text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                      selectedColor === color
                        ? "border-white bg-white text-black"
                        : "border-line bg-elevated text-ink hover:border-line-strong",
                    )}
                  >
                    <span
                      className={cn(
                        "h-3.5 w-3.5 flex-shrink-0 rounded-full border",
                        COLOR_CLASSES[color] ?? "bg-neutral-400 border-neutral-400",
                      )}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* sizes */}
          {sizesForColor.length > 0 && (
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted">Tamanho</p>
              <div className="flex flex-wrap gap-2">
                {sizesForColor.map((size) => {
                  const v = product.variants.find((vv) => vv.color === selectedColor && vv.size === size);
                  const unavailable = v ? v.quantity === 0 : false;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => !unavailable && setChoice({ id: product.id, color: selectedColor, size })}
                      disabled={unavailable}
                      className={cn(
                        "flex min-h-[40px] min-w-[44px] items-center justify-center rounded-pill border px-3 text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                        selectedSize === size
                          ? "border-white bg-white text-black"
                          : unavailable
                            ? "cursor-not-allowed border-line bg-elevated text-ink-subtle line-through"
                            : "border-line bg-elevated text-ink hover:border-line-strong",
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedVariant && (
            <p className={cn("mt-2.5 text-xs font-medium", outOfStock ? "text-danger" : "text-price")}>
              {outOfStock
                ? "Sem estoque"
                : selectedVariant.quantity <= 5
                  ? `Apenas ${selectedVariant.quantity} em estoque`
                  : "Em estoque"}
            </p>
          )}

          {/* quantity */}
          {!outOfStock && (
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted">Qtd</span>
              <div className="flex items-center gap-1 rounded-pill border border-line bg-elevated px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={safeQty <= 1}
                  aria-label="Diminuir quantidade"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">{safeQty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={safeQty >= maxQty}
                  aria-label="Aumentar quantidade"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" onClick={handleAddToCart} disabled={outOfStock} className="flex-1">
              {outOfStock ? "Sem estoque" : "Adicionar ao carrinho"}
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={handleFinalizeOrder} disabled={outOfStock} className="flex-1">
              Finalizar pedido
            </Button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartilhar produto"
              className="flex items-center justify-center rounded-pill border border-line px-4 py-3 text-ink-muted transition-all duration-200 hover:border-accent/50 hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* related products */}
      {(relatedLoading || related.length > 0) && (
        <div className="mx-auto mt-10 max-w-6xl">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">Veja Também</h2>
          <div className="relative">
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-bg to-transparent" />
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {relatedLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-[160px] flex-shrink-0 sm:w-[200px]">
                      <SkeletonCard />
                    </div>
                  ))
                : related.map((p) => (
                    <div key={p.id} className="w-[160px] flex-shrink-0 sm:w-[200px]">
                      <CardProduto
                        id={p.id}
                        name={p.name}
                        image={p.cover_image ?? ""}
                        price={p.price}
                        promotional_price={p.promotional_price}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
