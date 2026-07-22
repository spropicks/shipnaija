"use client";

import { useAnimationFrame, useMotionValue, useTransform, motion } from "motion/react";
import { useRef, type ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#22c55e", "#86efac", "#eab308", "#22c55e"],
  animationSpeed = 8,
}: GradientTextProps) {
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    elapsedRef.current += time - lastTimeRef.current;
    lastTimeRef.current = time;
    progress.set((elapsedRef.current / (animationSpeed * 1000)) * 100);
  });

  const backgroundPosition = useTransform(progress, (value) => `${value}% 50%`);

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        backgroundSize: "300% 100%",
        backgroundPosition,
        WebkitBackgroundClip: "text",
      }}
    >
      {children}
    </motion.span>
  );
}
