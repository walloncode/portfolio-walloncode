import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import { Container } from "@/components/ui/container";
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

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Closing beat of the page. A tall scroll track drives a sticky stage where a
 * clip-path panel "opens" and the thank-you copy is released (rises + unblurs)
 * as it scrolls into place — then a button opens a contact pop-up with the
 * social links. Adapted from the scroll-reveal video block, minus the video.
 */
export function ThankYou() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end end"],
  });

  // Panel reveal (decorative backdrop that irises open).
  const insetY = useTransform(scrollYProgress, [0, 0.7], [46, 0]);
  const insetX = useTransform(scrollYProgress, [0, 0.7], [46, 0]);
  const round = useTransform(scrollYProgress, [0, 1], [999, 32]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${round}px)`;

  // Text release.
  const textY = useTransform(scrollYProgress, [0.12, 0.6], [90, 0]);
  const blur = useTransform(scrollYProgress, [0.12, 0.6], [14, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const textOpacity = useTransform(scrollYProgress, [0.12, 0.5], [0, 1]);

  return (
    <section id="thank-you" className="relative">
      <div ref={trackRef} className="relative h-[220vh] w-full">
        <div className="sticky top-0 grid min-h-svh w-full place-items-center overflow-hidden">
          {/* iris-opening backdrop panel */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-6 -z-10 md:inset-12"
            style={reduce ? undefined : { clipPath }}
          >
            <div className="size-full rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_35%,rgba(124,92,255,0.22),transparent_72%)]" />
            <div className="absolute inset-0 rounded-[32px] border border-accent-border/40" />
          </motion.div>

          <Container>
            <motion.div
              className="mx-auto max-w-2xl text-center"
              style={reduce ? undefined : { y: textY, filter, opacity: textOpacity }}
            >
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
                Fim da jornada
              </p>
              <h2 className="title-std mt-4 text-foreground [text-shadow:0_8px_40px_rgba(124,92,255,0.35)]">
                Obrigado por chegar até aqui.
              </h2>
              <p className="subtext-std mx-auto mt-6 max-w-md text-foreground-muted">
                Se você rolou até o fim, provavelmente a gente ia se dar bem trabalhando
                junto. Bora conversar?
              </p>

              <div className="mt-10 flex justify-center">
                <Button variant="accent" size="lg" onClick={() => setOpen(true)}>
                  Vamos conversar
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          </Container>
        </div>
      </div>

      <ContactPopup open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function ContactPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  // Close on Escape and lock body scroll while the pop-up is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

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
      setTimeout(() => setCopiedHandle((c) => (c === label ? null : c)), 2000);
    } catch {
      /* clipboard indisponível — ignora */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Fechar contato"
            onClick={onClose}
            className="absolute inset-0 bg-canvas/70 backdrop-blur-sm"
          />

          {/* card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Contato"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border-strong bg-surface/80 p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
              Vamos conversar
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              Me chama por onde preferir
            </h3>

            <button
              type="button"
              onClick={copyEmail}
              className="mt-6 flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-canvas-elevated px-4 py-3 text-left transition-colors hover:border-accent"
            >
              <span className="min-w-0 truncate text-sm text-foreground">{profile.email}</span>
              {copied ? (
                <Check className="size-4 shrink-0 text-accent-hover" aria-hidden="true" />
              ) : (
                <Copy className="size-4 shrink-0 text-foreground-muted" aria-hidden="true" />
              )}
            </button>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {profile.contactSocials.map((social) => {
                const Icon = socialIcons[social.icon];
                const isCopy = "copy" in social;
                const justCopied = copiedHandle === social.label;
                const inner = (
                  <>
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors group-hover:border-accent group-hover:text-foreground">
                      {justCopied ? <Check className="size-4" aria-hidden="true" /> : <Icon className="size-4" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{social.label}</span>
                      <span className="block truncate text-xs text-foreground-subtle">{social.handle}</span>
                    </span>
                  </>
                );
                const cls =
                  "group flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-canvas-elevated/60 p-2.5 transition-colors hover:border-accent";

                return isCopy ? (
                  <button
                    key={social.label}
                    type="button"
                    onClick={() => copyHandle(social.label, social.copy)}
                    className={cls}
                    title={justCopied ? `${social.handle} copiado` : `Copiar ${social.handle}`}
                  >
                    {inner}
                  </button>
                ) : (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cls}
                  >
                    {inner}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
