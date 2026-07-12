import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, fadeDown, fadeLeft, fadeRight, viewportOnce } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right";

const BY_DIRECTION: Record<Direction, Variants> = {
  up: fadeUp,
  down: fadeDown,
  left: fadeLeft,
  right: fadeRight,
};

export function Reveal({
  children,
  variants,
  direction = "up",
  className,
  delay = 0,
}: {
  children: ReactNode;
  variants?: Variants;
  /** entrance direction — text slides in from this side (default: up) */
  direction?: Direction;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants ?? BY_DIRECTION[direction]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
