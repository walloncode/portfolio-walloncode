import { cn } from "@/lib/utils";
import { SplitText } from "@/components/ui/split-text";

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
      <SplitText
        tag="h2"
        text={title}
        className="title-std mt-3 text-foreground"
        splitType="chars"
        delay={30}
        duration={0.8}
        from={{ opacity: 0, y: 30 }}
        to={{ opacity: 1, y: 0 }}
        textAlign="left"
      />
      {description && (
        <p className="subtext-std mt-4 max-w-md text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
