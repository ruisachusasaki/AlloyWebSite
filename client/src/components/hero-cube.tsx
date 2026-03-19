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
    <div className="flex items-center justify-center w-full h-[280px] sm:h-[320px] relative" aria-hidden>
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

/** Three.js particle constellation sphere with orbiting text labels */
function ParticleConstellation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;
    let animId: number;

    import("three").then((THREE) => {
      if (disposed || !container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 5.5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const primaryColor = new THREE.Color("hsl(199, 89%, 48%)");
      const accentColor = new THREE.Color("hsl(280, 70%, 60%)");

      // ── Particles on sphere surface ──
      const PARTICLE_COUNT = 600;
      const SPHERE_RADIUS = 1.6;
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      const sizes = new Float32Array(PARTICLE_COUNT);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Fibonacci sphere for even distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        // Add slight randomness to radius
        const r = SPHERE_RADIUS * (0.9 + Math.random() * 0.2);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Mix primary and accent colors
        const mixFactor = Math.random();
        const color = primaryColor.clone().lerp(accentColor, mixFactor * 0.4);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = 1.5 + Math.random() * 2.5;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      // Custom particle texture — soft glow circle
      const particleCanvas = document.createElement("canvas");
      particleCanvas.width = 64;
      particleCanvas.height = 64;
      const pCtx = particleCanvas.getContext("2d")!;
      const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.6)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      pCtx.fillStyle = gradient;
      pCtx.fillRect(0, 0, 64, 64);
      const particleTexture = new THREE.CanvasTexture(particleCanvas);

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.04,
        map: particleTexture,
        transparent: true,
        opacity: 0.85,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // ── Connection lines between nearby particles ──
      const linePositions: number[] = [];
      const lineColors: number[] = [];
      const CONNECTION_DIST = 0.55;
      const MAX_CONNECTIONS = 400;
      let connectionCount = 0;

      for (let i = 0; i < PARTICLE_COUNT && connectionCount < MAX_CONNECTIONS; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && connectionCount < MAX_CONNECTIONS; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < CONNECTION_DIST) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
            const alpha = 1 - dist / CONNECTION_DIST;
            lineColors.push(
              primaryColor.r, primaryColor.g, primaryColor.b,
              primaryColor.r * alpha, primaryColor.g * alpha, primaryColor.b * alpha
            );
            connectionCount++;
          }
        }
      }

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lines);

      // ── Central glow sphere ──
      const glowGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
      });
      const glowSphere = new THREE.Mesh(glowGeo, glowMat);
      scene.add(glowSphere);

      // ── Orbiting text labels as sprites ──
      const labelSprites: InstanceType<typeof THREE.Sprite>[] = [];
      const labelOrbits = ORBIT_LABELS.map((label, i) => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext("2d")!;

        // Rounded pill background
        const pillW = ctx.measureText(label).width; // approximate
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
        scene.add(sprite);
        labelSprites.push(sprite);

        // Orbit params — each label has different orbit plane and speed
        const orbitRadius = 2.2 + (i % 3) * 0.35;
        const speed = 0.15 + (i % 4) * 0.06;
        const phaseOffset = (i / ORBIT_LABELS.length) * Math.PI * 2;
        // Tilt the orbit plane
        const tiltX = (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.25);
        const tiltZ = (i % 3 === 0 ? 1 : -1) * 0.2;

        return { orbitRadius, speed, phaseOffset, tiltX, tiltZ };
      });

      // ── Group for rotation ──
      const mainGroup = new THREE.Group();
      mainGroup.add(particles);
      mainGroup.add(lines);
      mainGroup.add(glowSphere);
      scene.add(mainGroup);

      // Mouse parallax
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      // Target rotation for smooth lerp
      let targetRotX = 0;
      let targetRotY = 0;

      const clock = new THREE.Clock();

      const animate = () => {
        if (disposed) return;
        animId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Slow auto-rotation
        mainGroup.rotation.y += 0.002;
        mainGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

        // Mouse parallax — smooth lerp
        targetRotX = mouseY * 0.3;
        targetRotY = mouseX * 0.4;
        mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.03;
        mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.03;

        // Animate orbiting labels
        labelOrbits.forEach((orbit, i) => {
          const angle = elapsed * orbit.speed + orbit.phaseOffset;
          const x = Math.cos(angle) * orbit.orbitRadius;
          const z = Math.sin(angle) * orbit.orbitRadius;
          const y = Math.sin(angle + orbit.tiltX) * orbit.orbitRadius * 0.35;
          labelSprites[i].position.set(x, y, z);

          // Fade based on z depth (further away = more transparent)
          const depthFade = THREE.MathUtils.clamp((z + orbit.orbitRadius) / (orbit.orbitRadius * 2), 0.3, 1);
          labelSprites[i].material.opacity = depthFade;
        });

        // Subtle particle size pulsing via glow sphere
        glowSphere.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.1);

        renderer.render(scene, camera);
      };
      animate();

      // Resize handler
      const onResize = () => {
        if (!container || disposed) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
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
        particleGeometry.dispose();
        particleMaterial.dispose();
        particleTexture.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
        glowGeo.dispose();
        glowMat.dispose();
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
      className="w-full h-[280px] sm:h-[350px] lg:h-[420px]"
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

  return <ParticleConstellation />;
}

export const HeroCube = memo(HeroCubeInner);
export default HeroCube;
