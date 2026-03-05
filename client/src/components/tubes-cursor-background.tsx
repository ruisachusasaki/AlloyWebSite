import { useRef, useEffect, memo } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

function TubesCursorBackgroundInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isMobile || prefersReducedMotion || !hasWebGL()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let instance: { dispose(): void } | null = null;

    import("threejs-components/build/cursors/tubes1.min.js")
      .then(({ default: TubesCursor }) => {
        if (!canvasRef.current) return;
        instance = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#0ea5e9", "#6366f1", "#8b5cf6"],
            count: 12,
            radius: 0.007,
            speed: 1.2,
            lights: {
              intensity: 150,
              colors: ["#0ea5e9", "#6366f1", "#8b5cf6", "#60a5fa"],
            },
          },
          bloom: {
            strength: 0.4,
            radius: 0.5,
            threshold: 0.8,
          },
        });
      })
      .catch((err) => {
        console.error("TubesCursor failed to load:", err);
      });

    return () => {
      instance?.dispose();
    };
  }, [isMobile, prefersReducedMotion]);

  if (isMobile || prefersReducedMotion) return null;

  return (
    <div className="tubes-cursor-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export const TubesCursorBackground = memo(TubesCursorBackgroundInner);
export default TubesCursorBackground;
