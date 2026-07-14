import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  textClassName?: string;
  underlineClassName?: string;
  underlinePath?: string;
  underlineHoverPath?: string;
  underlineDuration?: number;
}

/**
 * Heading that drops in and draws its own underline once it scrolls into view.
 * Adapted to the site: Sora Bold via `.title-std`, single accent underline,
 * `whileInView` so the reveal fires as the section arrives. The wavy underline
 * flexes on hover.
 */
const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      className,
      textClassName,
      underlineClassName,
      underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
      underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
      underlineDuration = 1.5,
    },
    ref,
  ) => {
    const pathVariants: Variants = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: underlineDuration, ease: "easeInOut" },
      },
    };

    return (
      <div ref={ref} className={cn("flex flex-col items-center justify-center", className)}>
        <motion.div
          className="group relative inline-block"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className={cn("title-std text-center", textClassName)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {text}
          </motion.h2>

          <motion.svg
            width="100%"
            height="20"
            viewBox="0 0 300 20"
            preserveAspectRatio="none"
            className={cn("absolute -bottom-4 left-0 text-accent", underlineClassName)}
          >
            <motion.path
              d={underlinePath}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              variants={pathVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              whileHover={{ d: underlineHoverPath, transition: { duration: 0.8 } }}
            />
          </motion.svg>
        </motion.div>
      </div>
    );
  },
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
