import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn("h-px w-full bg-gradient-to-r from-transparent via-border-strong to-transparent", className)}
    />
  );
}
