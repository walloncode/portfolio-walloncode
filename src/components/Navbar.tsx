import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import wallonMark from "@/assets/walloncode-mark.png";

const NAV_ITEMS = [
  { label: "Trabalho", hash: "work" },
  { label: "WK", hash: "wk" },
  { label: "Sobre", hash: "about" },
  { label: "Skills", hash: "skills" },
  { label: "Percurso", hash: "journey" },
  { label: "Inglês", hash: "english" },
  { label: "GitHub", hash: "github" },
];

// Critically-damped glide (damping ratio ≈ 1): the bar opens and settles with no
// overshoot and no snap. The whole menu — bar width and the items inside — shares
// this one spring, so everything moves as a single fluid piece.
const menuSpring = { type: "spring", stiffness: 220, damping: 30, mass: 1 } as const;
// The item reveal rides the same spring for motion; only opacity is a short fade
// so the content doesn't ghost ahead of the widening bar.
const itemsTransition = { default: menuSpring, opacity: { duration: 0.18, ease: "easeOut" } } as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const desktopRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // close on Escape / click-outside while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!desktopRef.current?.contains(t) && !mobileRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const goToSection = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      setOpen(false);
      navigate(`/#${hash}`);
      return;
    }
    setOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    });
  };

  // Collapsed to just the logo once scrolled — until the user opens it again.
  // At the top of the page it comes expanded.
  const compact = scrolled && !open;
  const glass =
    "bg-canvas/70 backdrop-blur-xl backdrop-saturate-150 shadow-[var(--shadow-glass)] border-white/[0.08]";

  const logo = (size: string) => (
    <img
      src={wallonMark}
      alt="WALLONCODE"
      draggable={false}
      className={cn(
        "rounded-full ring-1 transition-all duration-300 group-hover:scale-105",
        size,
        open ? "ring-accent" : "ring-accent-border",
      )}
    />
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      {/* Desktop — the logo IS the button; it expands horizontally into the menu
          and collapses to just the logo on scroll. */}
      <motion.nav
        ref={desktopRef}
        layout
        transition={menuSpring}
        className={cn(
          "hidden items-center gap-1 rounded-full border p-1.5 md:flex",
          scrolled ? glass : "border-transparent bg-transparent",
        )}
      >
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={!compact}
          onClick={() => setOpen((v) => !v)}
          className="group grid shrink-0 place-items-center rounded-full active:scale-95"
        >
          {logo(compact ? "size-9" : "size-8")}
        </button>

        <AnimatePresence initial={false}>
          {!compact && (
            <motion.div
              key="items"
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={itemsTransition}
              style={{ willChange: "transform, opacity" }}
              className="flex items-center gap-1 overflow-hidden pl-1"
            >
              <ul className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.hash}>
                    <a
                      href={`/#${item.hash}`}
                      onClick={goToSection(item.hash)}
                      className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium text-foreground-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Button
                variant="accent"
                size="sm"
                onClick={goToSection("contact")}
                className="ml-1 shrink-0 rounded-full"
              >
                Contato
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile — logo toggles a vertical dropdown (items in a row don't fit). */}
      <motion.nav
        ref={mobileRef}
        layout
        transition={menuSpring}
        className={cn(
          "flex flex-col overflow-hidden rounded-3xl border md:hidden",
          scrolled || open ? glass : "border-transparent bg-transparent",
          open ? "w-full max-w-[420px]" : "w-auto",
        )}
      >
        <motion.div layout className="flex items-center justify-center p-2">
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="group grid place-items-center rounded-full active:scale-95"
          >
            {logo(compact ? "size-9" : "size-8")}
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-menu"
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: menuSpring,
                opacity: { duration: 0.2, ease: "easeOut" },
              }}
              style={{ willChange: "height, opacity" }}
              className="overflow-hidden"
            >
              <motion.ul
                variants={staggerContainer(0.05)}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1 px-3 pb-3 pt-1"
              >
                {NAV_ITEMS.map((item) => (
                  <motion.li key={item.hash} variants={fadeUp}>
                    <a
                      href={`/#${item.hash}`}
                      onClick={goToSection(item.hash)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-white/[0.06] hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li variants={fadeUp} className="pt-1">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={goToSection("contact")}
                    className="w-full rounded-xl"
                  >
                    Contato
                  </Button>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
