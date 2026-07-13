import type { ReactNode } from "react";
import { BackgroundField } from "@/components/background/background-field";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-canvas"
      >
        Pular para o conteúdo
      </a>
      <BackgroundField />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
