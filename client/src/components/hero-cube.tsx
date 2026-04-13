import { useRef, useEffect, useState, memo } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const ORBIT_LABELS = ["CRM", "AI", "API", "E-COMM", "DATA", "OPS", "ERP", "WEB"];

const LABEL_CLASSES =
  "absolute px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-primary font-mono text-xs font-semibold tracking-wider whitespace-nowrap pointer-events-none select-none";

/** CSS-only fallback for mobile / no-WebGL: orbiting labels around a glowing core */
function CSSFallback() {
  return (
    <div className="flex items-center justify-center w-full h-[40vh] sm:h-[45vh] lg:h-[50vh] min-h-[280px] relative" aria-hidden>
      {/* Central glow */}
      <div className="absolute w-20 h-20 rounded-full bg-primary/20 blur-xl" />
      <div className="absolute w-8 h-8 rounded-full bg-primary/40 blur-md" />
      <div className="absolute w-3 h-3 rounded-full bg-primary" />

      {/* Orbiting labels */}
      {ORBIT_LABELS.map((label, i) => {
        const angle = (i / ORBIT_LABELS.length) * 360;
        const radius = 90 + (i % 2) * 30;
        const duration = 20 + i * 3;
        return (
          <div
            key={label}
            className="absolute"
            style={{
              animation: `css-orbit-${i % 2 === 0 ? 'cw' : 'ccw'} ${duration}s linear infinite`,
              animationDelay: `${-angle / 360 * duration}s`,
            }}
          >
            <span
              className="block px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-primary font-mono text-xs font-semibold tracking-wider"
              style={{ transform: `translateX(${radius}px)` }}
            >
              {label}
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes css-orbit-cw {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes css-orbit-ccw {
          0%   { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes css-orbit-cw {
            0%, 100% { transform: rotate(0deg); }
          }
          @keyframes css-orbit-ccw {
            0%, 100% { transform: rotate(0deg); }
          }
        }
      `}</style>
    </div>
  );
}

/** Three.js planet sphere with wireframe grid, glow, and HTML orbiting text labels */
function PlanetSphere() {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    const labelsContainer = labelsRef.current;
    if (!container || !labelsContainer) return;

    let disposed = false;
    let animId: number;

    // Pre-create HTML label spans
    const labelSpans: HTMLSpanElement[] = ORBIT_LABELS.map((text) => {
      const span = document.createElement("span");
      span.className = LABEL_CLASSES;
      span.textContent = text;
      labelsContainer.appendChild(span);
      return span;
    });

    import("three").then((THREE) => {
      if (disposed || !container) return;

      const containerW = container.clientWidth;
      const containerH = container.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, containerW / containerH, 0.1, 100);
      camera.position.z = 4.5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(containerW, containerH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const primaryColor = new THREE.Color("hsl(199, 89%, 48%)");

      // ── Scene group (mouse parallax) wraps everything ──
      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);

      // ── Auto-rotation group (sphere + grid + particles) ──
      const autoGroup = new THREE.Group();
      sceneGroup.add(autoGroup);

      // ── Core sphere — semi-transparent glowing surface ──
      const SPHERE_RADIUS = 1.4;
      const coreGeo = new THREE.SphereGeometry(SPHERE_RADIUS, 48, 36);
      const coreMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const coreSphere = new THREE.Mesh(coreGeo, coreMat);
      autoGroup.add(coreSphere);

      // ── Fresnel-like edge glow — slightly larger sphere ──
      const fresnelGeo = new THREE.SphereGeometry(SPHERE_RADIUS * 1.02, 48, 36);
      const fresnelMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: primaryColor },
          uOpacity: { value: 0.45 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewDir = normalize(-mvPos.xyz);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
            fresnel = pow(fresnel, 3.0);
            gl_FragColor = vec4(uColor, fresnel * uOpacity);
          }
        `,
      });
      const fresnelSphere = new THREE.Mesh(fresnelGeo, fresnelMat);
      autoGroup.add(fresnelSphere);

      // ── Wireframe grid overlay — techy low-segment grid ──
      const wireGeo = new THREE.SphereGeometry(SPHERE_RADIUS * 1.005, 16, 12);
      const wireMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const wireSphere = new THREE.Mesh(wireGeo, wireMat);
      autoGroup.add(wireSphere);

      // ── Atmosphere glow — larger sphere behind ──
      const atmosGeo = new THREE.SphereGeometry(SPHERE_RADIUS * 1.35, 32, 24);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: 0.035,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      });
      const atmosSphere = new THREE.Mesh(atmosGeo, atmosMat);
      autoGroup.add(atmosSphere);

      // ── Surface dots — particles scattered on sphere surface ──
      const DOT_COUNT = 200;
      const dotPositions = new Float32Array(DOT_COUNT * 3);
      const dotColors = new Float32Array(DOT_COUNT * 3);

      for (let i = 0; i < DOT_COUNT; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / DOT_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = SPHERE_RADIUS * 1.01;

        dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        dotPositions[i * 3 + 2] = r * Math.cos(phi);

        const brightness = 0.7 + Math.random() * 0.3;
        dotColors[i * 3] = primaryColor.r * brightness;
        dotColors[i * 3 + 1] = primaryColor.g * brightness;
        dotColors[i * 3 + 2] = primaryColor.b * brightness;
      }

      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
      dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));

      // Soft glow dot texture
      const dotCanvas = document.createElement("canvas");
      dotCanvas.width = 64;
      dotCanvas.height = 64;
      const dCtx = dotCanvas.getContext("2d")!;
      const gradient = dCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.6)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      dCtx.fillStyle = gradient;
      dCtx.fillRect(0, 0, 64, 64);
      const dotTexture = new THREE.CanvasTexture(dotCanvas);

      const dotMat = new THREE.PointsMaterial({
        size: 0.03,
        map: dotTexture,
        transparent: true,
        opacity: 0.7,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const dots = new THREE.Points(dotGeo, dotMat);
      autoGroup.add(dots);

      // ── Orbit params for HTML labels (no Three.js sprites) ──
      const labelOrbits = ORBIT_LABELS.map((_label, i) => {
        const orbitRadius = 2.4 + (i % 3) * 0.35;
        const speed = 0.15 + (i % 4) * 0.06;
        const phaseOffset = (i / ORBIT_LABELS.length) * Math.PI * 2;
        const tiltX = (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.25);

        return { orbitRadius, speed, phaseOffset, tiltX };
      });

      // Reusable vector for projection
      const tempVec = new THREE.Vector3();

      // ── Mouse parallax ──
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      // Smooth parallax targets
      let currentParallaxX = 0;
      let currentParallaxY = 0;

      const clock = new THREE.Clock();

      // Track current canvas size for projection
      let canvasW = containerW;
      let canvasH = containerH;

      const animate = () => {
        if (disposed) return;
        animId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Auto-rotation — always runs on autoGroup
        autoGroup.rotation.y += 0.003;
        autoGroup.rotation.x = Math.sin(elapsed * 0.15) * 0.08;

        // Mouse parallax — applied to sceneGroup via lerp
        const targetParallaxX = mouseY * 0.3;
        const targetParallaxY = mouseX * 0.4;
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.03;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.03;
        sceneGroup.rotation.x = currentParallaxX;
        sceneGroup.rotation.y = currentParallaxY;

        // Animate orbiting labels — project 3D to 2D for HTML positioning
        labelOrbits.forEach((orbit, i) => {
          const angle = elapsed * orbit.speed + orbit.phaseOffset;
          const lx = Math.cos(angle) * orbit.orbitRadius;
          const lz = Math.sin(angle) * orbit.orbitRadius;
          const ly = Math.sin(angle + orbit.tiltX) * orbit.orbitRadius * 0.35;

          // Apply sceneGroup rotation (parallax) to the label world position
          tempVec.set(lx, ly, lz);
          tempVec.applyEuler(sceneGroup.rotation);

          // Project to NDC
          tempVec.project(camera);

          // NDC to pixel coordinates
          const screenX = (tempVec.x * 0.5 + 0.5) * canvasW;
          const screenY = (-tempVec.y * 0.5 + 0.5) * canvasH;

          // Depth-based opacity (use original lz before rotation for consistent fade)
          const depthFade = THREE.MathUtils.clamp(
            (lz + orbit.orbitRadius) / (orbit.orbitRadius * 2),
            0.3,
            1,
          );

          const span = labelSpans[i];
          span.style.transform = `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`;
          span.style.opacity = String(depthFade);
        });

        // Subtle atmosphere pulse
        atmosSphere.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.04);

        renderer.render(scene, camera);
      };
      animate();

      // Resize handler
      const onResize = () => {
        if (!container || disposed) return;
        canvasW = container.clientWidth;
        canvasH = container.clientHeight;
        camera.aspect = canvasW / canvasH;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasW, canvasH);
      };
      window.addEventListener("resize", onResize);

      // Cleanup
      (container as any).__cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        fresnelGeo.dispose();
        fresnelMat.dispose();
        wireGeo.dispose();
        wireMat.dispose();
        atmosGeo.dispose();
        atmosMat.dispose();
        dotGeo.dispose();
        dotMat.dispose();
        dotTexture.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      disposed = true;
      // Remove HTML label spans
      labelSpans.forEach((s) => s.remove());
      if ((container as any).__cleanup) {
        (container as any).__cleanup();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[40vh] sm:h-[45vh] lg:h-[50vh] min-h-[280px] overflow-visible"
      aria-hidden
    >
      {/* HTML labels layer — sits on top of canvas, overflow-visible lets them bleed out */}
      <div
        ref={labelsRef}
        className="absolute inset-0 overflow-visible pointer-events-none"
        style={{ top: 0, left: 0 }}
      />
    </div>
  );
}

function HeroCubeInner() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [webGL] = useState(() => hasWebGL());

  // Hide entirely on mobile — the CSS fallback isn't visually compelling
  if (isMobile) return null;

  if (!webGL || prefersReducedMotion) {
    return <CSSFallback />;
  }

  return <PlanetSphere />;
}

export const HeroCube = memo(HeroCubeInner);
export default HeroCube;
