import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import wallonMark from "@/assets/walloncode-mark.png";

const NAV_ITEMS = [
  { label: "Trabalho", hash: "work" },
  { label: "Sobre", hash: "about" },
  { label: "Skills", hash: "skills" },
  { label: "Percurso", hash: "journey" },
  { label: "Inglês", hash: "english" },
  { label: "GitHub", hash: "github" },
];

const menuSpring = { type: "spring", stiffness: 420, damping: 34 } as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // close on Escape while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goToSection = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      setOpen(false);
      navigate(`/#${hash}`);
      return;
    }
    // Close the mobile menu first, then scroll on the next tick — running the
    // smooth scroll in the same synchronous step as setOpen lets the menu's
    // close/layout animation swallow it, so the page never moves on mobile.
    setOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    });
  };

  // shrink the mobile bar once scrolled — until the user opens it again
  const compact = scrolled && !open;
  const glass =
    "bg-canvas/70 backdrop-blur-xl backdrop-saturate-150 shadow-[var(--shadow-glass)] border-white/[0.08]";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      {/* Desktop — static pill */}
      <nav
        className={cn(
          "hidden w-full max-w-[880px] items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 ease-[var(--ease-out-quart)] md:flex",
          scrolled ? glass : "border-transparent bg-transparent",
        )}
      >
        <Link to="/" className="group flex items-center gap-2">
          <img
            src={wallonMark}
            alt="WALLONCODE"
            draggable={false}
            className="size-7 rounded-full ring-1 ring-accent-border transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-mono text-sm font-medium tracking-tight text-foreground transition-colors group-hover:text-accent-hover">
            wellyson.dev
          </span>
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.hash}>
              <a
                href={`/#${item.hash}`}
                onClick={goToSection(item.hash)}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-foreground-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <Button variant="accent" size="sm" onClick={goToSection("contact")} className="rounded-full">
          Contato
        </Button>
      </nav>

      {/* Mobile — shrinks on scroll, opens on tap */}
      <motion.nav
        layout
        transition={menuSpring}
        className={cn(
          "flex flex-col overflow-hidden rounded-3xl border md:hidden",
          scrolled || open ? glass : "border-transparent bg-transparent",
          compact ? "w-auto" : "w-full max-w-[480px]",
        )}
      >
        <motion.div layout className="flex items-center justify-between gap-3 px-3 py-2">
          {!compact && (
            <Link to="/" className="flex items-center gap-2 pl-1">
              <img
                src={wallonMark}
                alt="WALLONCODE"
                draggable={false}
                className="size-6 rounded-full ring-1 ring-accent-border"
              />
              <span className="whitespace-nowrap font-mono text-sm font-medium tracking-tight text-foreground">
                wellyson.dev
              </span>
            </Link>
          )}
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground backdrop-blur-sm transition-colors hover:bg-white/10 active:scale-95"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="grid place-items-center"
              >
                {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
              </motion.span>
            </AnimatePresence>
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
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
