import { createContext, useContext, useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

interface ScrollContextValue {
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const ScrollContext = createContext<ScrollContextValue>({ scrollTo: () => {} });

export function useScrollContext() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: prefersReduced ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => {
      if (!lenisRef.current) return;

      // For element targets, calculate position via offsetTop chain.
      // This is immune to CSS transforms (e.g. motion.div translateY during
      // page transitions) and Lenis animatedScroll drift after route changes.
      let el: HTMLElement | null = null;
      if (typeof target === "string") {
        el = document.querySelector(target) as HTMLElement | null;
        if (!el) return;
      } else if (target instanceof HTMLElement) {
        el = target;
      }

      if (el) {
        let top = 0;
        let node: HTMLElement | null = el;
        while (node) {
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        lenisRef.current.scrollTo(Math.max(0, top + (options?.offset ?? 0)), {
          duration: options?.duration ?? 1.2,
        });
      } else {
        // Numeric target — pass through directly
        lenisRef.current.scrollTo(target as number, {
          offset: options?.offset ?? 0,
          duration: options?.duration ?? 1.2,
        });
      }
    },
    []
  );

  return (
    <ScrollContext.Provider value={{ scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
}
