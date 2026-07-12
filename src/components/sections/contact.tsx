import { useState } from "react";
import { ArrowUpRight, Check, Copy, GitBranch } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-36">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="down">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
              Contato
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2.5rem] md:text-[3rem]">
              Tem um projeto em mente?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-2xl font-normal leading-relaxed text-foreground-muted">
              Aberto a oportunidades e projetos que exijam engenharia de verdade, não só
              entrega rápida.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button variant="accent" size="lg" onClick={copyEmail}>
                {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                {copied ? "E-mail copiado" : profile.email}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  <GitBranch className="size-4" aria-hidden="true" />
                  GitHub
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href={profile.agencyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm text-foreground-subtle transition-colors duration-200 hover:text-foreground"
            >
              ou conheça a WKCODE
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
