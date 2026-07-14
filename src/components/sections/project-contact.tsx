import { useState, type FormEvent } from "react";
import { GitBranch, Globe, Mail, MapPin, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/content/profile";
import type { Project } from "@/content/projects";

/**
 * Per-project contact menu — a "fale comigo" info panel beside a message form,
 * modeled on the reference "Get In Touch" layout. It reads the accent tokens,
 * so it re-colors to whatever theme the surrounding project page sets (gold for
 * Kiuseven, green for RotaRural, ocean blue for WKCODE, …). The form has no
 * backend: submitting composes a pre-filled e-mail to the profile address.
 */
export function ProjectContact({ project }: { project: Project }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `Contato via portfólio — ${project.title}`;
    const body = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      "",
      message,
      "",
      `— enviado a partir do projeto ${project.title}`,
    ].join("\n");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const details = [
    { icon: MapPin, label: profile.location, href: undefined },
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    { icon: GitBranch, label: `@${profile.handle}`, href: profile.githubUrl },
    { icon: Globe, label: "wkcode.com.br", href: profile.agencyUrl },
  ];

  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="down">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
              Contato
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="title-std mt-3 text-foreground">
              Gostou deste projeto?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-accent" />
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 grid max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface/40 shadow-elevated backdrop-blur-md md:grid-cols-[minmax(0,340px)_1fr]">
            {/* info panel */}
            <div className="relative border-b border-border bg-gradient-to-br from-accent-soft to-transparent p-8 md:border-b-0 md:border-r">
              {project.brandLogo && (
                <img
                  src={project.brandLogo}
                  alt={`${project.title} — logo`}
                  className="mb-6 h-14 w-auto rounded-[var(--radius-md)] bg-white p-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
                />
              )}
              <h3 className="font-display text-2xl font-bold text-foreground">
                Fale comigo
              </h3>
              <span className="mt-3 block h-1 w-10 rounded-full bg-accent" />

              <ul className="mt-8 space-y-5">
                {details.map(({ icon: Icon, label, href }) => {
                  const content = (
                    <>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-hover ring-1 ring-accent-border">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-snug text-foreground-muted transition-colors duration-200 group-hover:text-foreground">
                        {label}
                      </span>
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="group flex items-center gap-3.5"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="group flex items-center gap-3.5">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* message form */}
            <form onSubmit={onSubmit} className="space-y-4 p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="sr-only">Seu nome</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-[var(--radius-sm)] border border-border bg-canvas-elevated/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Seu e-mail</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail"
                    className="w-full rounded-[var(--radius-sm)] border border-border bg-canvas-elevated/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </label>
              </div>
              <label className="block">
                <span className="sr-only">Sua mensagem</span>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Conte sobre um projeto parecido com o ${project.title}…`}
                  className="w-full resize-y rounded-[var(--radius-sm)] border border-border bg-canvas-elevated/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent-solid px-6 py-3 text-sm font-medium text-accent-foreground shadow-[0_0_0_1px_var(--color-accent-border)] transition-colors duration-200 hover:bg-accent-solid-hover active:scale-[0.98]"
              >
                <Send className="size-4" aria-hidden="true" />
                Enviar mensagem
              </button>
            </form>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
