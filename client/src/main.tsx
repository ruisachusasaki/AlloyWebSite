import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Global viewport-height scaling.
 * Design baseline = 1080px screen height.
 * On shorter screens, scale the root font-size proportionally so all
 * rem-based sizes (Tailwind) shrink uniformly.
 * Uses screen.height (monitor resolution) not viewport height,
 * so browser chrome doesn't affect the calculation.
 */
function applyScreenScale() {
  const scale = Math.min(1, window.screen.height / 1080);
  document.documentElement.style.fontSize = `${scale * 16}px`;
}
applyScreenScale();

createRoot(document.getElementById("root")!).render(<App />);
