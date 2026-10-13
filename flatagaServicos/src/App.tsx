import { useEffect } from "react"
import { ScrollTrigger } from "./lib/gsap"
import { whatsappUrl } from "./lib/whatsapp"
import { contact } from "./content"
import { Icon } from "./components/Icon"
import { Header } from "./sections/Header"
import { Hero } from "./sections/Hero"
import { About } from "./sections/About"

export default function App() {
  // Fontes mudam alturas; recalcula posições de pin/scroll depois que carregam.
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
      </main>
      <a
        href={whatsappUrl(contact.whatsapp)}
        target="_blank"
        rel="noopener"
        aria-label="Conversar no WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-brand-500 text-ink-950 shadow-lg shadow-black/30 transition hover:scale-105"
      >
        <Icon name="whatsapp" />
      </a>
    </>
  )
}
