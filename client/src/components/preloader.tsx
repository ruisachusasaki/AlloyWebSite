import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ── Timing constants (total ≈ 2.75s) ── */
const COUNTER_MS = 1800;
const HOLD_MS = 250;
const SPLIT_MS = 700;

const SESSION_KEY = "alloy-preloader-shown";
const WORDMARK = "ALLOY";
const TAGLINE = "Replace Chaos With Clarity";

/* Noise texture – same SVG as .noise-bg in index.css */
const NOISE_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ── Odometer digit ── */
function OdometerDigit({ value }: { value: number }) {
  return (
    <span className="relative inline-block overflow-hidden h-[1em] w-[0.62em]">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        animate={{ y: `${-value}em` }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="block h-[1em] leading-[1em] text-center select-none"
          >
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/* ── Shared content rendered inside each curtain half ── */
function PreloaderContent({
  count,
  showTagline,
  taglineChars,
}: {
  count: number;
  showTagline: boolean;
  taglineChars: number;
}) {
  const padded = String(count).padStart(3, "0");
  const digits = padded.split("").map(Number);

  return (
    <>
      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URI }}
      />

      {/* Progress line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border/20">
        <div
          className="h-full bg-primary/50 transition-[width] duration-75"
          style={{ width: `${count}%` }}
        />
      </div>

      {/* ── Center stack ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 md:gap-5">
        {/* Wordmark */}
        <div className="flex items-center tracking-[0.35em]">
          {WORDMARK.split("").map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block font-display text-sm md:text-base font-medium text-muted-foreground uppercase"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.065,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Counter */}
        <div className="flex items-baseline font-mono text-7xl md:text-[8rem] lg:text-[10rem] font-bold tracking-tight text-foreground leading-none select-none">
          {digits.map((d, i) => (
            <OdometerDigit key={i} value={d} />
          ))}
          <span className="text-xl md:text-3xl text-primary/50 ml-1 font-normal">
            %
          </span>
        </div>

        {/* Tagline (typewriter) */}
        <div className="h-5 md:h-7 flex items-center">
          {showTagline && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[10px] md:text-xs text-muted-foreground/60 tracking-[0.2em] uppercase"
            >
              {TAGLINE.slice(0, taglineChars)}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.45,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-primary/70 ml-px"
              >
                _
              </motion.span>
            </motion.span>
          )}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-4 md:bottom-8 left-5 md:left-8 right-5 md:right-8 flex items-end justify-between">
        <motion.span
          className="font-mono text-[9px] md:text-[10px] text-muted-foreground/30 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          v2.0
        </motion.span>
        <motion.span
          className="font-mono text-[9px] md:text-[10px] text-muted-foreground/20 tracking-[0.15em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Initializing System
        </motion.span>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   Self-contained preloader — manages its own lifecycle
   so App never re-renders when it finishes.
   ═══════════════════════════════════════════════════ */
export function Preloader() {
  /* Skip entirely if already shown this session */
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );

  const [count, setCount] = useState(0);
  const [showTagline, setShowTagline] = useState(false);
  const [taglineChars, setTaglineChars] = useState(0);
  const [splitting, setSplitting] = useState(false);
  const completedRef = useRef(false);

  /* Prevent background scroll via touch-action on overlay;
     no body style mutations = no scrollbar layout shift */

  /* Counter RAF loop */
  useEffect(() => {
    if (dismissed) return;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / COUNTER_MS, 1);
      setCount(Math.round(easeInOutCubic(t) * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        setTimeout(() => setSplitting(true), HOLD_MS);
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "true");
          setDismissed(true);
        }, HOLD_MS + SPLIT_MS + 50); // +50 ms buffer so curtains finish visually
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dismissed]);

  /* Tagline trigger */
  useEffect(() => {
    if (count >= 80 && !showTagline) setShowTagline(true);
  }, [count, showTagline]);

  /* Typewriter */
  useEffect(() => {
    if (!showTagline) return;
    const id = setInterval(() => {
      setTaglineChars((prev) => {
        if (prev >= TAGLINE.length) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, 22);
    return () => clearInterval(id);
  }, [showTagline]);

  /* Already shown — render nothing */
  if (dismissed) return null;

  const splitSec = SPLIT_MS / 1000;
  const splitEase: [number, number, number, number] = [0.76, 0, 0.24, 1];
  const contentProps = { count, showTagline, taglineChars };

  return (
    <div className="fixed inset-0 z-[9999] touch-none">
      {/* Left curtain */}
      <motion.div
        className="absolute inset-0 bg-background will-change-transform"
        style={{ clipPath: "inset(0 50% 0 0)" }}
        animate={{ x: splitting ? "-100%" : 0 }}
        transition={{ duration: splitSec, ease: splitEase }}
      >
        <PreloaderContent {...contentProps} />
      </motion.div>

      {/* Right curtain */}
      <motion.div
        className="absolute inset-0 bg-background will-change-transform"
        style={{ clipPath: "inset(0 0 0 50%)" }}
        animate={{ x: splitting ? "100%" : 0 }}
        transition={{ duration: splitSec, ease: splitEase }}
      >
        <PreloaderContent {...contentProps} />
      </motion.div>

      {/* Full overlay (covers clip seam until split) */}
      {!splitting && (
        <div className="absolute inset-0 bg-background">
          <PreloaderContent {...contentProps} />
        </div>
      )}
    </div>
  );
}
