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
      <h2 className="title-std mt-3 text-foreground">{title}</h2>
      {description && (
        <p className="subtext-std mt-4 max-w-md text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
