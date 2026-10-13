import { describe, expect, it } from "vitest"
import { isLeadComplete, whatsappUrl } from "./whatsapp"

const lead = {
  name: "  Ana Júlia ",
  phone: "(11) 99999-0000",
  service: "Pintura",
  message: "Orçamento p/ sala & cozinha\nitem #2",
}

describe("whatsappUrl", () => {
  it("sem lead abre só a conversa", () => {
    expect(whatsappUrl("5511944000434")).toBe("https://wa.me/5511944000434")
  })

  it("monta a mensagem e preserva acentos, &, # e quebras de linha", () => {
    const url = new URL(whatsappUrl("5511944000434", lead))
    expect(url.origin + url.pathname).toBe("https://wa.me/5511944000434")
    expect(url.searchParams.get("text")).toBe(
      "Olá! Sou Ana Júlia, telefone (11) 99999-0000. Tenho interesse em Pintura: Orçamento p/ sala & cozinha\nitem #2",
    )
  })
})

describe("isLeadComplete", () => {
  it("aceita lead preenchido", () => {
    expect(isLeadComplete(lead)).toBe(true)
  })

  it("recusa campo só com espaços", () => {
    expect(isLeadComplete({ ...lead, message: "   \n " })).toBe(false)
  })
})
