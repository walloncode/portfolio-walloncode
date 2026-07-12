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
      <h2 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[3.75rem] lg:text-[4.5rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-sm text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
