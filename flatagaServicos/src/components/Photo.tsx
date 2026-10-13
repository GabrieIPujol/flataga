import { asset } from "../lib/asset"

// Sem `image` mostra placeholder de planta; ao chegar a foto, basta preencher `image` em content.ts.
export function Photo({ image, alt, className = "" }: { image?: string; alt: string; className?: string }) {
  if (image) return <img src={asset(image)} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  return (
    <div role="img" aria-label={alt} className={`bg-blueprint relative grid place-items-center bg-ink-800 ${className}`}>
      <svg className="absolute inset-0 size-full text-brand-500/20" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0L100 100M100 0L0 100" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative font-mono text-xs uppercase tracking-widest text-brand-400/70">[ foto em breve ]</span>
    </div>
  )
}
