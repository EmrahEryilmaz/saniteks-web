"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Only animate while true (hero slides animate when they become active). */
  active?: boolean;
  /** Wait until the element scrolls into view; false = animate immediately. */
  observe?: boolean;
  /** content = soft fade/lift; image = subtle settle from a 1.5% zoom. */
  kind?: "content" | "image";
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";

function isIntersecting(entry: IntersectionObserverEntry) {
  return entry.isIntersecting;
}

/**
 * Subtle entrance animation used across the live site (Web Animations API, so the
 * server-rendered markup is fully visible without JS). Skipped for reduced motion.
 */
export function Reveal({ children, className = "", active = true, observe = true, kind = "content" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active || !el.animate) return;

    const media = window.matchMedia(REDUCED_MOTION);
    let animation: Animation | undefined;
    let observer: IntersectionObserver | undefined;

    const play = () => {
      if (media.matches) return;
      animation = el.animate(
        kind === "image"
          ? [{ transform: "scale(1.015)" }, { transform: "scale(1)" }]
          : [
              { opacity: 0.65, transform: "translateY(8px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
        { duration: kind === "image" ? 600 : 350, easing: EASING },
      );
    };

    if (observe && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some(isIntersecting)) {
            play();
            observer?.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      observer.observe(el);
    } else {
      play();
    }

    const onMotionChange = () => {
      if (media.matches) animation?.cancel();
    };
    media.addEventListener("change", onMotionChange);

    return () => {
      observer?.disconnect();
      animation?.cancel();
      media.removeEventListener("change", onMotionChange);
    };
  }, [active, observe, kind]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
