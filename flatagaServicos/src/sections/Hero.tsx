import { useRef } from "react"
import { gsap, SplitText, useGSAP, MOTION, DESKTOP } from "../lib/gsap"
import { asset } from "../lib/asset"
import { whatsappUrl } from "../lib/whatsapp"
import { contact } from "../content"
import { Icon } from "../components/Icon"

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const split = SplitText.create(".hero-title", { type: "words", mask: "words" })
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.08 })
          .from(".hero-line", { drawSVG: 0, duration: 1.2, ease: "power2.inOut" }, "-=0.6")
          .from(".hero-fade", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.8")
        return () => split.revert()
      })
      mm.add(DESKTOP, () => {
        const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true }
        gsap.to(".hero-video", { scale: 1.15, ease: "none", scrollTrigger: scrub })
        gsap.to(".hero-content", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { ...scrub } })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="home" className="relative flex min-h-svh items-end overflow-hidden bg-ink-950 pb-24 pt-32">
      <video className="hero-video absolute inset-0 size-full object-cover" src={asset("videos/videoHero.mp4")} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
      <div className="bg-blueprint absolute inset-0 opacity-60" />
      <div className="hero-content relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <p className="hero-fade font-mono text-xs uppercase tracking-[0.3em] text-brand-400">[ Construção · Reforma · Manutenção ]</p>
        <h1 className="hero-title mt-6 max-w-5xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
          Construindo sonhos, reformando histórias
        </h1>
        <svg className="mt-8 h-2 w-48 text-brand-500" viewBox="0 0 192 8" aria-hidden="true">
          <path className="hero-line" d="M0 4H192" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p className="hero-fade mt-8 max-w-xl text-lg text-white/70">Transformamos suas ideias em realidade com qualidade, inovação e pontualidade.</p>
        <div className="hero-fade mt-10 flex flex-wrap gap-4">
          <a href={whatsappUrl(contact.whatsapp)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 font-medium text-ink-950 transition hover:bg-brand-400">
            <Icon name="whatsapp" className="size-5" />
            Fale no WhatsApp
          </a>
          <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-medium text-white transition hover:border-brand-500 hover:text-brand-400">
            Ver serviços
            <Icon name="arrow" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
