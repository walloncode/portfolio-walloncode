import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  Languages,
  LayoutTemplate,
  Server,
  Bot,
  Rocket,
} from "lucide-react";

export interface JourneyNode {
  id: number;
  title: string;
  /** short qualifier shown in the header — replaces the sci-fi "energy %" */
  meta: string;
  category: string;
  content: string;
  tags: string[];
  icon: LucideIcon;
  relatedIds: number[];
}

export const journey: JourneyNode[] = [
  {
    id: 1,
    title: "Formação",
    meta: "IFRO · ADS",
    category: "Base",
    content:
      "Técnico em Informática integrado ao Ensino Médio no IFRO Ariquemes (2023–2025) e, na sequência, Análise e Desenvolvimento de Sistemas no mesmo campus. Base sólida em lógica, estruturas de dados, banco de dados e engenharia de software.",
    tags: ["Fundamentos", "Banco de dados", "Engenharia de software"],
    icon: GraduationCap,
    relatedIds: [2, 3],
  },
  {
    id: 2,
    title: "Inglês",
    meta: "B2",
    category: "Idioma",
    content:
      "Nível B2 em prática contínua — leitura de documentação técnica, código e conversação. Acesso direto à fonte, sem depender de tradução, mirando uma carreira remota e internacional.",
    tags: ["Leitura técnica", "Conversação", "Carreira internacional"],
    icon: Languages,
    relatedIds: [1],
  },
  {
    id: 3,
    title: "Front-end",
    meta: "Interface",
    category: "Craft",
    content:
      "React, Next.js, TypeScript e Tailwind. Foco em interfaces limpas, acessíveis e rápidas — do design system à performance.",
    tags: ["React", "TypeScript", "Tailwind"],
    icon: LayoutTemplate,
    relatedIds: [1, 4, 6],
  },
  {
    id: 4,
    title: "Back-end",
    meta: "Sistemas",
    category: "Craft",
    content:
      "Python (Flask/FastAPI) e Node (NestJS). APIs REST, arquitetura multi-tenant e segurança tratada como parte do escopo, não adendo.",
    tags: ["FastAPI", "NestJS", "PostgreSQL"],
    icon: Server,
    relatedIds: [3, 5],
  },
  {
    id: 5,
    title: "Automação & IA",
    meta: "Engenharia",
    category: "Craft",
    content:
      "Agentes de automação determinísticos com IA sob gate de confiança, visão computacional e loops de decisão auditáveis — regra primeiro, IA só nas exceções.",
    tags: ["Playwright", "Pydantic", "IA aplicada"],
    icon: Bot,
    relatedIds: [4, 6],
  },
  {
    id: 6,
    title: "Produto",
    meta: "Em produção",
    category: "Entrega",
    content:
      "WKCODE — agência própria com produtos reais no ar: SaaS, plataformas de risco geoespacial e sistemas de gestão para clientes de verdade.",
    tags: ["WKCODE", "Clientes reais"],
    icon: Rocket,
    relatedIds: [3, 5],
  },
];
