import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo/seo-head";
import { ServiceSchema, BreadcrumbSchema } from "@/components/seo/structured-data";
import { SchedulingModal } from "@/components/scheduling-modal";
import { SharedNavbar, SharedFooter } from "@/components/shared-layout";
import { SchedulingContext } from "@/context/scheduling-context";
import {
  ArrowRight,
  Check,
  Layers,
  DollarSign,
  TrendingUp,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import caseWealthfit from "@assets/cases/wealthfit.png";
import caseEventgrowth from "@assets/cases/eventgrowth.png";
import caseAgencyboost from "@assets/cases/AgencyBoost.png";

/* ─── Shared helpers ─── */

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

function SectionNumber({ number }: { number: string }) {
  return <span className="section-number">{number}</span>;
}

function GhostText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`ghost-text left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ${className}`}
      aria-hidden
    >
      {text}
    </div>
  );
}

/* ─── Progress Line ─── */

function ProgressLine({ progress }: { progress: MotionValue<number> }) {
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="progress-line hidden lg:block">
      <motion.div
        className="progress-line-fill"
        style={{ scaleY, height: "100%" }}
      />
    </div>
  );
}

/* ─── Service Hero ─── */

function ServiceHero({
  onScheduleClick,
}: {
  onScheduleClick: () => void;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <motion.div
        className="absolute inset-0 grid-pattern"
        style={{
          scale: prefersReducedMotion ? 1 : bgScale,
          opacity: prefersReducedMotion ? 1 : bgOpacity,
        }}
      >
        <GhostText text="SOFTWARE" className="-translate-y-1/3" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[25vw] h-[25vw] rounded-full bg-[hsl(280_70%_60%/0.08)] blur-3xl" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
        >
          <SectionNumber number="01" />
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 section-title heading-glow">
            {t("cs.hero.title.line1")}{" "}
            <span className="text-primary">
              {t("cs.hero.title.highlight")}
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground font-mono mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {">"} {t("cs.hero.subtitle")}
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link href="/build-solution?from=software">
            <Button
              size="lg"
              className="shimmer-btn glow-border gap-2 text-base px-8 py-6"
            >
              {t("cs.hero.cta")} <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <button
            onClick={onScheduleClick}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            {t("cs.hero.ctaSecondary")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Problems Section ─── */

function ProblemsSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      num: "01",
      title: t("cs.problem.1.title"),
      desc: t("cs.problem.1.description"),
    },
    {
      num: "02",
      title: t("cs.problem.2.title"),
      desc: t("cs.problem.2.description"),
    },
    {
      num: "03",
      title: t("cs.problem.3.title"),
      desc: t("cs.problem.3.description"),
    },
  ];

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid gap-12 md:gap-16">
          {problems.map((p, i) => (
            <motion.div
              key={p.num}
              className="relative"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.7,
                delay: i * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-start gap-6">
                <span className="text-6xl md:text-8xl font-black text-muted-foreground/10 leading-none select-none flex-shrink-0">
                  {p.num}
                </span>
                <div className="pt-2 md:pt-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-xl">
                    {p.desc}
                  </p>
                </div>
              </div>
              {i < problems.length - 1 && (
                <div className="mt-8 h-px bg-gradient-to-r from-border via-border to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works Section ─── */

function HowItWorksSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const steps = [
    { title: t("cs.how.step1.title"), desc: t("cs.how.step1.description") },
    { title: t("cs.how.step2.title"), desc: t("cs.how.step2.description") },
    { title: t("cs.how.step3.title"), desc: t("cs.how.step3.description") },
    { title: t("cs.how.step4.title"), desc: t("cs.how.step4.description") },
  ];

  const activeStepRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [0, steps.length - 0.01],
  );

  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const unsubscribe = activeStepRaw.on("change", (v) => {
      setActiveStep(
        Math.floor(Math.max(0, Math.min(v, steps.length - 1))),
      );
    });
    return unsubscribe;
  }, [activeStepRaw, steps.length]);

  /* Pre-compute line fills outside JSX to avoid useTransform in render loop */
  const lineFill0 = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const lineFill1 = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  const lineFill2 = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);
  const lineFills = [lineFill0, lineFill1, lineFill2];

  return (
    <section ref={containerRef} className="relative h-[300vh] md:h-[400vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        <SectionNumber number="02" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-center section-title heading-glow">
          {t("cs.how.title")}
        </h2>

        {/* Timeline dots */}
        <div className="flex items-center gap-0 mb-12 w-full max-w-md">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`timeline-dot ${i <= activeStep ? "active" : ""}`}
                />
                <span className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="timeline-line flex-1 relative">
                  <motion.div
                    className="timeline-line-fill"
                    style={{ scaleX: lineFills[i] }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Active step content */}
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div className="text-center md:text-left">
            <motion.h3
              key={`title-${activeStep}`}
              className="text-2xl md:text-3xl font-bold mb-4"
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {steps[activeStep].title}
            </motion.h3>
            <motion.p
              key={`desc-${activeStep}`}
              className="text-muted-foreground text-lg"
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {steps[activeStep].desc}
            </motion.p>
          </div>

          {/* Visual */}
          <div className="flex items-center justify-center">
            {activeStep === 0 && <ChaosMapVisual />}
            {activeStep === 1 && (
              <FlowchartVisual progress={scrollYProgress} />
            )}
            {activeStep === 2 && <TerminalVisual />}
            {activeStep === 3 && <EvolveVisual />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Step Visuals ─── */

function ChaosMapVisual() {
  const icons = ["N", "S", "Z", "Sh", "Hb", "Ai"];
  const positions = [
    { x: 20, y: 15 },
    { x: 70, y: 10 },
    { x: 45, y: 50 },
    { x: 10, y: 75 },
    { x: 80, y: 65 },
    { x: 55, y: 85 },
  ];

  return (
    <motion.div
      className="w-full max-w-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full h-48 rounded-xl border border-border bg-card overflow-hidden">
        {icons.map((icon, i) => (
          <motion.div
            key={icon}
            className="absolute w-10 h-10 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-xs font-mono text-muted-foreground"
            style={{
              left: `${positions[i].x}%`,
              top: `${positions[i].y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {icon}
          </motion.div>
        ))}
        {/* Scattered connection lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="25"
            y1="20"
            x2="72"
            y2="15"
            stroke="hsl(var(--destructive)/0.2)"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
          <line
            x1="48"
            y1="55"
            x2="15"
            y2="80"
            stroke="hsl(var(--destructive)/0.2)"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
          <line
            x1="72"
            y1="15"
            x2="82"
            y2="70"
            stroke="hsl(var(--destructive)/0.2)"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
        </svg>
      </div>
    </motion.div>
  );
}

function FlowchartVisual({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const pathLength = useTransform(progress, [0.25, 0.5], [0, 1]);
  const dashOffset = useTransform(pathLength, (v) => 1 - v);

  return (
    <motion.div
      className="w-full max-w-xs"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-xl border border-border bg-card p-4 overflow-hidden">
        <svg viewBox="0 0 200 140" className="w-full">
          {/* Central node */}
          <rect
            x="70"
            y="55"
            width="60"
            height="30"
            rx="6"
            fill="hsl(var(--primary)/0.2)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="74"
            textAnchor="middle"
            fill="hsl(var(--primary))"
            fontSize="8"
            fontFamily="var(--font-mono)"
          >
            PLATFORM
          </text>

          {/* Satellite nodes */}
          {[
            { x: 20, y: 15, label: "CRM" },
            { x: 150, y: 15, label: "ERP" },
            { x: 20, y: 110, label: "API" },
            { x: 150, y: 110, label: "AI" },
          ].map((node) => (
            <g key={node.label}>
              <rect
                x={node.x}
                y={node.y}
                width="40"
                height="20"
                rx="4"
                fill="hsl(var(--muted))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
              <text
                x={node.x + 20}
                y={node.y + 13}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="7"
                fontFamily="var(--font-mono)"
              >
                {node.label}
              </text>
            </g>
          ))}

          {/* Connecting lines */}
          {[
            "M40,25 L70,65",
            "M160,25 L130,65",
            "M40,120 L70,85",
            "M160,120 L130,85",
          ].map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="hsl(var(--primary)/0.4)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              style={{
                pathLength,
                strokeDasharray: 1,
                strokeDashoffset: dashOffset,
              }}
            />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

function TerminalVisual() {
  const { t } = useLanguage();
  const [lines, setLines] = useState(0);

  const terminalLines = [
    t("cs.how.step3.terminal1"),
    t("cs.how.step3.terminal2"),
    t("cs.how.step3.terminal3"),
  ];

  useEffect(() => {
    setLines(0);
    const timers = terminalLines.map((_, i) =>
      setTimeout(
        () => setLines((prev) => Math.max(prev, i + 1)),
        (i + 1) * 600,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="w-full max-w-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="text-xs text-muted-foreground ml-2 font-mono">
            terminal
          </span>
        </div>
        <div className="p-4 space-y-2 min-h-[120px]">
          {terminalLines.map((text, i) => (
            <div
              key={i}
              className={`terminal-line transition-opacity duration-300 ${
                i < lines ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="check">✓</span>{" "}
              <span className="prompt">$</span> {text}
            </div>
          ))}
          {lines >= terminalLines.length && (
            <div className="terminal-line mt-2">
              <span className="prompt">$</span>{" "}
              <span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EvolveVisual() {
  const { t } = useLanguage();

  const stats = [
    t("cs.how.step4.stat1"),
    t("cs.how.step4.stat2"),
    t("cs.how.step4.stat3"),
  ];

  return (
    <motion.div
      className="w-full max-w-xs space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Version ticker */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
        <span className="text-sm font-mono font-bold text-green-500">
          EVOLVING
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat} className="bento-card p-3 text-center">
            <span className="text-sm font-bold text-primary">{stat}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Cases Section ─── */

function SoftwareCasesSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cases = [
    {
      name: "Wealthfit.com",
      category: t("proof.wealthfit.category"),
      description: t("proof.wealthfit.description"),
      icon: DollarSign,
      accentHsl: "199 89% 48%",
      evolutionTag: t("proof.wealthfit.tag"),
      link: "https://wealthfit.com",
      image: caseWealthfit,
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
      image: caseEventgrowth,
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
      image: caseAgencyboost,
      stats: [
        { label: "Features", value: "100+" },
        { label: "Hours Saved", value: "60%" },
        { label: "Clients", value: "180+" },
      ],
    },
  ];

  return (
    <section ref={ref} className="section-padding relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7 }}
        >
          <SectionNumber number="03" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black section-title heading-glow">
            {t("cs.cases.title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                className="bento-card group overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Image */}
                {item.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                )}

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: `hsl(${item.accentHsl} / 0.15)`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: `hsl(${item.accentHsl})` }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {item.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center p-2 rounded-lg bg-muted/30"
                      >
                        <div className="text-sm font-bold text-primary">
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Evolution tag */}
                  <div className="text-xs text-muted-foreground font-mono mb-3">
                    {item.evolutionTag}
                  </div>

                  {/* Link */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing Section (two cards) ─── */

function SoftwarePricingSection({
  onScheduleClick,
}: {
  onScheduleClick: (plan?: string) => void;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      key: "premium",
      title: t("pricing.premium.title"),
      subtitle: t("pricing.premium.subtitle"),
      description: t("pricing.premium.description"),
      setup: t("pricing.premium.price.setup"),
      monthly: t("pricing.premium.price.monthly"),
      features: [1, 2, 3, 4].map((i) => t(`pricing.premium.feature${i}`)),
      popular: true,
    },
    {
      key: "enterprise",
      title: t("pricing.enterprise.title"),
      subtitle: t("pricing.enterprise.subtitle"),
      description: t("pricing.enterprise.description"),
      setup: t("pricing.enterprise.price.setup"),
      monthly: t("pricing.enterprise.price.monthly"),
      features: [1, 2, 3, 4].map((i) =>
        t(`pricing.enterprise.feature${i}`),
      ),
      popular: false,
    },
  ];

  return (
    <section ref={ref} className="section-padding relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7 }}
        >
          <SectionNumber number="04" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-12 section-title heading-glow">
            {t("cs.pricing.title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              className={`bento-card p-8 text-left relative ${
                plan.popular ? "border-primary/30" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {t("pricing.popular")}
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                {plan.setup}
              </p>
              <p className="text-3xl font-black text-primary mb-6">
                {plan.monthly}
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/build-solution?from=software">
                <Button
                  className="w-full shimmer-btn glow-border gap-2"
                >
                  {t("cs.pricing.startBuilding")} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <button
                onClick={() => onScheduleClick(plan.title)}
                className="w-full text-xs text-muted-foreground hover:text-primary transition-colors mt-2 underline underline-offset-4"
              >
                {t("cs.pricing.orSchedule")}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Cross-sell link */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-muted-foreground text-sm">
            {t("cs.pricing.also")}{" "}
            <Link
              href="/custom-websites"
              className="text-primary hover:underline font-medium"
            >
              {t("cs.pricing.alsoLink")} →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Service CTA ─── */

function ServiceCTA({
  onScheduleClick,
}: {
  onScheduleClick: () => void;
}) {
  const { t } = useLanguage();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          {...fadeInUp}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 heading-glow">
            {t("cs.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("cs.cta.subtitle")}
          </p>
          <Link href="/build-solution?from=software">
            <Button
              size="lg"
              className="shimmer-btn glow-border gap-2 text-base px-8 py-6"
            >
              {t("cs.cta.button")} <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <button
            onClick={onScheduleClick}
            className="block mx-auto mt-3 text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            {t("cs.cta.buttonSecondary")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page Component ─── */

export default function CustomSoftwarePage() {
  const { t } = useLanguage();
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  const pageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: pageRef });

  const openScheduling = (plan?: string) => {
    if (plan) setSelectedPlan(plan);
    setSchedulingOpen(true);
  };

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div
        ref={pageRef}
        className="min-h-screen bg-background noise-bg service-page"
      >
        <SeoHead
          title={t("cs.seo.title")}
          description={t("cs.seo.description")}
          path="/custom-software"
          ogTitle={t("cs.seo.ogTitle")}
          ogDescription={t("cs.seo.ogDescription")}
        />
        <ServiceSchema
          name={t("cs.seo.ogTitle")}
          description={t("cs.seo.description")}
          price="599"
        />
        <BreadcrumbSchema
          items={[
            { name: t("breadcrumb.home"), url: "https://alloyready.io/" },
            {
              name: t("nav.services.software"),
              url: "https://alloyready.io/custom-software",
            },
          ]}
        />

        <SharedNavbar />
        <ProgressLine progress={scrollYProgress} />

        <main>
          <ServiceHero onScheduleClick={() => openScheduling()} />
          <ProblemsSection />
          <HowItWorksSection />
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <SoftwareCasesSection />
          <SoftwarePricingSection onScheduleClick={openScheduling} />
          <ServiceCTA onScheduleClick={() => openScheduling()} />
        </main>

        <SharedFooter />
        <SchedulingModal
          open={schedulingOpen}
          onOpenChange={(open) => {
            setSchedulingOpen(open);
            if (!open) setSelectedPlan(undefined);
          }}
          prefillData={
            selectedPlan
              ? {
                  businessDescription: `Selected Plan: ${selectedPlan}\n\n`,
                }
              : undefined
          }
        />
      </div>
    </SchedulingContext.Provider>
  );
}
