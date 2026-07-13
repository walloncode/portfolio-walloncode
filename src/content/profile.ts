export const profile = {
  name: "Wellyson Caetano",
  handle: "walloncode",
  role: "Software Engineer",
  location: "Ariquemes, Rondônia — Brasil",
  education: "Análise e Desenvolvimento de Sistemas — IFRO",
  englishLevel: "Inglês B2 — em prática contínua",
  email: "wellysoncaetano@gmail.com",
  githubUrl: "https://github.com/walloncode",
  agencyUrl: "https://wkcode.com.br",

  heroTagline:
    "Projeto e construo sistemas de ponta a ponta — de agentes de automação a plataformas multi-tenant — priorizando decisões de arquitetura auditáveis sobre soluções mágicas.",

  aboutParagraphs: [
    "Wellyson desenvolve software full-stack com foco em sistemas que carregam decisão de arquitetura real: um SaaS multi-tenant para barbearias com isolamento de dados e proteção contra brute-force, um agente de automação que decide quando confiar em regras fixas e quando escalar para IA, uma plataforma de risco geoespacial construída em 48 horas de hackathon, e uma agência própria — WKCODE — que já entregou sites em produção para clientes reais, como a Kiuseven Energia Solar.",
    "Cursa Análise e Desenvolvimento de Sistemas no IFRO, Campus Ariquemes, e mantém uma prática consistente nos próprios projetos: separar o que precisa ser determinístico do que realmente se beneficia de IA — e nunca confundir os dois.",
  ],

  atAGlance: [
    { label: "Localização", value: "Ariquemes, RO — Brasil" },
    { label: "Formação", value: "ADS — IFRO Ariquemes" },
    { label: "Idioma", value: "Inglês B2" },
  ],

  socialLinks: [
    { label: "GitHub", url: "https://github.com/walloncode" },
    { label: "WKCODE", url: "https://wkcode.com.br" },
  ],

  contactSocials: [
    {
      label: "Instagram",
      handle: "@real.wellc",
      url: "https://instagram.com/real.wellc",
      icon: "instagram",
    },
    {
      label: "WhatsApp",
      handle: "+55 69 99390-0044",
      url: "https://wa.me/5569993900044",
      icon: "whatsapp",
    },
    {
      label: "GitHub",
      handle: "walloncode",
      url: "https://github.com/walloncode",
      icon: "github",
    },
    {
      label: "Facebook",
      handle: "Wellyson da Silva Caetano",
      url: "https://www.facebook.com/search/top?q=Wellyson%20da%20Silva%20Caetano",
      icon: "facebook",
    },
    {
      label: "YouTube",
      handle: "@walloncode",
      url: "https://www.youtube.com/@walloncode",
      icon: "youtube",
    },
    {
      label: "Discord",
      handle: "slowinseven",
      copy: "slowinseven",
      icon: "discord",
    },
  ],
} as const;
