import { useRef } from "react"
import { gsap, useGSAP, MOTION } from "../lib/gsap"
import { asset } from "../lib/asset"
import { contact, nav } from "../content"
import { Icon } from "../components/Icon"

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from(".footer-word", { yPercent: 100, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".footer-word", start: "top 95%" } })
      })
    },
    { scope: root },
  )

  const heading = "font-mono text-xs uppercase tracking-widest text-brand-500"

  return (
    <footer ref={root} className="overflow-hidden bg-ink-950 pt-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-3 md:px-8">
        <div>
          <img src={asset("img/logoFooter.png")} alt="Flataga Serviços" className="size-14 rounded-md bg-white object-contain" />
          <p className="mt-4 max-w-xs text-white/60">Construindo sonhos e reformando histórias.</p>
          <div className="mt-6 flex gap-3">
            <a href={contact.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-white/10 transition hover:border-brand-500 hover:text-brand-400">
              <Icon name="instagram" className="size-5" />
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="grid size-10 place-items-center rounded-full border border-white/10 transition hover:border-brand-500 hover:text-brand-400">
              <Icon name="linkedin" className="size-5" />
            </a>
          </div>
        </div>
        <nav aria-label="Rodapé">
          <h3 className={heading}>Navegação</h3>
          <ul className="mt-4 space-y-2">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-white/70 transition hover:text-brand-400">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className={heading}>Contato</h3>
          <div className="mt-4 space-y-2 text-white/70">
            <p>{contact.phone}</p>
            <p>{contact.email}</p>
            {contact.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-16 overflow-hidden">
        <p aria-hidden="true" className="footer-word text-center font-display text-[22vw] font-bold leading-[0.8] tracking-tight text-brand-500">
          FLATAGA
        </p>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-white/40">© {new Date().getFullYear()} Flataga Serviços. Todos os direitos reservados.</p>
    </footer>
  )
}
