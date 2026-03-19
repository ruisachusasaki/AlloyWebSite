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

/** CSS-only fallback for mobile / no-WebGL: orbiting labels around a glowing core */
function CSSFallback() {
  return (
    <div className="flex items-center justify-center w-full h-[350px] sm:h-[420px] relative" aria-hidden>
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

/** Three.js planet sphere with wireframe grid, glow, and orbiting text labels */
function PlanetSphere() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;
    let animId: number;

    import("three").then((THREE) => {
      if (disposed || !container) return;

      // Oversized canvas so orbiting labels can extend beyond the container
      const OVERFLOW_SCALE = 1.6;
      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const canvasW = Math.round(containerW * OVERFLOW_SCALE);
      const canvasH = Math.round(containerH * OVERFLOW_SCALE);

      // Scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, canvasW / canvasH, 0.1, 100);
      camera.position.z = 4.5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(canvasW, canvasH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Position canvas centered but overflowing the container
      const el = renderer.domElement;
      el.style.position = "absolute";
      el.style.left = "50%";
      el.style.top = "50%";
      el.style.transform = "translate(-50%, -50%)";
      container.appendChild(el);

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

      // ── Orbiting text labels as sprites ──
      const labelSprites: InstanceType<typeof THREE.Sprite>[] = [];
      const labelOrbits = ORBIT_LABELS.map((label, i) => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext("2d")!;

        // Measure text with correct font
        ctx.font = "bold 28px monospace";
        const textW = ctx.measureText(label).width;
        const pillPadX = 24;
        const pillH = 40;
        const x = 128 - (textW + pillPadX * 2) / 2;
        const y = 12;
        const w = textW + pillPadX * 2;
        const r = pillH / 2;

        // Draw pill
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + pillH - r);
        ctx.arcTo(x + w, y + pillH, x + w - r, y + pillH, r);
        ctx.lineTo(x + r, y + pillH);
        ctx.arcTo(x, y + pillH, x, y + pillH - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();

        ctx.fillStyle = "rgba(14, 165, 233, 0.12)";
        ctx.fill();
        ctx.strokeStyle = "rgba(14, 165, 233, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.fillStyle = "rgba(14, 165, 233, 0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, 128, y + pillH / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          blending: THREE.NormalBlending,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(1.6, 0.4, 1);
        sceneGroup.add(sprite);
        labelSprites.push(sprite);

        // Orbit params
        const orbitRadius = 2.4 + (i % 3) * 0.35;
        const speed = 0.15 + (i % 4) * 0.06;
        const phaseOffset = (i / ORBIT_LABELS.length) * Math.PI * 2;
        const tiltX = (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.25);
        const tiltZ = (i % 3 === 0 ? 1 : -1) * 0.2;

        return { orbitRadius, speed, phaseOffset, tiltX, tiltZ };
      });

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

        // Animate orbiting labels
        labelOrbits.forEach((orbit, i) => {
          const angle = elapsed * orbit.speed + orbit.phaseOffset;
          const lx = Math.cos(angle) * orbit.orbitRadius;
          const lz = Math.sin(angle) * orbit.orbitRadius;
          const ly = Math.sin(angle + orbit.tiltX) * orbit.orbitRadius * 0.35;
          labelSprites[i].position.set(lx, ly, lz);

          // Depth-based opacity fade
          const depthFade = THREE.MathUtils.clamp(
            (lz + orbit.orbitRadius) / (orbit.orbitRadius * 2),
            0.3,
            1,
          );
          labelSprites[i].material.opacity = depthFade;
        });

        // Subtle atmosphere pulse
        atmosSphere.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.04);

        renderer.render(scene, camera);
      };
      animate();

      // Resize handler — keep canvas oversized
      const onResize = () => {
        if (!container || disposed) return;
        const w = Math.round(container.clientWidth * OVERFLOW_SCALE);
        const h = Math.round(container.clientHeight * OVERFLOW_SCALE);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
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
        labelSprites.forEach((s) => {
          s.material.map?.dispose();
          s.material.dispose();
        });
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      disposed = true;
      if ((container as any).__cleanup) {
        (container as any).__cleanup();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[350px] sm:h-[420px] lg:h-[620px] overflow-visible"
      aria-hidden
    />
  );
}

function HeroCubeInner() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [webGL] = useState(() => hasWebGL());

  if (isMobile || !webGL || prefersReducedMotion) {
    return <CSSFallback />;
  }

  return <PlanetSphere />;
}

export const HeroCube = memo(HeroCubeInner);
export default HeroCube;
