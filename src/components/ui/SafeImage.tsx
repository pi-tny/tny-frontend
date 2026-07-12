import { useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "./cn";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "onError"> & {
  /** class applied to both the image and the placeholder (same size). */
  className?: string;
};

/** image with fallback: shows a placeholder if the url fails or is empty. */
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
