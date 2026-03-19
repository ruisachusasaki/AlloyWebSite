import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  threshold?: number;
  className?: string;
}

const offsets = {
  up: { x: 0, y: 30 },
  left: { x: -30, y: 0 },
  right: { x: 30, y: 0 },
};

export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.15,
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const prefersReducedMotion = useReducedMotion();

  const offset = offsets[direction];

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
