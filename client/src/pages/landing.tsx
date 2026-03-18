import React, { useState, useEffect, useRef, useContext, useCallback, Suspense } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { SchedulingModal } from "@/components/scheduling-modal";
import { SharedNavbar, SharedFooter } from "@/components/shared-layout";
import { SchedulingContext } from "@/context/scheduling-context";
import {
  ArrowRight,
  Zap,
  Shield,
  RefreshCw,
  DollarSign,
  ChevronDown,
  Layers,
  Building2,
  TrendingUp,
  Briefcase,
  ExternalLink,
  Home,
  Mic,
  Cloud,
  Sparkles,
  MessageSquare,
  Bot,
  Check,
  X,
  Send,
  Lock,
  Rocket,
  ShoppingCart,
  Globe,
  Star
} from "lucide-react";
import {
  SiNotion, SiZapier, SiAirtable, SiGooglesheets, SiHubspot, SiTrello, SiClickup, SiSlack,
  SiWhatsapp, SiAsana, SiGooglemeet, SiZoom, SiSap, SiTwilio, SiSalesforce, SiMailchimp,
  SiShopify, SiWordpress, SiTelegram, SiGmail, SiGooglecalendar, SiStripe
} from "react-icons/si";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const TubesCursorBackground = React.lazy(() => import("@/components/tubes-cursor-background"));
import darwinLogo from "@assets/darwin-ai-logo_1769368824707.png";
import meliLogo from "@assets/image_1769370076739.png";
import tokkoLogo from "@assets/tokko_broker_logo_(1)_1_1769369724733.png";
import alloyLogo from "@assets/Alloy_Logo_1770503010900.png";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  );
}


function MagneticButton({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.15);
      y.set((e.clientY - centerY) * 0.15);
    },
    [prefersReducedMotion, x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

function SectionNumber({ number }: { number: string }) {
  return <span className="section-number">{number}</span>;
}

function GhostText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`ghost-text left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ${className}`} aria-hidden>
      {text}
    </div>
  );
}

