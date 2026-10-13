# Redesign Flataga (React + Tailwind + GSAP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static HTML landing page with a Vite + React + TS + Tailwind v4 + GSAP redesign ("da planta à obra"), deployed to the same GitHub Pages URL.

**Architecture:** Single-page React app. Each section is one component in `src/sections/`, all copy/data lives in `src/content.ts`, GSAP plugins are registered once in `src/lib/gsap.ts` and every animation runs inside `gsap.matchMedia()` so reduced-motion and mobile get no/lighter motion. Static assets live in `public/`. GitHub Actions builds and deploys to Pages.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind v4 (`@tailwindcss/vite`), GSAP 3.13+ (ScrollTrigger, SplitText, Flip, DrawSVG) + `@gsap/react`, Vitest (only for the WhatsApp helper).

**Spec:** `docs/superpowers/specs/2026-10-13-redesign-react-design.md`

**Working directory:** all paths are relative to `flatagaServicos/` (the git root is its parent `flataga/`) except `.github/` which is at the git root. Branch: `redesign`.

## Global Constraints

- Brand colors from the logo: amber `#D98A04` = `brand-500`, brown `#844A0A` = `wood-600`.
- Fonts: Space Grotesk (`font-display`), Inter (`font-sans`), JetBrains Mono (`font-mono`).
- Vite `base` is `"/flataga/flatagaServicos/"`; any asset path in TS goes through `asset()`.
- Every GSAP animation inside `gsap.matchMedia()` with `MOTION` or `DESKTOP` from `src/lib/gsap.ts`; initial states are set by GSAP (`from`), never by CSS.
- Mobile (< 768px): no pinning, no parallax.
- No dependencies beyond the Tech Stack line. Icons are inline SVG.
- Service names and existing copy kept verbatim (including "Filiação").
- Images: placeholders (`<Photo>` without `image`) until client sends photos.
- WhatsApp number: `5511944000434`.
- Must work 360px → wide desktop with no horizontal page scroll.
- SEO meta from the old `index.html` preserved verbatim (title, description, keywords, author, og:*, google-site-verification).

## Review Focus

1. Form text with accents, `&`, `#`, newlines → must arrive intact in WhatsApp (Task 2 test).
2. Form fields containing only spaces → must be refused with a visible message (Task 2 test + Task 8 manual check).
3. Resizing across 768px or toggling reduced motion → pinned services / marquee must revert cleanly, no stuck transforms or horizontal overflow (Task 5 and Task 7 manual checks).
4. Mobile menu: tapping a link must close the menu AND scroll to the section; `Esc` closes it (Task 3 manual check).
5. Portfolio filter with zero matching items → shows an empty-state message, not a blank area (Task 6).

---

### Task 1: Scaffold Vite + React + TS + Tailwind, move assets

**Files:**
- Delete: `style.css`, `script.js`, `img/teste.png`
- Move: `img/` → `public/img/`, `videos/` → `public/videos/`, `robots.txt` → `public/robots.txt`, `sitemap.xml` → `public/sitemap.xml`
- Replace: `index.html`
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

**Interfaces:**
- Produces: Tailwind tokens `brand-*`, `wood-*`, `ink-*`, `paper`, `font-display|sans|mono`, utility `bg-blueprint`; `App` default export.

- [ ] **Step 1: Move/delete old files**

```bash
mkdir -p public
git mv img public/img
git mv videos public/videos
git mv robots.txt public/robots.txt
git mv sitemap.xml public/sitemap.xml
git rm -q style.css script.js public/img/teste.png
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "flataga-servicos",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install react react-dom gsap @gsap/react
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite vitest
```
Expected: `package-lock.json` created, `gsap` version ≥ 3.13.0 (`npm ls gsap`). SplitText/DrawSVG ship in the free `gsap` package from 3.13.

- [ ] **Step 4: Create config files**

