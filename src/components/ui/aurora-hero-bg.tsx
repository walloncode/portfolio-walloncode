import React from "react";
// This project ships the `motion` package (v12), which exposes the same API as
// framer-motion via `motion/react` — so we import from there instead of adding
// a duplicate framer-motion dependency.
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The animated aurora gradient on its own, meant to sit *behind* other content
 * as a backdrop (absolute, non-interactive). Drop it into any `relative`
 * container and raise the real content with `z-10`.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-[-100%]"
        style={{
          background: `
            repeating-linear-gradient(100deg,
              #8b5cf6 10%,
              #3b82f6 15%,
              #ec4899 20%,
              #8b5cf6 25%,
              #3b82f6 30%)
          `,
          backgroundSize: "300% 100%",
          filter: "blur(80px)",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-[-10px]"
        style={{
          background: `
            repeating-linear-gradient(100deg,
              rgba(139, 92, 246, 0.1) 0%,
              rgba(139, 92, 246, 0.1) 7%,
              transparent 10%,
              transparent 12%,
              rgba(139, 92, 246, 0.1) 16%),
            repeating-linear-gradient(100deg,
              #8b5cf6 10%,
              #3b82f6 15%,
              #ec4899 20%,
              #8b5cf6 25%,
              #3b82f6 30%)
          `,
          backgroundSize: "200%, 100%",
          backgroundPosition: "50% 50%, 50% 50%",
          mixBlendMode: "difference",
        }}
        animate={{
          backgroundPosition: [
            "50% 50%, 50% 50%",
            "100% 50%, 150% 50%",
            "50% 50%, 50% 50%",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

interface AuroraHeroProps {
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

export function AuroraHero({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  children,
}: AuroraHeroProps) {
  const titleWords = title?.split(" ") || [];

  return (
    <section
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas",
        className,
      )}
      role="banner"
      aria-label="Hero section"
    >
      {/* Aurora Gradient Background */}
      <AuroraBackground className="opacity-40" />

      {/* Vignette Overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      {children ? (
        <div className="relative z-10 w-full">{children}</div>
      ) : (
        <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mx-auto max-w-5xl"
          >
            {/* Animated Title */}
            {title && (
              <h1 className="mb-8 text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl lg:text-9xl">
                {titleWords.map((word, wordIndex) => (
                  <span key={wordIndex} className="mr-4 mb-2 inline-block last:mr-0">
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={`${wordIndex}-${letterIndex}`}
                        initial={{ y: 100, opacity: 0, filter: "blur(8px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{
                          delay: wordIndex * 0.1 + letterIndex * 0.03,
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                        }}
                        whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                        className="inline-block cursor-default bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
                        style={{ textShadow: "0 0 20px rgba(124,92,255,0.3)" }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
            )}

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-foreground-muted sm:text-xl md:text-2xl"
              >
                {description}
              </motion.p>
            )}

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas sm:text-lg"
                    aria-label={primaryAction.label}
                  >
                    {primaryAction.label}
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="rounded-full bg-surface px-8 py-4 text-base font-semibold text-foreground shadow-lg transition-all duration-300 hover:bg-surface/80 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas sm:text-lg"
                    aria-label={secondaryAction.label}
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default AuroraHero;
