"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Fixed header shell. Transparent over the home hero until the page scrolls past 48px;
 * every other route starts in the solid ("scrolled") state. The topbar collapses when scrolled.
 */
export function HeaderFrame({ topbar, children }: { topbar: ReactNode; children: ReactNode }) {
  const [pastTop, setPastTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setPastTop(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrolled = pastTop || pathname !== "/";

  return (
    <header
      data-scrolled={scrolled}
      className="group/header fixed inset-x-0 top-0 z-40 border-b border-primary-foreground/20 bg-transparent text-primary-foreground transition-[background-color,color,border-color] duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-surface data-[scrolled=true]:text-foreground motion-reduce:transition-none print:hidden"
    >
      <div
        inert={scrolled}
        className="max-h-11 overflow-hidden border-b border-primary-foreground/15 transition-[max-height,border-color] duration-300 group-data-[scrolled=true]/header:max-h-0 group-data-[scrolled=true]/header:border-transparent motion-reduce:transition-none"
      >
        {topbar}
      </div>
      {children}
    </header>
  );
}
