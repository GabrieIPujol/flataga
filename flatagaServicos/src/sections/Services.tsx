import { useRef } from "react"
import { gsap, useGSAP, MOTION, DESKTOP } from "../lib/gsap"
import { services } from "../content"
import { Icon } from "../components/Icon"
import { SectionLabel } from "../components/SectionLabel"

const pad = (n: number) => String(n).padStart(2, "0")

export function Services() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLUListElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP, () => {
        const el = track.current!
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        })
      })
      mm.add(MOTION, () => {
        gsap.from(".service-card", { y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: track.current, start: "top 85%" } })
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="services"
      className="overflow-hidden bg-ink-950 py-24 text-white md:motion-safe:flex md:motion-safe:h-svh md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:py-0"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionLabel index="02">Serviços</SectionLabel>
        <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">Soluções completas para sua construção e reforma</h2>
      </div>
      <ul ref={track} className="mt-14 grid gap-6 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3 md:motion-safe:flex md:motion-safe:w-max">
        {services.map((s, i) => (
          <li
            key={s.title}
            className="service-card bg-blueprint group flex flex-col rounded-2xl border border-white/10 bg-ink-900 p-8 transition-colors hover:border-brand-500/60 md:motion-safe:w-96"
          >
            <span className="font-mono text-xs text-brand-500">
              {pad(i + 1)} / {pad(services.length)}
            </span>
            <Icon name={s.icon} className="mt-10 size-10 text-brand-500 transition-transform group-hover:scale-110" />
            <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
            <p className="mt-3 text-white/60">{s.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
