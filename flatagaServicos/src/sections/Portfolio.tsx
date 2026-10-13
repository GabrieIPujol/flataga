import { useRef, useState } from "react"
import { gsap, Flip, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap"
import { categories, portfolio, type Category } from "../content"
import { Photo } from "../components/Photo"
import { SectionLabel } from "../components/SectionLabel"

type Filter = Category | "all"

export function Portfolio() {
  const root = useRef<HTMLElement>(null)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const matches = (c: Category) => filter === "all" || c === filter
  const visible = portfolio.filter((p) => matches(p.category)).length

  const choose = (id: Filter) => {
    if (id === filter) return
    flipState.current = Flip.getState(".portfolio-item")
    setFilter(id)
  }

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from(".portfolio-media", { clipPath: "inset(100% 0 0 0)", duration: 1.1, ease: "power4.inOut", stagger: 0.12, scrollTrigger: { trigger: ".portfolio-grid", start: "top 80%" } })
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      const state = flipState.current
      flipState.current = null
      if (!state) return
      // A altura da página muda com o filtro; ScrollTrigger não percebe sozinho.
      if (!window.matchMedia(MOTION).matches) {
        ScrollTrigger.refresh()
        return
      }
      Flip.from(state, {
        onComplete: () => ScrollTrigger.refresh(),
        targets: ".portfolio-item",
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
      })
    },
    { dependencies: [filter], scope: root },
  )

  return (
    <section ref={root} id="portfolio" className="bg-paper py-24 text-ink-950 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel index="03">Portfólio</SectionLabel>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight md:text-6xl">Trabalhos realizados</h2>
          <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => choose(c.id)}
                className="rounded-full border border-ink-950/15 px-4 py-2 text-sm transition-colors hover:border-brand-500 aria-pressed:border-brand-500 aria-pressed:bg-brand-500"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="portfolio-grid mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p) => (
            <li key={p.title} className={`portfolio-item group ${matches(p.category) ? "" : "hidden"}`}>
              <div className="portfolio-media overflow-hidden rounded-2xl">
                <Photo image={p.image} alt={`${p.place} - ${p.title}`} className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-wood-600">
                {p.place} · {categories.find((c) => c.id === p.category)!.label}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">{p.title}</h3>
            </li>
          ))}
        </ul>
        {visible === 0 && <p className="mt-12 text-ink-950/60">Nenhum trabalho nesta categoria ainda.</p>}
      </div>
    </section>
  )
}
