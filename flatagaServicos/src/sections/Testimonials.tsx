import { useRef } from "react"
import { gsap, useGSAP, MOTION } from "../lib/gsap"
import { testimonials } from "../content"
import { SectionLabel } from "../components/SectionLabel"

export function Testimonials() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const track = root.current!.querySelector<HTMLElement>(".marquee-track")!
        const tween = gsap.to(track, { xPercent: -50, duration: 40, ease: "none", repeat: -1 })
        const pause = () => tween.pause()
        const play = () => tween.play()
        track.addEventListener("mouseenter", pause)
        track.addEventListener("mouseleave", play)
        return () => {
          track.removeEventListener("mouseenter", pause)
          track.removeEventListener("mouseleave", play)
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="testimonials" className="overflow-hidden bg-ink-950 py-24 text-white md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel index="04">Depoimentos</SectionLabel>
        <h2 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl">O que nossos clientes dizem</h2>
      </div>
      <div className="marquee-track mt-14 grid gap-6 px-4 md:grid-cols-3 md:px-8 motion-safe:flex motion-safe:w-max motion-safe:gap-0 motion-safe:px-0">
        {[...testimonials, ...testimonials].map((t, i) => {
          const copy = i >= testimonials.length
          return (
            <figure key={i} aria-hidden={copy || undefined} className={`motion-safe:w-[28rem] motion-safe:max-w-[85vw] motion-safe:pl-6 ${copy ? "motion-reduce:hidden" : ""}`}>
              <div className="h-full rounded-2xl border border-white/10 bg-ink-900 p-8">
                <blockquote className="text-lg leading-relaxed text-white/80">“{t.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-full bg-brand-500 font-display font-bold text-ink-950">{t.name[0]}</span>
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="text-sm text-white/50">{t.role}</span>
                  </span>
                </figcaption>
              </div>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
