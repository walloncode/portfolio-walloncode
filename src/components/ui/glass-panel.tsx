import * as React from "react";
import { cn } from "@/lib/utils";

export function GlassPanel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 shadow-[var(--shadow-glass)]",
        className,
      )}
      {...props}
    />
  );
}
