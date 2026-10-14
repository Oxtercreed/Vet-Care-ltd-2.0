import { cn } from "@/lib/utils";

/**
 * The Richmond Veterinary Hospital logo — vector SVG mark paired with clean editorial typography.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex size-9 shrink-0", className)}>
      <img src="/brand/vet-mark-light.svg" alt="Richmond Vet" className="logo-on-dark size-full object-contain" />
      <img src="/brand/vet-mark.svg" alt="Richmond Vet" className="logo-on-light size-full object-contain" />
    </span>
  );
}

export function LogoWord({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <LogoMark className="size-8" />
      <span className="leading-tight text-left">
        <span
          className={cn(
            "block font-display text-[1.18rem] font-medium tracking-[0.05em] leading-none",
            light ? "text-white" : "text-ink"
          )}
        >
          Richmond Vet
        </span>
        <span
          className={cn(
            "block text-[0.52rem] font-sans font-medium uppercase tracking-[0.24em] mt-0.5",
            light ? "text-white/80" : "text-muted"
          )}
        >
          Animal Hospital
        </span>
      </span>
    </span>
  );
}