function AnimatedSectionTitle({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={prefersReducedMotion ? false : { y: "100%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : undefined}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function HeroSection({ onScheduleClick }: { onScheduleClick: () => void }) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Rotating highlight words
  const highlights = [
    t("hero.rotating.0"),
    t("hero.rotating.1"),
    t("hero.rotating.2"),
    t("hero.rotating.3"),
    t("hero.rotating.4"),
    t("hero.rotating.5"),
  ];
  const [highlightIndex, setHighlightIndex] = useState(0);

  // Rotating badge chips — each is a complete, self-sized unit with its own icon & color
  const badgeChips = [
    { icon: ShoppingCart, key: "hero.badge.ecommerce", className: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" },
    { icon: Globe, key: "hero.badge.website", className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
    { icon: Zap, key: "hero.badge.platform", className: "bg-primary/10 border-primary/20 text-primary" },
    { icon: Layers, key: "hero.badge.crm", className: "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400" },
  ];
  const [badgeIndex, setBadgeIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % highlights.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [highlights.length, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % badgeChips.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [badgeChips.length, prefersReducedMotion]);

  // Mouse tracking for floating orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [prefersReducedMotion, mouseX, mouseY],
  );

  // Orb parallax transforms
  const orb1X = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const orb1Y = useTransform(mouseY, [-0.5, 0.5], [-30, 30]);
  const orb2X = useTransform(mouseX, [-0.5, 0.5], [30, -30]);
  const orb2Y = useTransform(mouseY, [-0.5, 0.5], [25, -25]);
  const orb3X = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const orb3Y = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  // Scroll-based parallax exit
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Split headline into words for stagger animation
  const titleWords = t("hero.title.line1").split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern"
      onMouseMove={handleMouseMove}
    >
      <Suspense fallback={null}>
        <TubesCursorBackground />
      </Suspense>
      {/* Floating gradient orbs — track mouse with parallax */}
      <motion.div
        className="absolute rounded-full pointer-events-none w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
        style={{
          x: prefersReducedMotion ? 0 : orb1X,
          y: prefersReducedMotion ? 0 : orb1Y,
          top: "10%",
          left: "5%",
          background:
            "radial-gradient(circle, hsl(199 89% 48% / 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
        style={{
          x: prefersReducedMotion ? 0 : orb2X,
          y: prefersReducedMotion ? 0 : orb2Y,
          top: "50%",
          right: "5%",
          background:
            "radial-gradient(circle, hsl(280 70% 55% / 0.08) 0%, hsl(199 89% 48% / 0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none w-[250px] h-[250px] md:w-[400px] md:h-[400px]"
        style={{
          x: prefersReducedMotion ? 0 : orb3X,
          y: prefersReducedMotion ? 0 : orb3Y,
          bottom: "10%",
          left: "30%",
          background:
            "radial-gradient(circle, hsl(199 89% 48% / 0.06) 0%, hsl(160 60% 50% / 0.04) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32 text-center">
        {/* Badge — parallax exits fastest */}
        <motion.div
          style={
            !prefersReducedMotion
              ? { y: badgeY, opacity: badgeOpacity }
              : undefined
          }
          className="mb-5"
        >
          <AnimatePresence mode="wait">
            {(() => {
              const BadgeIcon = badgeChips[badgeIndex].icon;
              return (
                <motion.span
                  key={badgeIndex}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium font-mono ${badgeChips[badgeIndex].className}`}
                >
                  <BadgeIcon className="w-4 h-4" />
                  {t(badgeChips[badgeIndex].key)}
                </motion.span>
              );
            })()}
          </AnimatePresence>
        </motion.div>

        {/* Split-text headline — words slide up one-by-one from clip masks */}
        <motion.div
          style={
            !prefersReducedMotion
              ? { y: titleY, opacity: titleOpacity }
              : undefined
          }
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.05] mb-8 heading-glow" style={{ letterSpacing: "-0.02em" }}>
            {titleWords.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom pb-1"
              >
                <motion.span
                  className={`inline-block pr-[0.3em] ${word.length >= 5 ? "font-heavy" : ""}`}
                  initial={prefersReducedMotion ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}

            {/* Rotating highlight with gradient shimmer */}
            <motion.span
              className="block h-[1.2em] relative overflow-hidden mt-1"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={highlightIndex}
                  className="gradient-text-animated absolute inset-x-0"
                  initial={
                    prefersReducedMotion ? false : { y: "100%" }
                  }
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {highlights[highlightIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle — lingers slightly longer on scroll */}
        <motion.div
          style={
            !prefersReducedMotion
              ? { y: subtitleY, opacity: subtitleOpacity }
              : undefined
          }
        >
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>

        {/* CTA buttons — fade last on scroll, magnetic primary button */}
        <motion.div
          style={
            !prefersReducedMotion
              ? { y: ctaY, opacity: 1 }
              : undefined
          }
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Button
                  size="lg"
                  className="text-lg font-bold shimmer-btn glow-border shadow-lg shadow-primary/25 w-full sm:w-auto"
                  onClick={() => onScheduleClick()}
                  data-testid="button-cta-hero"
                >
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </MagneticButton>
              <Link href="/build">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg font-bold w-full sm:w-auto"
                  data-testid="button-cta-hero-build"
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <span className="text-muted-foreground text-sm opacity-70">
              {t("hero.noCommitment")}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function ChaosIcon({
  app,
  progress,
  index,
  prefersReducedMotion,
  scaleFactor,
  isTouchDevice
}: {
  app: { icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; imageSrc?: string; name: string; color: string; x: number; y: number; rotate: number; scale: number; zIndex: number; iconSize: string; useThemeColor?: boolean };
  progress: any;
  index: number;
  prefersReducedMotion: boolean | null;
  scaleFactor: number;
  isTouchDevice: boolean;
}) {
  const sx = app.x * scaleFactor;
  const sy = app.y * scaleFactor;

  const x = useTransform(
    progress,
    prefersReducedMotion ? [0, 0.7, 0.71, 1] : [0, 0.15, 0.5, 0.85, 1],
    prefersReducedMotion ? [sx, sx, 0, 0] : [sx, sx * 0.85, sx * 0.4, sx * 0.05, 0]
  );
  const y = useTransform(
    progress,
    prefersReducedMotion ? [0, 0.7, 0.71, 1] : [0, 0.15, 0.5, 0.85, 1],
    prefersReducedMotion ? [sy, sy, 0, 0] : [sy, sy * 0.85, sy * 0.4, sy * 0.05, 0]
  );
  const rotate = useTransform(
    progress,
    prefersReducedMotion ? [0, 0.7, 0.71, 1] : [0, 0.4, 0.85, 1],
    prefersReducedMotion ? [app.rotate, app.rotate, 0, 0] : [app.rotate, app.rotate * 0.5, app.rotate * 0.1, 0]
  );
  const scale = useTransform(
    progress,
    prefersReducedMotion ? [0, 0.7, 0.71, 1] : [0, 0.6, 0.85, 1],
    prefersReducedMotion ? [app.scale, app.scale, 0, 0] : [app.scale, app.scale, 0.6, 0]
  );
  const opacity = useTransform(
    progress,
    prefersReducedMotion ? [0, 0.7, 0.71, 1] : [0, 0.7, 0.9, 1],
    prefersReducedMotion ? [1, 1, 0, 0] : [1, 1, 0.4, 0]
  );

  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 ${isTouchDevice ? '' : 'cursor-grab active:cursor-grabbing'}`}
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        translateX: "-50%",
        translateY: "-50%",
        zIndex: app.zIndex,
      }}
      drag={!isTouchDevice}
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.3}
      whileHover={isTouchDevice ? undefined : { scale: app.scale * 1.15, zIndex: 100 }}
      whileTap={isTouchDevice ? undefined : { scale: app.scale * 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }}
    >
      <div className={`flex flex-col items-center ${app.imageSrc ? 'gap-0' : 'gap-1'}`}>
        {app.imageSrc ? (
          <img
            src={app.imageSrc}
            alt={app.name}
            className={app.iconSize}
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        ) : app.icon ? (
          <app.icon
            className={`${app.iconSize} ${app.useThemeColor ? 'text-foreground' : ''}`}
            style={{ color: app.useThemeColor ? undefined : app.color, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        ) : null}
        <span className="hidden md:block text-[10px] text-muted-foreground font-medium whitespace-nowrap">{app.name}</span>
      </div>
    </motion.div>
  );
}

function SpaghettiChaosSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [scaleFactor, setScaleFactor] = useState(1);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScaleFactor(Math.min(1, entry.contentRect.width / 800));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const chaosApps = [
    // Row 1 - Top far (5 icons)
    { icon: SiNotion, name: "Notion", color: "", x: -320, y: -190, rotate: -8, scale: 1.0, zIndex: 5, iconSize: "w-8 h-8 md:w-10 md:h-10", useThemeColor: true },
    { icon: SiZapier, name: "Zapier", color: "#FF4A00", x: -160, y: -200, rotate: 5, scale: 1.0, zIndex: 6, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiGmail, name: "Gmail", color: "#EA4335", x: 0, y: -195, rotate: -3, scale: 1.0, zIndex: 25, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiAirtable, name: "Airtable", color: "#18BFFF", x: 160, y: -200, rotate: 12, scale: 1.0, zIndex: 4, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiShopify, name: "Shopify", color: "#96BF48", x: 320, y: -190, rotate: -5, scale: 1.0, zIndex: 20, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    // Row 2 - Upper middle (6 icons)
    { icon: SiGooglesheets, name: "Sheets", color: "#0F9D58", x: -340, y: -110, rotate: -15, scale: 1.0, zIndex: 7, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiHubspot, name: "HubSpot", color: "#FF7A59", x: -200, y: -120, rotate: 8, scale: 1.0, zIndex: 8, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiGooglecalendar, name: "Calendar", color: "#4285F4", x: -60, y: -125, rotate: -6, scale: 1.0, zIndex: 26, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiWordpress, name: "WordPress", color: "#21759B", x: 60, y: -125, rotate: 4, scale: 1.0, zIndex: 21, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiTrello, name: "Trello", color: "#0079BF", x: 200, y: -120, rotate: -10, scale: 1.0, zIndex: 9, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiClickup, name: "ClickUp", color: "#7B68EE", x: 340, y: -110, rotate: 18, scale: 1.0, zIndex: 3, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    // Row 3 - Center row (6 icons)
    { icon: SiSlack, name: "Slack", color: "#4A154B", x: -320, y: -10, rotate: -12, scale: 1.0, zIndex: 10, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiWhatsapp, name: "WhatsApp", color: "#25D366", x: -180, y: 10, rotate: 6, scale: 1.0, zIndex: 11, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiStripe, name: "Stripe", color: "#635BFF", x: -40, y: 5, rotate: -4, scale: 1.0, zIndex: 27, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiTelegram, name: "Telegram", color: "#0088CC", x: 40, y: 5, rotate: 3, scale: 1.0, zIndex: 22, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { imageSrc: tokkoLogo, name: "Tokko", color: "#FF6B35", x: 180, y: 10, rotate: -8, scale: 1.0, zIndex: 12, iconSize: "w-16 h-auto md:w-20" },
    { imageSrc: meliLogo, name: "MercadoLibre", color: "#FFE600", x: 320, y: -10, rotate: 15, scale: 1.0, zIndex: 2, iconSize: "w-10 h-auto md:w-12" },
    // Row 4 - Lower middle (5 icons)
    { icon: SiAsana, name: "Asana", x: -320, y: 100, rotate: 10, scale: 1.0, zIndex: 13, iconSize: "w-8 h-8 md:w-10 md:h-10", color: "#F06A6A" },
    { icon: SiGooglemeet, name: "Meet", color: "#00897B", x: -160, y: 110, rotate: -5, scale: 1.0, zIndex: 14, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: Cloud, name: "Tiendanube", color: "#2E86AB", x: 0, y: 120, rotate: 7, scale: 1.0, zIndex: 23, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiZoom, name: "Zoom", color: "#2D8CFF", x: 160, y: 110, rotate: 8, scale: 1.0, zIndex: 15, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiSap, name: "SAP", color: "#0FAAFF", x: 320, y: 100, rotate: -12, scale: 1.0, zIndex: 1, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    // Row 5 - Bottom far (5 icons)
    { icon: SiTwilio, name: "Twilio", color: "#F22F46", x: -300, y: 180, rotate: -6, scale: 1.0, zIndex: 16, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiSalesforce, name: "Salesforce", color: "#00A1E0", x: -100, y: 190, rotate: 10, scale: 1.0, zIndex: 17, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { imageSrc: darwinLogo, name: "Darwin", color: "#6366F1", x: 100, y: 190, rotate: -8, scale: 1.0, zIndex: 24, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: SiMailchimp, name: "Mailchimp", color: "#FFE01B", x: 300, y: 180, rotate: -15, scale: 1.0, zIndex: 18, iconSize: "w-8 h-8 md:w-10 md:h-10" },
    { icon: Mic, name: "Fathom", color: "#8B5CF6", x: 220, y: -55, rotate: 5, scale: 1.0, zIndex: 19, iconSize: "w-8 h-8 md:w-10 md:h-10" },
  ];

  const unifiedOpacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 0.5, 1]);
  const unifiedScale = useTransform(scrollYProgress, [0.75, 0.88, 0.94, 1], [0.5, 0.85, 1.06, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 0.8]);
  const ringOpacity = useTransform(scrollYProgress, [0.88, 0.92, 1], [0, 1, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.9, 1], [30, 0]);

  const chaosTextOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);

  return (
    <section id="problem" ref={containerRef} className="relative md:mt-24 h-[160vh] md:h-[200vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-start md:justify-center overflow-x-hidden pt-12 md:pt-0 gap-4 md:gap-8"
      >
        <motion.div
          className="text-center mb-4 md:mb-8 px-6"
          style={{ opacity: chaosTextOpacity }}
        >
          <SectionNumber number="01" />
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 section-title heading-glow">
            {t("chaos.title.line1")}{" "}
            <span className="text-destructive">{t("chaos.title.highlight")}</span> {t("chaos.title.line2")}
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("chaos.subtitle")}
          </p>
        </motion.div>

        <div className="relative w-full max-w-6xl h-[420px] sm:h-[520px] md:h-[700px] flex items-center justify-center">
          <div className="relative w-full h-full">
            {chaosApps.map((app, i) => (
              <ChaosIcon key={app.name} app={app} progress={scrollYProgress} index={i} prefersReducedMotion={prefersReducedMotion} scaleFactor={scaleFactor} isTouchDevice={isTouchDevice} />
            ))}
          </div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: unifiedOpacity, scale: unifiedScale }}
          >
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{
                opacity: glowOpacity,
                background: "radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)",
                filter: "blur(60px)"
              }}
            />
            <motion.div
              className="absolute w-44 h-44 md:w-56 md:h-56 rounded-3xl border-2 border-primary/40"
              style={{
                opacity: ringOpacity,
                animation: prefersReducedMotion ? "none" : "pulse-ring 1s ease-out forwards"
              }}
            />

            <div className="relative" data-testid="icon-unified-platform">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl border border-primary/30">
                <img src={alloyLogo} alt="Alloy" className="w-20 h-20 md:w-28 md:h-28 object-contain brightness-0 invert drop-shadow-md" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-0 w-full text-center whitespace-normal md:whitespace-nowrap px-4"
            style={{ opacity: headlineOpacity, y: headlineY }}
            data-testid="text-unified-headline"
          >
            <h3 className="text-2xl md:text-4xl font-black text-foreground mb-2">
              {t("chaos.unified.title")} <span className="text-primary">{t("chaos.unified.highlight")}</span>
            </h3>
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-0 w-full text-center px-4 pointer-events-none"
            style={{ opacity: chaosTextOpacity }}
          >
            <p className="text-destructive font-semibold text-sm md:text-base">{t("chaos.subscriptions")}</p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: chaosTextOpacity }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: 3, ease: "easeInOut" }}
            className="text-muted-foreground text-xs flex flex-col items-center gap-1"
          >
            <span>{t("chaos.scroll")}</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BentoGridSection() {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const { openScheduling } = useContext(SchedulingContext);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <section id="solution" className="py-8 md:py-32 relative overflow-hidden">
      <GhostText text="SOLUTION" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionNumber number="02" />
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 px-4 section-title heading-glow">
            {t("bento.title.line1")} <span className="text-primary">{t("bento.title.highlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("bento.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Primary Card 1: Infinite Evolution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="bento-card md:col-span-2 md:row-span-2 p-8 md:p-10"
            onMouseMove={handleMouseMove}
            ref={cardRef}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Rocket className="w-7 h-7 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">
              {t("bento.evolution.title")}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t("bento.evolution.description")} <span className="text-foreground font-semibold">{t("bento.evolution.descriptionHighlight")}</span>{t("bento.evolution.descriptionEnd")}
            </p>

            {/* Feature Request → Live Feature Animation */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <motion.div
                className="w-full md:flex-1 p-4 rounded-xl bg-muted/50 border border-border"
                initial={{ x: 0 }}
                whileInView={{ x: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("bento.evolution.requestLabel")}</span>
                </div>
                <p className="text-sm font-medium">{t("bento.evolution.requestExample")}</p>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-6 h-6 text-primary rotate-90 md:rotate-0" />
              </motion.div>

              <motion.div
                className="w-full md:flex-1 p-4 rounded-xl bg-primary/10 border border-primary/20"
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">{t("bento.evolution.liveLabel")}</span>
                </div>
                <p className="text-sm font-medium">{t("bento.evolution.liveExample")}</p>
              </motion.div>
            </div>

            <p className="text-sm text-primary font-semibold mt-6">
              {t("bento.evolution.tagline")}
            </p>
          </motion.div>

          {/* Primary Card 2: Context-Aware AI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bento-card md:row-span-2 p-8 bg-gradient-to-br from-card via-card to-primary/5"
            onMouseMove={handleMouseMove}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">{t("bento.ai.title")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("bento.ai.description")} <span className="text-foreground font-medium">{t("bento.ai.descriptionHighlight")}</span>.
            </p>

            {/* Mini Chat Preview */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <span className="text-muted-foreground">{t("bento.ai.chatYou")}</span>
                <p className="mt-1">{t("bento.ai.chatQuestion")}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-primary">{t("bento.ai.chatAI")}</span>
                <p className="mt-1">{t("bento.ai.chatAnswer")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>{t("bento.ai.privacy")}</span>
            </div>
          </motion.div>

          {/* Supporting Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bento-card p-8"
            onMouseMove={handleMouseMove}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("bento.integration.title")}</h3>
            <p className="text-muted-foreground">
              {t("bento.integration.description")} <span className="text-foreground font-semibold">{t("bento.integration.descriptionHighlight")}</span>{t("bento.integration.descriptionEnd")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bento-card p-8"
            onMouseMove={handleMouseMove}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("bento.maintenance.title")}</h3>
            <p className="text-muted-foreground">
              {t("bento.maintenance.description")}
            </p>
          </motion.div>

          {/* Pricing Card REMOVED - Replaced by dedicated section */}
        </div>
      </div>
    </section>
  );
}

function CountUpPrice({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  const match = text.match(/\$([\d.,]+)/);
  const rawMatch = match ? match[1] : null;
  const targetNumber = rawMatch ? parseInt(rawMatch.replace(/[.,]/g, "")) : 0;
  const usesPeriodSep = rawMatch ? /\d\.\d{3}/.test(rawMatch) : false;

  useEffect(() => {
    if (!isInView || !targetNumber) return;
    const duration = 1400;
    const steps = 50;
    const increment = targetNumber / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, targetNumber]);

  const fmt = (n: number) =>
    usesPeriodSep ? n.toLocaleString("de-DE") : n.toLocaleString("en-US");

  const displayText =
    targetNumber > 0
      ? text.replace(/\$[\d.,]+/, `$${fmt(isInView ? count : 0)}`)
      : text;

  return (
    <div ref={ref} className={className}>
      {displayText}
    </div>
  );
}

interface PricingPlan {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  subtitle: string;
  description: string;
  priceSetup: string;
  priceMonthly: string;
  popular: boolean;
  features: string[];
  goal: string;
  color: string;
  auroraGradient: string;
  borderHover: string;
  shadowHover: string;
}

function PricingCard({ plan, index, openScheduling, ctaText, popularText }: {
  plan: PricingPlan;
  index: number;
  openScheduling: (title: string) => void;
  ctaText: string;
  popularText: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const rafRef = useRef<number>(0);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
      setTilt({
        rotateX: ((50 - y) / 50) * 8,
        rotateY: ((x - 50) / 50) * 8,
      });
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setMousePos({ x: 50, y: 50 });
  }, []);

  const orbConfigs = [
    { size: 10, x: "20%", y: "30%", duration: 6, delay: index * 0.5 },
    { size: 8, x: "75%", y: "60%", duration: 8, delay: index * 0.5 + 1 },
    { size: 12, x: "50%", y: "80%", duration: 7, delay: index * 0.5 + 2 },
  ];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative p-8 md:p-10 rounded-xl group flex flex-col backdrop-blur-sm"
      style={{
        background: isHovered ? "hsl(var(--card) / 0.8)" : "hsl(var(--card) / 0.5)",
        border: plan.popular
          ? `1px solid ${isHovered ? plan.borderHover : "hsl(199, 89%, 48%, 0.35)"}`
          : `1px solid ${isHovered ? plan.borderHover : `rgba(${plan.color}, 0.2)`}`,
        boxShadow: isHovered
          ? plan.shadowHover
          : plan.popular
            ? "0 0 40px hsl(199, 89%, 48%, 0.08), 0 0 80px hsl(199, 89%, 48%, 0.04)"
            : `0 0 30px rgba(${plan.color}, 0.06), 0 0 60px rgba(${plan.color}, 0.03)`,
        transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(${isHovered ? -6 : 0}px)`,
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Effects container — clipped to card bounds */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        {/* Aurora gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: plan.auroraGradient,
            opacity: isHovered ? 0.8 : 0.3,
            transition: "opacity 0.6s ease",
            animation: "aurora 12s ease-in-out infinite",
          }}
        />

        {/* Mouse-tracking light spot */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(${plan.color}, ${isHovered ? 0.15 : 0}), transparent 50%)`,
            transition: isHovered ? "background 0.1s ease" : "background 0.5s ease",
          }}
        />

        {/* Floating glow orbs */}
        {orbConfigs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: `rgba(${plan.color}, 0.6)`,
              boxShadow: `0 0 ${orb.size * 2}px rgba(${plan.color}, 0.4), 0 0 ${orb.size * 4}px rgba(${plan.color}, 0.2)`,
              filter: `blur(${orb.size / 3}px)`,
              animation: `${i % 2 === 0 ? "float-orb" : "float-orb-reverse"} ${orb.duration}s ease-in-out infinite`,
              animationDelay: `${orb.delay}s`,
              opacity: isHovered ? 1 : 0.4,
              transition: "opacity 0.5s ease",
            }}
          />
        ))}
      </div>

      {/* Popular badge — outside overflow-hidden via z-20 */}
      {plan.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md text-xs font-bold uppercase tracking-wider z-20 text-primary-foreground flex items-center gap-1.5"
          style={{
            background: "hsl(199, 89%, 48%)",
          }}
        >
          <Star className="w-3.5 h-3.5" fill="currentColor" />
          {popularText}
        </div>
      )}

      {/* Content layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-8"
          style={{
            border: `1px solid ${isHovered ? `rgba(${plan.color}, 0.25)` : "hsl(var(--border) / 0.3)"}`,
            transition: "border-color 0.5s ease",
          }}
        >
          <plan.icon
            className={`w-6 h-6 transition-colors duration-500 ${!isHovered ? "text-muted-foreground" : ""}`}
            style={{ color: isHovered ? `rgba(${plan.color}, 0.9)` : undefined }}
          />
        </div>

        {/* Title block */}
        <div className="mb-8">
          <h3
            className="text-2xl sm:text-3xl xl:text-4xl font-black text-foreground mb-2 break-words"
            style={{ letterSpacing: "-0.03em" }}
          >
            {plan.title}
          </h3>
          <p
            className="font-bold text-sm uppercase mb-4 font-mono"
            style={{ color: "hsl(199, 89%, 48%)", letterSpacing: "0.08em" }}
          >
            {plan.subtitle}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm mb-3 text-muted-foreground">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "hsl(199, 89%, 48%)" }}
            />
            {plan.priceSetup}
          </div>
          <CountUpPrice
            text={plan.priceMonthly}
            className="text-3xl md:text-4xl font-black text-foreground"
          />
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: "hsl(var(--border) / 0.3)" }} />

        {/* Features */}
        <div className="space-y-4 mb-10 flex-1">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <Check
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: "hsl(199, 89%, 48%)" }}
              />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
          {plan.excludedFeatures?.map((feature, i) => (
            <div key={`excluded-${i}`} className="flex items-start gap-3 text-sm">
              <X
                className="w-4 h-4 shrink-0 mt-0.5 text-destructive"
              />
              <span className="text-muted-foreground line-through opacity-50">{feature}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <p
            className="text-xs font-medium text-center mb-5 italic text-muted-foreground"
          >
            "{plan.goal}"
          </p>
          <Button
            size="lg"
            className={`w-full font-bold text-white ${plan.popular ? "shimmer-btn" : ""}`}
            style={{
              background: `rgba(${plan.color}, 0.9)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${plan.color}, 1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `rgba(${plan.color}, 0.9)`;
            }}
            onClick={() => openScheduling(plan.title)}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function PricingSection() {
  const { t } = useLanguage();
  const { openScheduling } = useContext(SchedulingContext);

  const plans = [
    {
      id: "ecommerce",
      icon: ShoppingCart,
      title: t("pricing.ecommerce.title"),
      subtitle: t("pricing.ecommerce.subtitle"),
      description: t("pricing.ecommerce.description"),
      priceSetup: t("pricing.ecommerce.price.setup"),
      priceMonthly: t("pricing.ecommerce.price.monthly"),
      popular: false,
      features: [
        t("pricing.ecommerce.feature1"),
        t("pricing.ecommerce.feature2"),
        t("pricing.ecommerce.feature3"),
        t("pricing.ecommerce.feature4")
      ],
      excludedFeatures: [
        t("pricing.ecommerce.excluded1"),
        t("pricing.ecommerce.excluded2"),
        t("pricing.ecommerce.excluded3")
      ],
      goal: t("pricing.ecommerce.goal"),
      color: "245, 180, 60",
      auroraGradient: "radial-gradient(ellipse at 30% 20%, rgba(245, 180, 60, 0.08), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255, 120, 50, 0.06), transparent 50%)",

      borderHover: "rgba(245, 180, 60, 0.35)",
      shadowHover: "0 0 50px rgba(245, 180, 60, 0.12), 0 0 100px rgba(245, 180, 60, 0.06)",
    },
    {
      id: "premium",
      icon: TrendingUp,
      title: t("pricing.premium.title"),
      subtitle: t("pricing.premium.subtitle"),
      description: t("pricing.premium.description"),
      priceSetup: t("pricing.premium.price.setup"),
      priceMonthly: t("pricing.premium.price.monthly"),
      popular: true,
      features: [
        t("pricing.premium.feature1"),
        t("pricing.premium.feature2"),
        t("pricing.premium.feature3"),
        t("pricing.premium.feature4")
      ],
      goal: t("pricing.premium.goal"),
      color: "14, 165, 233",
      auroraGradient: "radial-gradient(ellipse at 40% 10%, hsl(199, 89%, 48%, 0.12), transparent 50%), radial-gradient(ellipse at 60% 90%, hsl(199, 89%, 60%, 0.08), transparent 50%)",

      borderHover: "hsl(199, 89%, 48%, 0.5)",
      shadowHover: "0 0 60px hsl(199, 89%, 48%, 0.2), 0 0 120px hsl(199, 89%, 48%, 0.08)",
    },
    {
      id: "enterprise",
      icon: Building2,
      title: t("pricing.enterprise.title"),
      subtitle: t("pricing.enterprise.subtitle"),
      description: t("pricing.enterprise.description"),
      priceSetup: t("pricing.enterprise.price.setup"),
      priceMonthly: t("pricing.enterprise.price.monthly"),
      popular: false,
      features: [
        t("pricing.enterprise.feature1"),
        t("pricing.enterprise.feature2"),
        t("pricing.enterprise.feature3"),
        t("pricing.enterprise.feature4")
      ],
      goal: t("pricing.enterprise.goal"),
      color: "160, 120, 255",
      auroraGradient: "radial-gradient(ellipse at 60% 20%, rgba(160, 120, 255, 0.08), transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(120, 80, 220, 0.06), transparent 50%)",

      borderHover: "rgba(160, 120, 255, 0.35)",
      shadowHover: "0 0 50px rgba(160, 120, 255, 0.12), 0 0 100px rgba(160, 120, 255, 0.06)",
    }
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden bg-background">
      <GhostText text="PRICING" />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <SectionNumber number="03" />
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium mb-8 font-mono" style={{ color: "hsl(199, 89%, 48%)" }}>
            <DollarSign className="w-4 h-4" />
            {t("nav.pricing")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground mb-6 section-title heading-glow" style={{ letterSpacing: "0.05em" }}>
            {t("pricing.title")}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10" style={{ perspective: "1200px" }}>
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              index={index}
              openScheduling={openScheduling}
              ctaText={t("pricing.cta")}
              popularText={t("pricing.popular")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AIPartnerSection() {
  const { t } = useLanguage();

  return (
    <section className="py-32 relative overflow-hidden">
      <GhostText text="AI" className="opacity-[0.02]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionNumber number="04" />
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 font-mono">
              <Bot className="w-4 h-4" />
              {t("ai.badge")}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 section-title heading-glow" style={{ letterSpacing: "0.05em" }}>
              {t("ai.title.line1")} <span className="text-primary">{t("ai.title.highlight")}</span> {t("ai.title.line2")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("ai.subtitle")} <span className="text-foreground font-semibold">{t("ai.subtitleHighlight")}</span>.
            </p>

            {/* Key Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{t("ai.point1.title")}</h4>
                  <p className="text-muted-foreground text-sm">{t("ai.point1.description")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{t("ai.point2.title")}</h4>
                  <p className="text-muted-foreground text-sm">{t("ai.point2.description")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{t("ai.point3.title")}</h4>
                  <p className="text-muted-foreground text-sm">{t("ai.point3.description")}</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/build">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold text-lg"
                  data-testid="button-cta-ai"
                >
                  {t("ai.cta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Chat Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bento-card p-6 md:p-8 shadow-xl shadow-primary/5">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t("ai.chatHeader")}</h4>
                  <p className="text-xs text-muted-foreground">{t("ai.chatStatus")}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-status-online animate-pulse" />
                  <span className="text-xs text-muted-foreground">{t("ai.chatLive")}</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 font-mono text-sm">
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-3 rounded-2xl rounded-br-md bg-primary text-primary-foreground max-w-[80%]">
                    {t("ai.chatQ1")}
                  </div>
                </motion.div>

                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="p-3 rounded-2xl rounded-bl-md bg-muted/50 border border-border max-w-[85%]">
                    <p className="mb-2">{t("ai.chatA1.intro")}</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li><span className="text-foreground font-medium">Inmobiliaria Luna</span> - $84,500</li>
                      <li><span className="text-foreground font-medium">Propiedades XYZ</span> - $67,200</li>
                      <li><span className="text-foreground font-medium">Casa Capital</span> - $52,100</li>
                    </ol>
                  </div>
                </motion.div>

                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="p-3 rounded-2xl rounded-br-md bg-primary text-primary-foreground max-w-[80%]">
                    {t("ai.chatQ2")}
                  </div>
                </motion.div>

                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="p-3 rounded-2xl rounded-bl-md bg-muted/50 border border-border">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-status-online" />
                      <span>{t("ai.chatA2")}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Input Area */}
              <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border">
                <input
                  type="text"
                  placeholder={t("ai.chatPlaceholder")}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled
                  data-testid="input-ai-chat"
                />
                <Button size="icon" variant="ghost" data-testid="button-ai-send">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div >
    </section >
  );
}

function ComparisonToggleSection() {
  const { t } = useLanguage();
  const [showYourPlatform, setShowYourPlatform] = useState(false);

  return (
    <section className="py-24 bg-card/30 relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <SectionNumber number="05" />
          <h2 className="text-3xl md:text-4xl font-black mb-4 section-title heading-glow">
            {t("comparison.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("comparison.subtitle")}
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="relative inline-flex p-1 rounded-xl bg-muted/50 border border-border">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-primary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: showYourPlatform ? '50%' : '4px',
                right: showYourPlatform ? '4px' : '50%',
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowYourPlatform(false)}
              className={`relative z-10 transition-colors duration-200 ${!showYourPlatform ? 'text-primary-foreground hover:text-primary-foreground hover:bg-transparent' : ''}`}
              data-testid="button-toggle-standard"
            >
              {t("comparison.standardSaas")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowYourPlatform(true)}
              className={`relative z-10 transition-colors duration-200 ${showYourPlatform ? 'text-primary-foreground hover:text-primary-foreground hover:bg-transparent' : ''}`}
              data-testid="button-toggle-platform"
            >
              {t("comparison.yourPlatform")}
            </Button>
          </div>
        </div>

        {/* Comparison Content */}
        <AnimatePresence mode="wait">
          {!showYourPlatform ? (
            <motion.div
              key="standard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="bento-card p-6 opacity-60 border-destructive/10">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <RefreshCw className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold mb-2 text-muted-foreground">{t("comparison.standard.slowUpdates")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.standard.slowUpdatesDesc")}</p>
              </div>
              <div className="bento-card p-6 opacity-60 border-destructive/10">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold mb-2 text-muted-foreground">{t("comparison.standard.staticTools")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.standard.staticToolsDesc")}</p>
              </div>
              <div className="bento-card p-6 opacity-60 border-destructive/10">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold mb-2 text-muted-foreground">{t("comparison.standard.genericAI")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.standard.genericAIDesc")}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="platform"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="bento-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold mb-2">{t("comparison.platform.instantUpdates")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.platform.instantUpdatesDesc")}</p>
              </div>
              <div className="bento-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold mb-2">{t("comparison.platform.livingPlatform")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.platform.livingPlatformDesc")}</p>
              </div>
              <div className="bento-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold mb-2">{t("comparison.platform.integratedAI")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.platform.integratedAIDesc")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-12">
          <Link href="/build">
            <Button
              size="lg"
              className="font-bold shimmer-btn"
              data-testid="button-cta-comparison"
            >
              {t("comparison.cta")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CaseCardMockup({ accentHsl, icon: Icon }: { accentHsl: string; icon: React.ElementType }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative bg-card border border-border">
      {/* Top bar */}
      <div className="h-8 bg-muted/50 flex items-center gap-1.5 px-3">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent-warm/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
        <div className="ml-auto w-20 h-3 rounded bg-muted-foreground/10" />
      </div>
      {/* Dashboard body */}
      <div className="p-4 space-y-3">
        {/* Stat row */}
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 rounded-lg p-3 border border-border bg-background/50">
              <div className="w-8 h-2 rounded bg-muted-foreground/15 mb-2" />
              <div className="w-12 h-4 rounded font-bold" style={{ background: `hsl(${accentHsl} / 0.2)` }} />
            </div>
          ))}
        </div>
        {/* Chart area */}
        <div className="rounded-lg border border-border bg-background/50 p-3 h-24 flex items-end gap-1">
          {[40, 65, 50, 80, 60, 90, 75, 85, 55, 70, 95, 68].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all"
              style={{
                height: `${h}%`,
                background: `hsl(${accentHsl} / ${0.3 + (h / 100) * 0.5})`,
              }}
            />
          ))}
        </div>
        {/* Table rows */}
        <div className="space-y-1.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-3 rounded-lg p-2 bg-background/30">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `hsl(${accentHsl} / 0.15)` }}>
                <Icon className="w-3 h-3 text-foreground/50" />
              </div>
              <div className="flex-1 h-2.5 rounded bg-muted-foreground/10" />
              <div className="w-10 h-2.5 rounded" style={{ background: `hsl(${accentHsl} / 0.2)` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CasesSection() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const portfolioItems = [
    {
      name: "Wealthfit.com",
      category: t("proof.wealthfit.category"),
      description: t("proof.wealthfit.description"),
      icon: DollarSign,
      accentHsl: "199 89% 48%",
      evolutionTag: t("proof.wealthfit.tag"),
      link: "https://wealthfit.com",
      stats: [
        { label: "Features", value: "100+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Users", value: "2.4K" },
      ],
    },
    {
      name: "EventGrowth.app",
      category: t("proof.eventgrowth.category"),
      description: t("proof.eventgrowth.description"),
      icon: TrendingUp,
      accentHsl: "280 70% 55%",
      evolutionTag: t("proof.eventgrowth.tag"),
      link: "https://eventgrowth.app",
      stats: [
        { label: "Features", value: "100+" },
        { label: "Events", value: "850+" },
        { label: "Growth", value: "3.2x" },
      ],
    },
    {
      name: "AgencyBoost.app",
      category: t("proof.agencyboost.category"),
      description: t("proof.agencyboost.description"),
      icon: Briefcase,
      accentHsl: "36 95% 50%",
      evolutionTag: t("proof.agencyboost.tag"),
      link: "https://agencyboost.app",
      stats: [
        { label: "Features", value: "100+" },
        { label: "Hours Saved", value: "60%" },
        { label: "Clients", value: "180+" },
      ],
    },
    {
      name: "DataLight.app",
      category: t("proof.datalight.category"),
      description: t("proof.datalight.description"),
      icon: Layers,
      accentHsl: "160 60% 45%",
      evolutionTag: t("proof.datalight.tag"),
      link: "https://datalight.app",
      stats: [
        { label: "Features", value: "50+" },
        { label: "Dashboards", value: "200+" },
        { label: "Data Sources", value: "25+" },
      ],
    },
  ];

  const totalItems = portfolioItems.length;

  // Desktop: pin section and translate cards horizontally based on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(totalItems - 1) * 100}%`],
  );
  const smoothX = useSpring(rawX, { stiffness: 100, damping: 30, mass: 0.8 });

  // Track active index from scrollYProgress
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.round(v * (totalItems - 1));
      setActiveIndex(Math.min(Math.max(idx, 0), totalItems - 1));
    });
    return unsub;
  }, [scrollYProgress, totalItems]);

  // Mobile: track snap-scroll position
  const handleMobileScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.offsetWidth * 0.85;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(idx, 0), totalItems - 1));
    if (showSwipeHint) setShowSwipeHint(false);
  }, [totalItems, showSwipeHint]);

  // Hide swipe hint after 4s
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Progress bar width
  const progressWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"],
  );

  return (
    <section id="cases" className="relative bg-card/30">
      {/* ── DESKTOP: Sticky horizontal scroll ── */}
      <div ref={sectionRef} className="hidden md:block" style={{ height: `${totalItems * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 z-20 h-[2px] bg-border/30">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/50"
              style={{ width: progressWidth }}
            />
          </div>

          {/* Header */}
          <div className="relative z-10 pt-24 pb-8 px-8 lg:px-16">
            <div className="flex items-end justify-between gap-8">
              <div>
                <SectionNumber number="06" />
                <h2 className="text-5xl lg:text-7xl font-black section-title heading-glow">
                  {t("proof.title")}
                </h2>
              </div>
              <span className="font-mono text-sm text-muted-foreground tracking-wider mb-2 shrink-0">
                [{String(activeIndex + 1).padStart(2, "0")}/{String(totalItems).padStart(2, "0")}]
              </span>
            </div>
            {/* Animated gradient rule */}
            <div className="relative mt-6 h-px bg-border/30 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/60 to-transparent"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {/* Horizontal track */}
          <div className="absolute inset-0 top-[220px] lg:top-[240px]">
            <motion.div
              className="flex h-full"
              style={{ x: prefersReducedMotion ? rawX : smoothX }}
            >
              {portfolioItems.map((item, i) => {
                // Per-card parallax for the mockup
                const cardStart = i / totalItems;
                const cardEnd = (i + 1) / totalItems;
                const mockupX = useTransform(
                  scrollYProgress,
                  [cardStart, cardEnd],
                  [40, -40],
                );

                return (
                  <div
                    key={item.name}
                    className="shrink-0 w-screen px-8 lg:px-16 flex items-start"
                    data-testid={`card-portfolio-${item.name.toLowerCase().replace(".", "-")}`}
                  >
                    <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">
                      {/* Left: Mockup (55%) */}
                      <motion.div
                        className="lg:w-[55%] shrink-0 relative group"
                        style={{ x: prefersReducedMotion ? 0 : mockupX }}
                      >
                        <div
                          className="absolute inset-0 rounded-2xl opacity-20 blur-3xl -z-10"
                          style={{ background: `hsl(${item.accentHsl} / 0.3)` }}
                        />
                        <motion.div
                          className="rounded-2xl overflow-hidden shadow-2xl h-[340px] lg:h-[420px]"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <CaseCardMockup accentHsl={item.accentHsl} icon={item.icon} />
                        </motion.div>
                      </motion.div>

                      {/* Right: Content (45%) */}
                      <div className="lg:w-[45%] flex flex-col justify-center py-4">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                          {item.category}
                        </span>
                        <h3 className="text-3xl lg:text-5xl font-black mb-4 text-foreground" style={{ letterSpacing: "-0.02em" }}>
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-6 max-w-md">
                          {item.description}
                        </p>

                        {/* Stats row */}
                        <div className="flex gap-6 mb-8">
                          {item.stats.map((stat) => (
                            <div key={stat.label}>
                              <div className="text-2xl lg:text-3xl font-black text-foreground">{stat.value}</div>
                              <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">{stat.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Evolution tag */}
                        <div className="mb-8">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-warm/10 border border-accent-warm/20 text-accent-warm text-xs font-medium font-mono">
                            <Sparkles className="w-3 h-3" />
                            {item.evolutionTag}
                          </span>
                        </div>

                        {/* VIEW CASE link with magnetic effect */}
                        <MagneticButton>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors duration-200 group/link"
                          >
                            VIEW CASE
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                          </a>
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {portfolioItems.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE: Snap-scroll carousel ── */}
      <div className="md:hidden py-16 relative">
        {/* Header */}
        <div className="px-6 mb-8">
          <SectionNumber number="06" />
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-black section-title heading-glow">
              {t("proof.title")}
            </h2>
            <span className="font-mono text-xs text-muted-foreground tracking-wider mb-1 shrink-0">
              [{String(activeIndex + 1).padStart(2, "0")}/{String(totalItems).padStart(2, "0")}]
            </span>
          </div>
          <div className="relative mt-4 h-px bg-border/30 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/60 to-transparent transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / totalItems) * 100}%` }}
            />
          </div>
        </div>

        {/* Swipe hint */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/80 text-background text-sm font-medium pointer-events-none"
            >
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
              Swipe
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 px-6"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {portfolioItems.map((item) => (
            <div
              key={item.name}
              className="snap-center shrink-0 w-[85vw] rounded-2xl border border-border bg-card overflow-hidden"
              data-testid={`card-portfolio-mobile-${item.name.toLowerCase().replace(".", "-")}`}
            >
              {/* Mockup top */}
              <div className="relative h-[220px]">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ background: `hsl(${item.accentHsl} / 0.3)` }}
                />
                <div className="p-3 h-full">
                  <CaseCardMockup accentHsl={item.accentHsl} icon={item.icon} />
                </div>
              </div>

              {/* Content bottom */}
              <div className="p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.category}
                </span>
                <h3 className="text-xl font-black mt-2 mb-2 text-foreground">{item.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  {item.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-lg font-black text-foreground">{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Evolution tag */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-warm/10 border border-accent-warm/20 text-accent-warm text-[10px] font-medium font-mono mb-4">
                  <Sparkles className="w-3 h-3" />
                  {item.evolutionTag}
                </span>

                {/* Link */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors mt-4"
                >
                  VIEW CASE
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators mobile */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {portfolioItems.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsSection() {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const dragRef = useRef<{ lastX: number; startY: number; locked: boolean } | null>(null);

  // Auto-discover all logo files — just drop images into src/assets/logos/
  const logoFiles = import.meta.glob<{ default: string }>(
    '../assets/logos/*.{png,svg,jpg,jpeg,webp}',
    { eager: true }
  );

  const clients = Object.entries(logoFiles).map(([path, mod]) => {
    const filename = path.split('/').pop()!.replace(/\.[^.]+$/, '');
    const name = filename
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return { name, logo: mod.default };
  });

  // Build a strip wide enough to fill any screen, then duplicate for seamless loop
  const MIN_ITEMS_PER_STRIP = 12;
  const repeats = Math.max(1, Math.ceil(MIN_ITEMS_PER_STRIP / clients.length));
  const strip = Array.from({ length: repeats }, () => clients).flat();
  const scrollItems = [...strip, ...strip];

  // Continuous auto-scroll via transform — never stops, works on all platforms
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf: number;

    const step = () => {
      offsetRef.current -= 0.5;
      const halfWidth = el.scrollWidth / 2;
      if (halfWidth > 0 && Math.abs(offsetRef.current) >= halfWidth) {
        offsetRef.current += halfWidth;
      }
      el.style.transform = `translateX(${offsetRef.current}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, []);

  // Touch handlers — drag adjusts offsetRef while auto-scroll keeps running
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragRef.current = { lastX: touch.clientX, startY: touch.clientY, locked: false };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const touch = e.touches[0];
    const dx = touch.clientX - drag.lastX;
    const dy = touch.clientY - drag.startY;

    if (!drag.locked) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(touch.clientX - drag.lastX) > 10) {
        drag.locked = true;
      } else {
        return; // let vertical scroll happen
      }
    }

    e.preventDefault(); // prevent vertical scroll while dragging horizontally
    offsetRef.current += dx;
    drag.lastX = touch.clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    dragRef.current = null;
  }, []);

  // Mouse handlers — same pattern for desktop click-drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { lastX: e.clientX, startY: e.clientY, locked: true };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.lastX;
    offsetRef.current += dx;
    drag.lastX = e.clientX;
  }, []);

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <section id="clients" className="py-24 border-y border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-muted-foreground text-lg">{t("clients.title")}</p>
        </motion.div>
      </div>

      <div className="relative w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center gap-16 w-max will-change-transform cursor-grab active:cursor-grabbing select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {scrollItems.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="client-logo flex-shrink-0 flex items-center justify-center h-16 px-8"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-10 w-auto max-w-[180px] object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


export default function LandingPage() {
  const { t } = useLanguage();
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

  const openScheduling = (plan?: string) => {
    if (plan) setSelectedPlan(plan);
    setSchedulingOpen(true);
  };

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div className="min-h-screen bg-background noise-bg">
        <Helmet>
          <title>{t("seo.landing.title")}</title>
          <meta name="description" content={t("seo.landing.description")} />
          <meta property="og:title" content={t("seo.landing.ogTitle")} />
          <meta property="og:description" content={t("seo.landing.ogDescription")} />
          <meta property="og:type" content="website" />
        </Helmet>
        <ScrollProgress />
        <SharedNavbar />
        <HeroSection onScheduleClick={openScheduling} />
        <SpaghettiChaosSection />
        <BentoGridSection />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <PricingSection />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <AIPartnerSection />
        <ComparisonToggleSection />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <CasesSection />
        <ClientsSection />
        <SharedFooter />
        <SchedulingModal
          open={schedulingOpen}
          onOpenChange={(open) => {
            setSchedulingOpen(open);
            if (!open) setSelectedPlan(undefined);
          }}
          prefillData={selectedPlan ? { businessDescription: `Selected Plan: ${selectedPlan}\n\n` } : undefined}
        />
      </div>
    </SchedulingContext.Provider>
  );
}
