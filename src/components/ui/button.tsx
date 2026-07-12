import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200 ease-[var(--ease-out-quart)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-canvas hover:bg-foreground/90 shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset]",
        accent:
          "bg-accent-solid text-accent-foreground hover:bg-accent-solid-hover shadow-[0_0_0_1px_var(--color-accent-border),0_8px_24px_-8px_rgba(91,108,255,0.55)]",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-surface hover:border-foreground-subtle",
        ghost: "bg-transparent text-foreground-muted hover:text-foreground hover:bg-surface",
        link: "bg-transparent text-foreground-muted hover:text-foreground underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px]",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
