import { useEffect, useRef, useState } from "react"
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap"
import { asset } from "../lib/asset"
import { nav } from "../content"
import { Icon } from "../components/Icon"

export function Header() {
  const root = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (!open) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    // Menu some no desktop (lg:hidden); fecha para não deixar o scroll travado.
    const desktop = window.matchMedia("(min-width: 1024px)")
    const onWide = () => desktop.matches && setOpen(false)
    window.addEventListener("keydown", onKey)
    desktop.addEventListener("change", onWide)
    return () => {
      window.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", onWide)
      trigger.current?.focus({ preventScroll: true })
    }
  }, [open])

  useGSAP(() => {
    const header = root.current!
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => header.toggleAttribute("data-scrolled", s.scroll() > 40) })
    gsap.matchMedia().add(MOTION, () => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (s) => gsap.to(header, { yPercent: s.direction === 1 && s.scroll() > 400 ? -100 : 0, duration: 0.3, ease: "power2.out", overwrite: true }),
      })
    })
  })

  useGSAP(
    () => {
      if (!open) return
      gsap.matchMedia().add(MOTION, () => {
        gsap.from(".menu-link", { y: 40, opacity: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" })
      })
    },
    { dependencies: [open], scope: menu },
  )

  const go = (href: string) => {
    setOpen(false)
    requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView())
  }

  return (
    <>
      <header ref={root} className="fixed inset-x-0 top-0 z-50 transition-colors duration-300 data-[scrolled]:bg-ink-950/80 data-[scrolled]:backdrop-blur-md">
        <nav aria-label="Principal" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <a href="#home" className="flex items-center gap-3">
            <img src={asset("img/logo.png")} alt="Flataga Serviços" className="size-10 rounded-md bg-white object-contain" />
            <span className="font-display font-semibold tracking-tight text-white">FLATAGA</span>
          </a>
          <ul className="hidden items-center gap-8 lg:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-white/70 transition hover:text-brand-400">{l.label}</a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="hidden rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-ink-950 transition hover:bg-brand-400 lg:inline-block">
            Solicitar orçamento
          </a>
          <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Abrir menu" className="text-white lg:hidden">
            <Icon name="menu" />
          </button>
        </nav>
      </header>
      {open && (
        <div ref={menu} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col bg-ink-950 px-4 py-4 lg:hidden">
          <div className="flex h-8 justify-end">
            <button ref={closeBtn} type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="text-white">
              <Icon name="close" />
            </button>
          </div>
          <ul className="mt-12 space-y-6">
            {nav.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(l.href)
                  }}
                  className="menu-link flex items-baseline gap-4 font-display text-4xl text-white"
                >
                  <span className="font-mono text-xs text-brand-500">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
