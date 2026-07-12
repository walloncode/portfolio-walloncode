import { BookOpen, Headphones, PenLine, MessagesSquare, type LucideIcon } from "lucide-react";

/** CEFR ladder — the current level is highlighted in the section. */
export const CEFR_SCALE = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export const CEFR_CURRENT = "B2";
export const CEFR_LABEL = "Upper Intermediate";

export interface EnglishSkill {
  icon: LucideIcon;
  label: string;
  body: string;
}

export const english = {
  eyebrow: "Idioma",
  title: "Inglês — Nível B2",
  lead:
    "Nível B2 (upper intermediate) em prática contínua. Uso inglês todos os dias no trabalho técnico — leitura, escuta, escrita e conversa — com acesso direto à fonte, sem depender de tradução.",

  /** Honest, concrete B2 capabilities across the four CEFR competences. */
  skills: [
    {
      icon: BookOpen,
      label: "Leitura técnica",
      body: "Documentação, RFCs, código-fonte e discussões em issues e pull requests — sem tradução no caminho.",
    },
    {
      icon: Headphones,
      label: "Compreensão",
      body: "Talks, tutoriais e vídeos técnicos, acompanhando explicações longas e argumentos em ritmo natural.",
    },
    {
      icon: PenLine,
      label: "Escrita",
      body: "Issues, commits, PRs, READMEs e e-mails técnicos claros, com a terminologia correta do domínio.",
    },
    {
      icon: MessagesSquare,
      label: "Conversação",
      body: "Discussões técnicas e reuniões, comunicando trade-offs e decisões de arquitetura de forma direta.",
    },
  ] satisfies EnglishSkill[],

  /** What B2 means in the CEFR framework, stated plainly. */
  note:
    "No quadro europeu (CEFR), B2 significa entender as ideias principais de textos complexos, interagir com fluência e naturalidade com falantes nativos e produzir texto claro e detalhado sobre temas técnicos.",
};
