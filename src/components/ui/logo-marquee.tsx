import type { ComponentType, SVGProps } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import {
  NodeIcon,
  PostgresqlIcon,
  PythonIcon,
  ReactIcon,
  TailwindIcon,
  TypescriptIcon,
} from "@/components/ui/stack-icons";

export interface Logo {
  id: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const STACK_LOGOS: Logo[] = [
  { id: "typescript", label: "TypeScript", Icon: TypescriptIcon },
  { id: "react", label: "React", Icon: ReactIcon },
  { id: "node", label: "Node.js", Icon: NodeIcon },
  { id: "python", label: "Python", Icon: PythonIcon },
  { id: "postgresql", label: "PostgreSQL", Icon: PostgresqlIcon },
  { id: "tailwind", label: "Tailwind CSS", Icon: TailwindIcon },
];

function Track({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {logos.map(({ id, label, Icon }) => (
        <div key={id} className="mx-8 flex shrink-0 items-center gap-3 md:mx-12">
          <Icon className="size-7 shrink-0 text-foreground-muted transition-colors" />
          <span className="whitespace-nowrap font-mono text-sm uppercase tracking-wider text-foreground-subtle">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Auto-scrolling band of stack marks. The loop is the CSS `marquee-x` keyframe
 * the intro gate already uses — two identical tracks side by side, translated
 * exactly one track width, so the seam never lands inside the viewport. No JS
 * runs per frame, and the browser stops compositing it once it scrolls away.
 */
export function LogoMarquee({
  heading = "O que eu uso todo dia",
  logos = STACK_LOGOS,
  className,
}: {
  heading?: string;
  logos?: Logo[];
  className?: string;
}) {
  return (
    <section aria-label={heading} className={cn("relative py-16 md:py-24", className)}>
      <Container>
        <p className="text-center font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
          {heading}
        </p>
      </Container>

      <div className="relative mt-8 overflow-hidden md:mt-10">
        <div className="flex w-max animate-[marquee-x_32s_linear_infinite] will-change-transform">
          <Track logos={logos} />
          <Track logos={logos} />
        </div>

        {/* fade the band into the page at both edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-canvas to-transparent md:w-28"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-canvas to-transparent md:w-28"
        />
      </div>
    </section>
  );
}
