import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("md:sticky md:top-32", className)}>
      <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2.5rem] md:text-[3rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-md text-2xl font-normal leading-relaxed text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
