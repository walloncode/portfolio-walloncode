import {
  Code2,
  Layers,
  ShieldCheck,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface SkillGroup {
  icon: LucideIcon;
  title: string;
  /** short line under the title */
  caption: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    icon: Code2,
    title: "Técnicas",
    caption: "Stack do dia a dia",
    items: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "Tailwind CSS"],
  },
  {
    icon: Layers,
    title: "Especialidades",
    caption: "Onde entrego valor",
    items: ["SaaS multi-tenant", "Automação com IA", "APIs REST", "Offline-first", "Integrações"],
  },
  {
    icon: ShieldCheck,
    title: "Segurança & Arquitetura",
    caption: "No escopo inicial",
    items: [
      "Isolamento de dados",
      "Proteção brute-force",
      "Security headers",
      "Arquitetura auditável",
    ],
  },
  {
    icon: Users,
    title: "Soft skills",
    caption: "Como eu colaboro",
    items: ["Comunicação", "Trabalho em equipe", "Gestão de tempo", "Pensamento crítico"],
  },
  {
    icon: Sparkles,
    title: "Interesses",
    caption: "O que me move",
    items: ["Sistemas distribuídos", "IA aplicada", "Design de produto", "Performance web"],
  },
];
