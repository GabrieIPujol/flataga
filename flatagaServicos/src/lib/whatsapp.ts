export type Lead = { name: string; phone: string; service: string; message: string }

export function isLeadComplete(lead: Lead): boolean {
  return Object.values(lead).every((v) => v.trim() !== "")
}

export function whatsappUrl(number: string, lead?: Lead): string {
  const base = `https://wa.me/${number}`
  if (!lead) return base
  const text = `Olá! Sou ${lead.name.trim()}, telefone ${lead.phone.trim()}. Tenho interesse em ${lead.service.trim()}: ${lead.message.trim()}`
  return `${base}?text=${encodeURIComponent(text)}`
}
