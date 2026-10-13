import { useState, type FormEvent } from "react"
import { isLeadComplete, whatsappUrl, type Lead } from "../lib/whatsapp"
import { contact, services } from "../content"
import { Icon } from "../components/Icon"
import { SectionLabel } from "../components/SectionLabel"

const input = "peer w-full border-b border-white/15 bg-transparent py-3 text-white placeholder:text-white/30 focus:outline-none"
const label = "font-mono text-xs uppercase tracking-widest text-white/50"

function Line() {
  return <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brand-500 transition-transform duration-500 peer-focus:scale-x-100" />
}

export function Contact() {
  const [error, setError] = useState("")

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const lead: Lead = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? ""),
    }
    if (!isLeadComplete(lead)) {
      setError("Preencha todos os campos.")
      return
    }
    setError("")
    window.open(whatsappUrl(contact.whatsapp, lead), "_blank", "noopener")
  }

  const info = [
    { icon: "pin" as const, title: "Endereço", lines: contact.address },
    { icon: "phone" as const, title: "Telefone", lines: [contact.phone], href: `tel:+${contact.whatsapp}` },
    { icon: "mail" as const, title: "E-mail", lines: [contact.email], href: `mailto:${contact.email}` },
    { icon: "clock" as const, title: "Horário", lines: contact.hours },
  ]

  return (
    <section id="contact" className="bg-ink-900 py-24 text-white md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 md:px-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionLabel index="05">Contato</SectionLabel>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl">Solicite seu orçamento</h2>
          <form onSubmit={onSubmit} className="mt-12 grid gap-8 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Nome</span>
              <span className="relative block">
                <input name="name" required autoComplete="name" placeholder="Seu nome" className={input} />
                <Line />
              </span>
            </label>
            <label className="block">
              <span className={label}>Telefone</span>
              <span className="relative block">
                <input name="phone" type="tel" required autoComplete="tel" placeholder="(11) 90000-0000" className={input} />
                <Line />
              </span>
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Serviço</span>
              <span className="relative block">
                <select name="service" required defaultValue="" className={`${input} [&>option]:bg-ink-900`}>
                  <option value="" disabled>Selecione</option>
                  {services.map((s) => (
                    <option key={s.title}>{s.title}</option>
                  ))}
                  <option>Outro</option>
                </select>
                <Line />
              </span>
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Mensagem</span>
              <span className="relative block">
                <textarea name="message" required rows={4} placeholder="Conte um pouco sobre o que precisa" className={`${input} resize-none`} />
                <Line />
              </span>
            </label>
            {error && (
              <p role="alert" className="text-sm text-red-400 sm:col-span-2">
                {error}
              </p>
            )}
            <button type="submit" className="inline-flex items-center gap-2 justify-self-start rounded-full bg-brand-500 px-7 py-3.5 font-medium text-ink-950 transition hover:bg-brand-400 sm:col-span-2">
              <Icon name="whatsapp" className="size-5" />
              Enviar pelo WhatsApp
            </button>
          </form>
        </div>

        <ul className="space-y-8 lg:pt-28">
          {info.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 text-brand-500">
                <Icon name={item.icon} className="size-5" />
              </span>
              <div>
                <h3 className={label}>{item.title}</h3>
                {item.lines.map((line) =>
                  item.href ? (
                    <a key={line} href={item.href} className="block text-white/80 transition hover:text-brand-400">
                      {line}
                    </a>
                  ) : (
                    <p key={line} className="text-white/80">
                      {line}
                    </p>
                  ),
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
