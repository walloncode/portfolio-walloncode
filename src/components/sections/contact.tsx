import { useState } from "react";
import { ArrowUpRight, Check, Copy, GitBranch } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import { profile } from "@/content/profile";

const socialIcons = {
  instagram: InstagramIcon,
  whatsapp: WhatsappIcon,
  github: GithubIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  discord: DiscordIcon,
} as const;

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const copyHandle = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedHandle(label);
      setTimeout(() => setCopiedHandle((current) => (current === label ? null : current)), 2000);
    } catch {
      /* clipboard indisponível — ignora silenciosamente */
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
            <h2 className="title-std mt-3 text-foreground">
              Tem um projeto em mente?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subtext-std mt-5 text-foreground-muted">
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

          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {profile.contactSocials.map((social) => {
                const Icon = socialIcons[social.icon];
                const isCopy = "copy" in social;
                const justCopied = copiedHandle === social.label;
                const className =
                  "group inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors duration-200 hover:border-accent hover:text-foreground";

                if (isCopy) {
                  return (
                    <button
                      key={social.label}
                      type="button"
                      onClick={() => copyHandle(social.label, social.copy)}
                      className={className}
                      aria-label={`Copiar ${social.label}: ${social.handle}`}
                      title={justCopied ? `${social.handle} copiado` : `${social.label} — ${social.handle}`}
                    >
                      {justCopied ? (
                        <Check className="size-5" aria-hidden="true" />
                      ) : (
                        <Icon className="size-5" />
                      )}
                    </button>
                  );
                }

                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                    aria-label={`${social.label}: ${social.handle}`}
                    title={`${social.label} — ${social.handle}`}
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
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
