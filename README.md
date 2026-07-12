# Portfólio — Wellyson Caetano

Portfólio pessoal construído com React 19, TypeScript, Vite, Tailwind CSS v4 e Motion.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (tokens em `src/index.css`)
- Motion (animações) + Lucide (ícones)
- React Router + TanStack Query (dados ao vivo do GitHub)

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  components/     primitivos de UI, seções e shell de layout
  content/        dados tipados (perfil, projetos, stack)
  features/github/ integração com a API pública do GitHub
  pages/          rotas (Home, páginas de case study por projeto)
```

## Antes de publicar

- Trocar o domínio placeholder `wellyson.dev` (usado em `index.html`, `public/robots.txt`, `public/sitemap.xml` e na marca da navbar) pelo domínio real.
- Conferir o e-mail de contato em `src/content/profile.ts`.
