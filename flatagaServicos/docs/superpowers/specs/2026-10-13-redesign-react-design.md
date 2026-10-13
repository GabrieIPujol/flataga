# Redesign Flataga Serviços — React + Tailwind + GSAP

Data: 2026-10-13 · Branch: `redesign`

## Objetivo

Redesign completo da landing page da Flataga Serviços, migrando de HTML/CSS/JS puro
para Vite + React + TypeScript + Tailwind, com animações GSAP. O site deve passar um ar
**tecnológico e profissional** e surpreender o visitante durante a navegação.

Motivação da stack: é a stack com que o dono do projeto trabalha hoje.

## Critérios de sucesso

- Todas as seções atuais existem na versão nova (Home, Sobre, Serviços, Portfólio,
  Depoimentos, Contato, Footer) com conteúdo atual reaproveitado.
- Conteúdo inteiro editável em um único arquivo (`src/content.ts`).
- Formulário de contato envia os dados preenchidos para o WhatsApp.
- `prefers-reduced-motion` desliga as animações; nada fica invisível sem JS/animação.
- Layout funciona de 360px a desktop largo, sem scroll horizontal.
- `npm run build` gera site estático; SEO (title, meta, OG, robots, sitemap,
  verificação do Google) preservado.

## Fora de escopo

- Logo novo (mantém `img/logo.png` / `img/logoFooter.png`).
- Backend, CMS, múltiplas páginas, roteamento.
- Fotos finais — usar placeholders com proporções finais até o cliente enviar.

## Stack

- Vite + React + TypeScript
- Tailwind v4 via `@tailwindcss/vite` (sem `tailwind.config`)
- GSAP + `@gsap/react` (`useGSAP`), plugins: ScrollTrigger, SplitText, Flip, DrawSVG
- Fontes Google: Space Grotesk (títulos), Inter (texto), JetBrains Mono (rótulos)
- Ícones: SVG inline. Nenhuma outra dependência.

## Estrutura

```
index.html            title, meta, Open Graph, meta google-site-verification (estático)
public/               robots.txt, sitemap.xml, video, logos, imagens
src/
  main.tsx, App.tsx
  index.css           Tailwind + tokens @theme
  content.ts          serviços, portfólio, depoimentos, números, contatos
  sections/           Header, Hero, About, Services, Portfolio,
                      Testimonials, Contact, Footer
```

Arquivos antigos (`style.css`, `script.js`, `index.html` antigo, `img/`, `videos/`)
são removidos ou movidos para `public/`; a versão antiga fica na `main`.

## Identidade visual

- Cores do logo: âmbar `#D98A04` (`brand`), marrom `#844A0A` (`wood`), com escalas
  50–950 geradas a partir delas.
- Base escura quente (quase preto amarronzado) com seções claras alternadas.
- Rótulos técnicos em mono: `01 / SERVIÇOS`, `[ 12+ ANOS ]`.
- Grid de "planta baixa" sutil como textura de fundo.
- Conceito: **"da planta à obra"** — elementos de desenho técnico que se desenham
  conforme o scroll.

## Seções e animações

| Seção | Visual | Animação |
|---|---|---|
| Header | Transparente no topo, vidro fosco ao rolar | Esconde ao descer, volta ao subir; menu mobile fullscreen com links em stagger |
| Hero | Vídeo atual escurecido + grid de planta | Título sobe palavra a palavra (SplitText), linha âmbar desenhada (DrawSVG); no scroll, zoom no vídeo e parallax do título. CTAs: WhatsApp, "Ver serviços" |
| Sobre | Texto-manifesto grande + valores (Qualidade, Inovação, Pontualidade) | Palavras "acendem" com scrub; contadores animados |
| Serviços | Cards numerados como planta | Desktop: seção pinada com scroll horizontal. Mobile: lista vertical |
| Portfólio | Grid com filtros por categoria | Reordenação com Flip; reveal das imagens por clip-path |
| Depoimentos | Cards em faixa | Marquee infinito, pausa no hover |
| Contato | Formulário + informações | Linha âmbar no foco; envio monta mensagem e abre `wa.me/5511944000434?text=...` |
| Footer | Wordmark "FLATAGA" gigante | Reveal ao chegar no fim |

## Regras de animação

- Toda animação dentro de `gsap.matchMedia()`:
  - `(prefers-reduced-motion: reduce)` → sem animação.
  - Mobile (`max-width: 767px`) → sem pin horizontal e sem parallax pesado.
- Conteúdo renderizado no HTML; animação só revela (estado inicial setado pelo GSAP,
  não por CSS), então nada some se o JS falhar.
- Cleanup via `useGSAP` (escopo por seção).

## Formulário de contato

Campos: nome, telefone, serviço (select com a lista de `content.ts`), mensagem.
Validação nativa (`required`, `type="tel"`). Ao enviar: monta texto
`Olá! Sou {nome} ({telefone}). Tenho interesse em {serviço}: {mensagem}` e abre o
WhatsApp em nova aba. Sem backend.

## Conteúdo

- Reaproveita textos atuais; cliente enviará conteúdo novo depois.
- Placeholders de imagem com proporção final (ex.: portfólio 4:3) até chegarem as fotos.
- Pendente: confirmar se o serviço "Filiação" é "Fundação".

## Verificação

- `npm run build` sem erros e `tsc` sem erros.
- Conferência visual no navegador em 375px e 1440px, com e sem reduced-motion.
- Formulário gera o link do WhatsApp correto.
