import { cn } from "@/lib/utils";

/**
 * Vet Care LTD logo — true vector SVG on a transparent background (no white box).
 * Two colourways are swapped by theme in styles.css:
 *   .logo-on-dark  → white version, shown on the dark "noir" theme
 *   .logo-on-light → brand-blue version, shown on the light "ivory" theme
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex size-9 shrink-0", className)}>
      <img src="/brand/vet-mark-light.svg" alt="" className="logo-on-dark size-full object-contain" />
      <img src="/brand/vet-mark.svg" alt="" className="logo-on-light size-full object-contain" />
    </span>
  );
}

export function LogoWord({ className }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src="/brand/vet-logo-light.svg"
        alt="Vet Care LTD"
        className="logo-on-dark h-11 w-auto max-w-[160px] object-contain object-left"
      />
      <img
        src="/brand/vet-logo.svg"
        alt="Vet Care LTD"
        className="logo-on-light h-11 w-auto max-w-[160px] object-contain object-left"
      />
    </span>
  );
}
