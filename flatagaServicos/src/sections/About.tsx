import { useRef } from "react"
import { gsap, SplitText, useGSAP, MOTION } from "../lib/gsap"
import { about, stats, values } from "../content"
import { SectionLabel } from "../components/SectionLabel"

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const split = SplitText.create(".about-manifesto", { type: "words" })
        gsap.from(split.words, {
          opacity: 0.15,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".about-manifesto", start: "top 80%", end: "bottom 45%", scrub: true },
        })
        gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
          gsap.from(el, { textContent: 0, duration: 2, ease: "power2.out", snap: { textContent: 1 }, scrollTrigger: { trigger: el, start: "top 85%" } })
        })
        gsap.from(".about-value", { y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".about-values", start: "top 80%" } })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="bg-paper py-24 text-ink-950 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel index="01">Sobre nós</SectionLabel>
        <p className="about-manifesto mt-8 max-w-5xl font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl">{about.manifesto}</p>

        <dl className="mt-20 grid gap-10 border-t border-ink-950/10 pt-10 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-mono text-xs uppercase tracking-widest text-wood-600">{s.label}</dt>
              <dd className="mt-2 font-display text-6xl font-bold text-brand-600">
                <span className="stat-value">{s.value}</span>
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="about-values mt-20 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.title} className="about-value rounded-2xl border border-ink-950/10 p-8">
              <span className="font-mono text-xs text-brand-600">0{i + 1}</span>
              <h3 className="mt-4 font-display text-2xl font-semibold">{v.title}</h3>
              <p className="mt-3 text-ink-950/70">{v.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
