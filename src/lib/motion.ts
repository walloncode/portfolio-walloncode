import type { Transition, Variants } from "motion/react";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const quickSpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
  mass: 0.6,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -22 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: springTransition },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: springTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

/** Card entrance with a gentle spring overshoot — used for staggered grids. */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 24, mass: 0.7 },
  },
};

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const viewportOnce = { once: true, margin: "-80px 0px -80px 0px" };
