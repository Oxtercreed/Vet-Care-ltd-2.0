import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  position?: string;
  transitionName?: string;
  /** Use for above-the-fold hero images */
  priority?: boolean;
};

export function Photo({
  src,
  alt,
  className,
  imgClassName,
  position,
  transitionName,
  priority,
}: PhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Derive WebP alternative if source is .jpg or .png
  const webpSrc = src && (src.endsWith(".jpg") || src.endsWith(".jpeg") || src.endsWith(".png"))
    ? src.replace(/\.(jpg|jpeg|png)$/, ".webp")
    : null;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setFailed(true);
      }
    }
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-[28px] bg-brand-soft", className)}
        aria-label={alt || "Image"}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-brand-soft", className)}>
      <picture className="block size-full">
        {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
        <img
          ref={(el) => {
            imgRef.current = el;
            if (el && el.complete && el.naturalWidth > 0 && !loaded) {
              setLoaded(true);
            }
          }}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            objectPosition: position ?? "center",
            viewTransitionName: transitionName,
          }}
          className={cn(
            "size-full object-cover photo-outline transition-opacity duration-200 ease-out",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      </picture>
    </div>
  );
}
