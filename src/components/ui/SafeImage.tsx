import { useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "./cn";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "onError"> & {
  /** Classe aplicada tanto à imagem quanto ao placeholder (mesmo tamanho). */
  className?: string;
};

/** Imagem com fallback: se a URL falhar ou estiver vazia, mostra um placeholder. */
export function SafeImage({ src, alt = "", className, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  const missing = !src || failed;

  if (missing) {
    return (
      <div
        role="img"
        aria-label={alt || "Imagem indisponível"}
        className={cn("flex items-center justify-center bg-elevated text-ink-subtle", className)}
      >
        <ImageOff size={20} aria-hidden="true" />
      </div>
    );
  }

  return <img src={src} alt={alt} onError={() => setFailed(true)} className={className} {...props} />;
}