`vite.config.ts`:
```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  base: "/flataga/flatagaServicos/",
  plugins: [react(), tailwindcss()],
})
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

`.gitignore`:
```
node_modules
dist
```

- [ ] **Step 5: Replace `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flataga Serviços - Construindo Sonhos, Reformando Histórias</title>
    <meta name="description" content="A flataga serviços tem como objetivo transformar ideias em realidade com qualidade, inovação e pontualidade." />
    <meta name="keywords" content="Flataga, Flataga Serviços, Flávio Renato Amaral Gurgel Velosa, Flávio Renato Amaral Gurgel, Flávio Renato Amaral, Flávio Renato, Flávio, Renato, Amaral, Gurgel, Velosa, Reforma, Serviços, Construção, Obra, Reforma de Casa, Construção de Casa, Orçamento" />
    <meta name="author" content="Gabriel Velosa" />
    <meta name="theme-color" content="#0e0a06" />
    <meta property="og:title" content="Flataga Serviços" />
    <meta property="og:description" content="A flataga serviços tem como objetivo transformar ideias em realidade com qualidade, inovação e pontualidade." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://gabrieipujol.github.io/flataga/flatagaServicos/" />
    <meta property="og:image" content="https://gabrieipujol.github.io/flataga/flatagaServicos/img/logo.png" />
    <meta name="thumbnail" content="https://gabrieipujol.github.io/flataga/flatagaServicos/img/logo.png" />
    <meta name="google-site-verification" content="6-VSuIdpbb8K80MK2lY_wPgVUhjZWWHuaiWD7LzUhSE" />
    <link rel="icon" href="/img/icon.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-brand-50: #fef7e6;
  --color-brand-100: #fdebc0;
  --color-brand-200: #fbd889;
  --color-brand-300: #f6bf4c;
  --color-brand-400: #eea41f;
  --color-brand-500: #d98a04;
  --color-brand-600: #b56c03;
  --color-brand-700: #8f5207;
  --color-brand-800: #6f400b;
  --color-brand-900: #5a350d;
  --color-brand-950: #331c04;

  --color-wood-50: #faf4ec;
  --color-wood-100: #f1e2cc;
  --color-wood-200: #e2c398;
  --color-wood-300: #cf9e5e;
  --color-wood-400: #b97c35;
  --color-wood-500: #a1631d;
  --color-wood-600: #844a0a;
  --color-wood-700: #6b3c0b;
  --color-wood-800: #57310d;
  --color-wood-900: #48290e;
  --color-wood-950: #2a1605;

  --color-ink-700: #33281c;
  --color-ink-800: #221a12;
  --color-ink-900: #17110b;
  --color-ink-950: #0e0a06;

  --color-paper: #f6f1e9;
}

