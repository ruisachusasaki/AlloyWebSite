import { useEffect, useRef, useState, memo } from "react";
import { useReducedMotion } from "framer-motion";

function CustomCursorInner() {
  const prefersReducedMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<"default" | "link" | "image">("default");
  const [visible, setVisible] = useState(false);
  const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion) return;

    const pos = posRef.current;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (!visible) setVisible(true);
    };

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest("a, button, [role='button'], [data-cursor='link']");
      const img = target.closest("img, [data-cursor='image']");
      if (img) setHoverState("image");
      else if (el) setHoverState("link");
    };

    const onMouseLeave = () => setHoverState("default");

    const onMouseOut = () => setVisible(false);
    const onMouseOver = () => setVisible(true);

    function animate() {
      // Lerp towards target
      pos.x += (pos.tx - pos.x) * 0.15;
      pos.y += (pos.ty - pos.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseEnter, true);
    document.addEventListener("mouseout", onMouseLeave, true);
    document.documentElement.addEventListener("mouseleave", onMouseOut);
    document.documentElement.addEventListener("mouseenter", onMouseOver);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseEnter, true);
      document.removeEventListener("mouseout", onMouseLeave, true);
      document.documentElement.removeEventListener("mouseleave", onMouseOut);
      document.documentElement.removeEventListener("mouseenter", onMouseOver);
    };
  }, [prefersReducedMotion, visible]);

  // Don't render on touch/reduced-motion
  if (prefersReducedMotion) return null;

  const isLink = hoverState === "link";
  const isImage = hoverState === "image";
  const size = isLink || isImage ? 40 : 12;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        backgroundColor: isLink || isImage ? "transparent" : "hsl(var(--primary))",
        border: isLink || isImage ? "1.5px solid hsl(var(--primary))" : "none",
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        transition: "width 0.2s, height 0.2s, margin 0.2s, background-color 0.2s, border 0.2s, opacity 0.2s",
        willChange: "transform",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isImage && (
        <span className="text-[9px] font-mono font-bold text-primary tracking-wider">
          VIEW
        </span>
      )}
    </div>
  );
}

export const CustomCursor = memo(CustomCursorInner);
