import type { IconName } from "./components/Icon"

export const contact = {
  whatsapp: "5511944000434",
  phone: "(11) 94400-0434",
  email: "flavio.velosa@gmail.com",
  address: ["Rua Plínio Schmidt", "Interlagos, São Paulo - SP"],
  hours: ["Segunda a Sexta: 8h às 18h", "Sábado: 10h às 14h"],
  instagram: "https://www.instagram.com/flataga",
  linkedin: "https://www.linkedin.com/in/flávio-renato-amaral-gurgel-velosa-26b0ab47",
}

export const nav = [
  { href: "#home", label: "Início" },
  { href: "#about", label: "Sobre" },
  { href: "#services", label: "Serviços" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#testimonials", label: "Depoimentos" },
  { href: "#contact", label: "Contato" },
]

export const about = {
  manifesto:
    "Com anos de experiência no mercado, a Flataga Serviços nasceu do sonho de transformar projetos em realidade. Começamos como uma pequena empresa familiar e hoje somos referência em construção e reforma na região.",
}

export const stats = [
  { value: 5, suffix: "+", label: "anos de experiência" },
  { value: 50, suffix: "+", label: "obras entregues" },
  { value: 100, suffix: "%", label: "compromisso com prazos" },
]

export const values = [
  { title: "Qualidade", description: "Utilizamos apenas materiais de primeira linha e mão de obra especializada" },
  { title: "Inovação", description: "Sempre atualizados com as últimas tendências e tecnologias do mercado" },
  { title: "Pontualidade", description: "Cumprimos rigorosamente os prazos estabelecidos em contrato" },
]

export const services: { title: string; description: string; icon: IconName }[] = [
  { title: "Filiação", icon: "building", description: "Nos filiamos a condomínios de alto e baixo padrão, com nossa equipe a total disposição e preços únicos." },
  { title: "Reformas", icon: "tools", description: "Reformas completas ou parciais, modernizando e valorizando seu imóvel." },
  { title: "Paisagismo", icon: "sprout", description: "Criação e manutenção de jardins e áreas verdes para ambientes únicos." },
  { title: "Pintura", icon: "paint", description: "Pintura residencial e comercial com acabamento profissional e materiais de qualidade." },
  { title: "Instalações Elétricas", icon: "bolt", description: "Instalação e manutenção de sistemas elétricos seguindo todas as normas de segurança." },
  { title: "Instalações Hidráulicas", icon: "drop", description: "Sistemas hidráulicos completos para residências e estabelecimentos comerciais." },
]

export type Category = "construction" | "renovation" | "installations"

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "construction", label: "Construção/Pintura" },
  { id: "renovation", label: "Reforma" },
  { id: "installations", label: "Instalações" },
]

// Para usar foto real: adicione `image: "img/arquivo.png"` (arquivo em public/img/).
export const portfolio: { title: string; place: string; category: Category; image?: string }[] = [
  { place: "Condomínio", title: "Impermeabilização de laje", category: "construction" },
  { place: "Condomínio", title: "Restauração de brinquedos de parquinho", category: "renovation" },
  { place: "Condomínio", title: "Instalação de mural ripado e arandelas", category: "installations" },
  { place: "Residência", title: "Remoção de textura e pintura de muro", category: "construction" },
  { place: "Residência", title: "Restauração de janela", category: "renovation" },
  { place: "Residência", title: "Conserto de instalação hidráulica", category: "installations" },
]

export const testimonials = [
  { name: "Maria Silva", role: "Cliente Residencial", quote: "Excelente trabalho! A equipe da Flataga Serviços superou todas as nossas expectativas. Profissionais competentes e pontuais." },
  { name: "João Santos", role: "Cliente Comercial", quote: "Reforma impecável! Cumpriram todos os prazos e o resultado ficou melhor do que imaginávamos. Recomendo sem hesitar." },
  { name: "Ana Julia", role: "Cliente Residencial", quote: "Qualidade excepcional e atendimento personalizado. A empresa Flataga transformou a minha casa dos sonhos em realidade." },
]