@utility bg-blueprint {
  background-image:
    linear-gradient(to right, rgb(217 138 4 / 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(217 138 4 / 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
}

@layer base {
  html {
    scroll-padding-top: 4rem;
  }
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
  body {
    background: var(--color-ink-950);
    color: white;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
```

- [ ] **Step 7: Create `src/main.tsx` and `src/App.tsx`**

`src/main.tsx`:
```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`src/App.tsx`:
```tsx
export default function App() {
  return <main className="bg-blueprint grid min-h-svh place-items-center font-display text-4xl text-brand-500">Flataga</main>
}
```

- [ ] **Step 8: Build and verify base path**

Run: `npm run build && grep -o '/flataga/flatagaServicos/img/icon.png' dist/index.html && ls dist/img/logo.png dist/videos/videoHero.mp4 dist/robots.txt`
Expected: build succeeds, grep prints the prefixed icon path, all 4 files listed.

- [ ] **Step 9: Commit**

```bash
git add -A .
git commit -m "Scaffold Vite + React + TS + Tailwind e move assets para public/"
```

---

### Task 2: Shared lib, content and UI primitives (WhatsApp helper via TDD)

**Files:**
- Create: `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`, `src/lib/gsap.ts`, `src/lib/asset.ts`, `src/content.ts`, `src/components/Icon.tsx`, `src/components/Photo.tsx`, `src/components/SectionLabel.tsx`

**Interfaces:**
- Produces:
  - `type Lead = { name: string; phone: string; service: string; message: string }`
  - `whatsappUrl(number: string, lead?: Lead): string`
  - `isLeadComplete(lead: Lead): boolean`
  - `gsap, ScrollTrigger, SplitText, Flip, useGSAP` and `MOTION`, `DESKTOP` media-query strings from `src/lib/gsap.ts`
  - `asset(path: string): string`
  - From `content.ts`: `contact`, `nav`, `about`, `stats`, `values`, `services`, `categories`, `portfolio`, `testimonials`, type `Category`
  - `<Icon name: IconName className?: string />`, `type IconName`
  - `<Photo image?: string alt: string className?: string />`
  - `<SectionLabel index: string>{children}</SectionLabel>`

- [ ] **Step 1: Write the failing test** — `src/lib/whatsapp.test.ts`

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./whatsapp`.

- [ ] **Step 3: Implement `src/lib/whatsapp.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: 4 passed.

- [ ] **Step 5: Create `src/lib/gsap.ts` and `src/lib/asset.ts`**

`src/lib/gsap.ts`:
```ts
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { Flip } from "gsap/Flip"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, DrawSVGPlugin)

export const MOTION = "(prefers-reduced-motion: no-preference)"
export const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP }
```

`src/lib/asset.ts`:
```ts
export const asset = (path: string) => import.meta.env.BASE_URL + path
```

- [ ] **Step 6: Create `src/components/Icon.tsx`**

```tsx
import type { ReactNode } from "react"

const paths = {
  building: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></>,
  tools: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  sprout: <><path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" /></>,
  paint: <><rect x="2" y="2" width="16" height="6" rx="2" /><path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="8" y="16" width="4" height="6" rx="1" /></>,
  bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  drop: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  whatsapp: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
  instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" /></>,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

export function Icon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {paths[name]}
    </svg>
  )
}
```

- [ ] **Step 7: Create `src/components/Photo.tsx` and `src/components/SectionLabel.tsx`**

`src/components/Photo.tsx`:
```tsx
import { asset } from "../lib/asset"

// Sem `image` mostra placeholder de planta; ao chegar a foto, basta preencher `image` em content.ts.
export function Photo({ image, alt, className = "" }: { image?: string; alt: string; className?: string }) {
  if (image) return <img src={asset(image)} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  return (
    <div role="img" aria-label={alt} className={`bg-blueprint relative grid place-items-center bg-ink-800 ${className}`}>
      <svg className="absolute inset-0 size-full text-brand-500/20" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0L100 100M100 0L0 100" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative font-mono text-xs uppercase tracking-widest text-brand-400/70">[ foto em breve ]</span>
    </div>
  )
}
```

`src/components/SectionLabel.tsx`:
```tsx
import type { ReactNode } from "react"

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-500">
      {index} / {children}
    </p>
  )
}
```

- [ ] **Step 8: Create `src/content.ts`**

```ts
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

// PROVISÓRIO: números a confirmar com o cliente antes do merge na main.
export const stats = [
  { value: 10, suffix: "+", label: "anos de experiência" },
  { value: 300, suffix: "+", label: "obras entregues" },
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
```

- [ ] **Step 9: Type-check and test**

Run: `npx tsc && npm test`
Expected: no type errors, 4 tests pass.

- [ ] **Step 10: Commit**

```bash
git add src
git commit -m "Conteúdo, helper do WhatsApp (com testes), GSAP e componentes base"
```

---

### Task 3: Header, Hero and floating WhatsApp button

**Files:**
- Create: `src/sections/Header.tsx`, `src/sections/Hero.tsx`
- Replace: `src/App.tsx`

**Interfaces:**
- Consumes: `gsap, ScrollTrigger, SplitText, useGSAP, MOTION, DESKTOP` (`lib/gsap`), `asset`, `whatsappUrl`, `contact`, `nav`, `Icon`
- Produces: `Header()`, `Hero()`; `App` renders `<Header/>`, `<main>` with sections, floating button. Later tasks add one import + one element inside `<main>` (or `Footer` after it).

- [ ] **Step 1: Create `src/sections/Header.tsx`**

The mobile menu is a sibling of `<header>` (not a child) because the header gets a transform when hiding, which would trap a `fixed` child.

```tsx
import { useEffect, useRef, useState } from "react"
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap"
import { asset } from "../lib/asset"
import { nav } from "../content"
import { Icon } from "../components/Icon"

export function Header() {
  const root = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
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
          <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Abrir menu" className="text-white lg:hidden">
            <Icon name="menu" />
          </button>
        </nav>
      </header>
      {open && (
        <div ref={menu} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col bg-ink-950 px-4 py-4 lg:hidden">
          <div className="flex h-8 justify-end">
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="text-white">
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
```

- [ ] **Step 2: Create `src/sections/Hero.tsx`**

```tsx
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
```

- [ ] **Step 3: Replace `src/App.tsx`**

```tsx
import { useEffect } from "react"
import { ScrollTrigger } from "./lib/gsap"
import { whatsappUrl } from "./lib/whatsapp"
import { contact } from "./content"
import { Icon } from "./components/Icon"
import { Header } from "./sections/Header"
import { Hero } from "./sections/Hero"

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
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 5: Manual check** — `npm run dev`, open `http://localhost:5173/flataga/flatagaServicos/`

- Desktop 1440px: title rises word by word, amber line draws, buttons fade in; scrolling zooms video and fades title; header turns frosted after scrolling and hides on scroll down / returns on scroll up.
- 375px: menu button opens fullscreen menu with staggered links; `Esc` closes; tapping "Contato" closes the menu (section may not exist yet — no error in console).
- DevTools → Rendering → `prefers-reduced-motion: reduce`, reload: everything visible, nothing animates.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "Header com menu mobile e Hero com animações GSAP"
```

---

### Task 4: About section

**Files:**
- Create: `src/sections/About.tsx`
- Modify: `src/App.tsx` (import `About`, render `<About />` after `<Hero />`)

**Interfaces:**
- Consumes: `gsap, SplitText, useGSAP, MOTION`, `about, stats, values`, `SectionLabel`

- [ ] **Step 1: Create `src/sections/About.tsx`**

```tsx
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
```

- [ ] **Step 2: Add to `src/App.tsx`**

Add `import { About } from "./sections/About"` and render `<About />` right after `<Hero />`.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Manual check**

Scrolling through About lights the manifesto word by word; numbers count up once when visible; value cards rise in. With reduced motion: full-opacity text and final numbers.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "Seção Sobre com manifesto animado e contadores"
```

---

### Task 5: Services (pinned horizontal scroll on desktop)

**Files:**
- Create: `src/sections/Services.tsx`
- Modify: `src/App.tsx` (import `Services`, render after `<About />`)

**Interfaces:**
- Consumes: `gsap, useGSAP, MOTION, DESKTOP`, `services`, `Icon`, `SectionLabel`

The horizontal layout classes are `md:motion-safe:*` so they only apply when the `DESKTOP` pin is active; otherwise it's a normal grid.

- [ ] **Step 1: Create `src/sections/Services.tsx`**

```tsx
import { useRef } from "react"
import { gsap, useGSAP, MOTION, DESKTOP } from "../lib/gsap"
import { services } from "../content"
import { Icon } from "../components/Icon"
import { SectionLabel } from "../components/SectionLabel"

const pad = (n: number) => String(n).padStart(2, "0")

export function Services() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLUListElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP, () => {
        const el = track.current!
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        })
      })
      mm.add(MOTION, () => {
        gsap.from(".service-card", { y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: track.current, start: "top 85%" } })
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="services"
      className="overflow-hidden bg-ink-950 py-24 text-white md:motion-safe:flex md:motion-safe:h-svh md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:py-0"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionLabel index="02">Serviços</SectionLabel>
        <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">Soluções completas para sua construção e reforma</h2>
      </div>
      <ul ref={track} className="mt-14 grid gap-6 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3 md:motion-safe:flex md:motion-safe:w-max">
        {services.map((s, i) => (
          <li
            key={s.title}
            className="service-card bg-blueprint group flex flex-col rounded-2xl border border-white/10 bg-ink-900 p-8 transition-colors hover:border-brand-500/60 md:motion-safe:w-96"
          >
            <span className="font-mono text-xs text-brand-500">
              {pad(i + 1)} / {pad(services.length)}
            </span>
            <Icon name={s.icon} className="mt-10 size-10 text-brand-500 transition-transform group-hover:scale-110" />
            <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
            <p className="mt-3 text-white/60">{s.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 2: Add to `src/App.tsx`**

Add `import { Services } from "./sections/Services"` and render `<Services />` after `<About />`.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Manual check (Review Focus #3)**

- 1440px: section pins and the 6 cards slide horizontally while scrolling, then the page continues.
- Drag window from 1440px to 375px and back: below 768px cards stack vertically, no stuck `transform` on the `<ul>` (inspect it), no horizontal page scrollbar; back above 768px the pin works again.
- Reduced motion at 1440px: 2–3 column grid, no pin.
- Clicking "Ver serviços" in the hero lands at the section start.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "Seção Serviços com scroll horizontal pinado no desktop"
```

---

### Task 6: Portfolio (Flip filters + clip-path reveal)

**Files:**
- Create: `src/sections/Portfolio.tsx`
- Modify: `src/App.tsx` (import `Portfolio`, render after `<Services />`)

**Interfaces:**
- Consumes: `gsap, Flip, useGSAP, MOTION`, `portfolio, categories, Category`, `Photo`, `SectionLabel`

All items stay in the DOM and filtered-out ones get `hidden`, so Flip can animate both entering and leaving items.

- [ ] **Step 1: Create `src/sections/Portfolio.tsx`**

```tsx
import { useRef, useState } from "react"
import { gsap, Flip, useGSAP, MOTION } from "../lib/gsap"
import { categories, portfolio, type Category } from "../content"
import { Photo } from "../components/Photo"
import { SectionLabel } from "../components/SectionLabel"

type Filter = Category | "all"

export function Portfolio() {
  const root = useRef<HTMLElement>(null)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const matches = (c: Category) => filter === "all" || c === filter
  const visible = portfolio.filter((p) => matches(p.category)).length

  const choose = (id: Filter) => {
    if (id === filter) return
    flipState.current = Flip.getState(".portfolio-item")
    setFilter(id)
  }

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from(".portfolio-media", { clipPath: "inset(100% 0 0 0)", duration: 1.1, ease: "power4.inOut", stagger: 0.12, scrollTrigger: { trigger: ".portfolio-grid", start: "top 80%" } })
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      const state = flipState.current
      flipState.current = null
      if (!state || !window.matchMedia(MOTION).matches) return
      Flip.from(state, {
        targets: ".portfolio-item",
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
      })
    },
    { dependencies: [filter], scope: root },
  )

  return (
    <section ref={root} id="portfolio" className="bg-paper py-24 text-ink-950 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel index="03">Portfólio</SectionLabel>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight md:text-6xl">Trabalhos realizados</h2>
          <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => choose(c.id)}
                className="rounded-full border border-ink-950/15 px-4 py-2 text-sm transition-colors hover:border-brand-500 aria-pressed:border-brand-500 aria-pressed:bg-brand-500"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="portfolio-grid mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p) => (
            <li key={p.title} className={`portfolio-item group ${matches(p.category) ? "" : "hidden"}`}>
              <div className="portfolio-media overflow-hidden rounded-2xl">
                <Photo image={p.image} alt={`${p.place} - ${p.title}`} className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-wood-600">
                {p.place} · {categories.find((c) => c.id === p.category)!.label}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">{p.title}</h3>
            </li>
          ))}
        </ul>
        {visible === 0 && <p className="mt-12 text-ink-950/60">Nenhum trabalho nesta categoria ainda.</p>}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to `src/App.tsx`**

Add `import { Portfolio } from "./sections/Portfolio"` and render `<Portfolio />` after `<Services />`.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Manual check (Review Focus #5)**

- Placeholders show the blueprint pattern with "[ foto em breve ]" in 4:3.
- Clicking each filter animates items moving/fading; active button is amber; "Todos" restores all 6.
- Temporarily change one item's category in `content.ts` so a filter has zero matches → "Nenhum trabalho nesta categoria ainda." appears; revert the change.
- Reduced motion: filters switch instantly, images visible without reveal.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "Seção Portfólio com filtros animados (Flip) e reveal das imagens"
```

---

### Task 7: Testimonials (marquee)

**Files:**
- Create: `src/sections/Testimonials.tsx`
- Modify: `src/App.tsx` (import `Testimonials`, render after `<Portfolio />`)

**Interfaces:**
- Consumes: `gsap, useGSAP, MOTION`, `testimonials`, `SectionLabel`

The list is rendered twice for a seamless `xPercent: -50` loop; the copy is `aria-hidden` and hidden under reduced motion, where the layout falls back to a grid.

- [ ] **Step 1: Create `src/sections/Testimonials.tsx`**

```tsx
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
```

- [ ] **Step 2: Add to `src/App.tsx`**

Add `import { Testimonials } from "./sections/Testimonials"` and render `<Testimonials />` after `<Portfolio />`.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Manual check (Review Focus #3)**

- Cards scroll continuously with no visible jump at the loop point; hovering pauses.
- 375px: no horizontal page scrollbar (section has `overflow-hidden`).
- Reduced motion: 3 cards in a static grid (1 column on mobile), duplicates not shown.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "Seção Depoimentos com marquee infinito"
```

---

### Task 8: Contact form + Footer

**Files:**
- Create: `src/sections/Contact.tsx`, `src/sections/Footer.tsx`
- Modify: `src/App.tsx` (render `<Contact />` after `<Testimonials />`; render `<Footer />` after `</main>`)

**Interfaces:**
- Consumes: `whatsappUrl, isLeadComplete, Lead`, `contact, services, nav`, `asset`, `Icon`, `SectionLabel`, `gsap, useGSAP, MOTION`

- [ ] **Step 1: Create `src/sections/Contact.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/sections/Footer.tsx`**

```tsx
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
        <p aria-hidden="true" className="footer-word text-center font-display text-[22vw] font-bold leading-[0.8] tracking-tighter text-brand-500">
          FLATAGA
        </p>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-white/40">© {new Date().getFullYear()} Flataga Serviços. Todos os direitos reservados.</p>
    </footer>
  )
}
```

- [ ] **Step 3: Update `src/App.tsx`**

Add `import { Contact } from "./sections/Contact"` and `import { Footer } from "./sections/Footer"`; render `<Contact />` after `<Testimonials />` inside `<main>`, and `<Footer />` right after `</main>`.

- [ ] **Step 4: Build and test**

Run: `npm run build && npm test`
Expected: no errors, 4 tests pass.

- [ ] **Step 5: Manual check (Review Focus #1, #2, #4)**

- Submit empty → browser native "required" prompts. Fill every field with spaces only → "Preencha todos os campos." appears.
- Fill `Ana Júlia`, `(11) 99999-0000`, `Pintura`, message `sala & cozinha` + newline + `#2` → new tab opens `wa.me/5511944000434?text=...` showing the text intact.
- Focusing a field draws the amber underline.
- 375px: open menu, tap "Contato" → menu closes and page scrolls to the form.
- Footer "FLATAGA" rises when reaching the bottom; no horizontal scroll at 375px.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "Seção Contato (formulário → WhatsApp) e Footer"
```

---

### Task 9: Deploy workflow, robots/sitemap, final verification

**Files:**
- Create: `../.github/workflows/deploy.yml` (git root)
- Modify: `public/robots.txt`

- [ ] **Step 1: Fix `public/robots.txt`** (sitemap URL pointed to a non-existent `/public/` path)

```
User-agent: *
Allow: /

Sitemap: https://gabrieipujol.github.io/flataga/flatagaServicos/sitemap.xml
```

- [ ] **Step 2: Create `../.github/workflows/deploy.yml`**

The artifact keeps the `flatagaServicos/` subfolder so the public URL stays `/flataga/flatagaServicos/`.

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: flatagaServicos
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: flatagaServicos/package-lock.json
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: mkdir -p ../_site && mv dist ../_site/flatagaServicos
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}flatagaServicos/
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Full verification**

Run: `npm test && npm run build && npx vite preview`
Open `http://localhost:4173/flataga/flatagaServicos/` and check:
- 375px and 1440px: every section renders, no horizontal page scroll, no console errors.
- Reduced motion on: all content visible, no pin, no marquee.
- `view-source:` shows title, description, og:* and google-site-verification.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt ../.github/workflows/deploy.yml
git commit -m "Workflow de deploy no GitHub Pages e correção do robots.txt"
```

- [ ] **Step 5: Hand off manual steps to the repo owner (do NOT merge)**

Before merging `redesign` into `main`, the owner must:
1. Confirm/replace the provisional `stats` numbers in `src/content.ts`.
2. GitHub → repo `flataga` → Settings → Pages → Source: **GitHub Actions**.
After merge, the workflow publishes to `https://gabrieipujol.github.io/flataga/flatagaServicos/`.
