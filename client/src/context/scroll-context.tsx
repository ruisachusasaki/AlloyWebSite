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

      // Force Lenis to recalculate content dimensions before element-based
      // scrolling. Critical after page transitions where content height changes
      // dramatically (e.g. /build → landing page with 400vh CasesSection).
      if (typeof target === "string" || target instanceof HTMLElement) {
        lenisRef.current.resize();
      }

      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
      });
    },
    []
  );

  return (
    <ScrollContext.Provider value={{ scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
}
