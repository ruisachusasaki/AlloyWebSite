import React, { useState, useRef, useContext, useEffect } from "react";
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
import { ArrowRight, Check, Globe } from "lucide-react";

/* ─── Shared helpers ─── */

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

function SectionNumber({ number }: { number: string }) {
  return <span className="section-number">{number}</span>;
}

function GhostText({ text, className = "" }: { text: string; className?: string }) {
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

function ServiceHero({ onScheduleClick }: { onScheduleClick: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const bgBlur = useTransform(scrollYProgress, [0, 1], [0, 6]);
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
          filter: prefersReducedMotion ? "none" : bgBlur.get() ? `blur(${bgBlur.get()}px)` : "none",
          opacity: prefersReducedMotion ? 1 : bgOpacity,
        }}
      >
        <GhostText text="WEBSITES" className="-translate-y-1/3" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[hsl(var(--accent-warm)/0.1)] blur-3xl" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <SectionNumber number="01" />
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 section-title heading-glow">
            {t("cw.hero.title.line1")}{" "}
            <span className="text-primary">{t("cw.hero.title.highlight")}</span>
          </h1>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground font-mono mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {">"} {t("cw.hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button
            size="lg"
            className="shimmer-btn glow-border gap-2 text-base px-8 py-6"
            onClick={onScheduleClick}
          >
            {t("cw.hero.cta")} <ArrowRight className="w-5 h-5" />
          </Button>
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
    { num: "01", title: t("cw.problem.1.title"), desc: t("cw.problem.1.description") },
    { num: "02", title: t("cw.problem.2.title"), desc: t("cw.problem.2.description") },
    { num: "03", title: t("cw.problem.3.title"), desc: t("cw.problem.3.description") },
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
              transition={{ duration: 0.7, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start gap-6">
                <span className="text-6xl md:text-8xl font-black text-muted-foreground/10 leading-none select-none flex-shrink-0">
                  {p.num}
                </span>
                <div className="pt-2 md:pt-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{p.title}</h3>
                  <p className="text-muted-foreground text-lg max-w-xl">{p.desc}</p>
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
    {
      title: t("cw.how.step1.title"),
      desc: t("cw.how.step1.description"),
      visual: "wireframe",
    },
    {
      title: t("cw.how.step2.title"),
      desc: t("cw.how.step2.description"),
      visual: "design",
    },
    {
      title: t("cw.how.step3.title"),
      desc: t("cw.how.step3.description"),
      visual: "terminal",
    },
    {
      title: t("cw.how.step4.title"),
      desc: t("cw.how.step4.description"),
      visual: "launch",
    },
  ];

  // Each step occupies 25% of the scroll
  const activeStepRaw = useTransform(scrollYProgress, [0, 1], [0, steps.length - 0.01]);

  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const unsubscribe = activeStepRaw.on("change", (v) => {
      setActiveStep(Math.floor(Math.max(0, Math.min(v, steps.length - 1))));
    });
    return unsubscribe;
  }, [activeStepRaw, steps.length]);

  const timelineProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1]
  );

  return (
    <section ref={containerRef} className="relative h-[300vh] md:h-[400vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        <SectionNumber number="02" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-center section-title heading-glow">
          {t("cw.how.title")}
        </h2>

        {/* Timeline dots */}
        <div className="flex items-center gap-0 mb-12 w-full max-w-md">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`timeline-dot ${i <= activeStep ? "active" : ""}`} />
                <span className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="timeline-line flex-1 relative">
                  <motion.div
                    className="timeline-line-fill"
                    style={{
                      scaleX: useTransform(
                        scrollYProgress,
                        [i / steps.length, (i + 1) / steps.length],
                        [0, 1]
                      ),
                    }}
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
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {steps[activeStep].title}
            </motion.h3>
            <motion.p
              key={`desc-${activeStep}`}
              className="text-muted-foreground text-lg"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {steps[activeStep].desc}
            </motion.p>
          </div>

          {/* Visual */}
          <div className="flex items-center justify-center">
            {activeStep === 0 && <WireframeVisual progress={scrollYProgress} />}
            {activeStep === 1 && <DesignVisual />}
            {activeStep === 2 && <TerminalVisual />}
            {activeStep === 3 && <LaunchVisual />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Step visuals */

function WireframeVisual({ progress }: { progress: MotionValue<number> }) {
  const pathLength = useTransform(progress, [0, 0.25], [0, 1]);

  return (
    <div className="w-full max-w-xs">
      <div className="browser-mockup">
        <div className="browser-mockup-bar">
          <div className="browser-mockup-dot bg-red-400" />
          <div className="browser-mockup-dot bg-yellow-400" />
          <div className="browser-mockup-dot bg-green-400" />
        </div>
        <div className="p-4">
          <svg viewBox="0 0 200 140" className="w-full">
            <motion.rect
              x="10" y="10" width="180" height="20" rx="4"
              className="wireframe-path"
              style={{ pathLength }}
              strokeDasharray="1"
              strokeDashoffset={useTransform(pathLength, (v) => 1 - v)}
            />
            <motion.rect
              x="10" y="40" width="120" height="60" rx="4"
              className="wireframe-path"
              style={{ pathLength }}
              strokeDasharray="1"
              strokeDashoffset={useTransform(pathLength, (v) => 1 - v)}
            />
            <motion.rect
              x="140" y="40" width="50" height="25" rx="4"
              className="wireframe-path"
              style={{ pathLength }}
              strokeDasharray="1"
              strokeDashoffset={useTransform(pathLength, (v) => 1 - v)}
            />
            <motion.rect
              x="140" y="75" width="50" height="25" rx="4"
              className="wireframe-path"
              style={{ pathLength }}
              strokeDasharray="1"
              strokeDashoffset={useTransform(pathLength, (v) => 1 - v)}
            />
            <motion.rect
              x="10" y="110" width="60" height="20" rx="4"
              className="wireframe-path"
              style={{ pathLength }}
              strokeDasharray="1"
              strokeDashoffset={useTransform(pathLength, (v) => 1 - v)}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DesignVisual() {
  return (
    <motion.div
      className="w-full max-w-xs"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="browser-mockup">
        <div className="browser-mockup-bar">
          <div className="browser-mockup-dot bg-red-400" />
          <div className="browser-mockup-dot bg-yellow-400" />
          <div className="browser-mockup-dot bg-green-400" />
        </div>
        <div className="p-4 space-y-3">
          {/* Colorful "designed" version */}
          <div className="h-5 rounded bg-gradient-to-r from-primary/40 to-primary/20" />
          <div className="h-16 rounded-lg bg-gradient-to-br from-primary/20 via-[hsl(var(--accent-warm)/0.15)] to-primary/10" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 rounded bg-primary/15" />
            <div className="h-12 rounded bg-[hsl(var(--accent-warm)/0.15)]" />
            <div className="h-12 rounded bg-primary/10" />
          </div>
          <div className="flex justify-center">
            <div className="w-24 h-7 rounded-lg bg-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TerminalVisual() {
  const { t } = useLanguage();
  const [lines, setLines] = useState<number>(0);

  const terminalLines = [
    { text: t("cw.how.step3.terminal1"), done: true },
    { text: t("cw.how.step3.terminal2"), done: true },
    { text: t("cw.how.step3.terminal3"), done: true },
  ];

  useEffect(() => {
    setLines(0);
    const timers = terminalLines.map((_, i) =>
      setTimeout(() => setLines((prev) => Math.max(prev, i + 1)), (i + 1) * 600)
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
          <span className="text-xs text-muted-foreground ml-2 font-mono">terminal</span>
        </div>
        <div className="p-4 space-y-2 min-h-[120px]">
          {terminalLines.map((line, i) => (
            <div
              key={i}
              className={`terminal-line transition-opacity duration-300 ${i < lines ? "opacity-100" : "opacity-0"}`}
            >
              <span className="check">✓</span>{" "}
              <span className="prompt">$</span> {line.text}
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

function LaunchVisual() {
  const { t } = useLanguage();

  const stats = [
    t("cw.how.step4.stat1"),
    t("cw.how.step4.stat2"),
    t("cw.how.step4.stat3"),
  ];

  return (
    <motion.div
      className="w-full max-w-xs space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* LIVE indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
        <span className="text-sm font-mono font-bold text-green-500">LIVE</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat}
            className="bento-card p-3 text-center"
          >
            <span className="text-sm font-bold text-primary">{stat}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Pricing Section (single card) ─── */

function WebsitePricingSection({ onScheduleClick }: { onScheduleClick: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding relative">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7 }}
        >
          <SectionNumber number="03" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-12 section-title heading-glow">
            {t("cw.pricing.title")}
          </h2>
        </motion.div>

        <motion.div
          className="bento-card p-8 md:p-10 text-left max-w-lg mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-2">{t("pricing.ecommerce.title")}</h3>
          <p className="text-muted-foreground text-sm mb-4">{t("pricing.ecommerce.description")}</p>
          <p className="text-sm text-muted-foreground mb-1">{t("pricing.ecommerce.price.setup")}</p>
          <p className="text-3xl font-black text-primary mb-6">{t("pricing.ecommerce.price.monthly")}</p>
          <ul className="space-y-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{t(`pricing.ecommerce.feature${i}`)}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full shimmer-btn glow-border gap-2"
            onClick={onScheduleClick}
          >
            {t("pricing.cta")} <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Cross-sell link */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-muted-foreground text-sm">
            {t("cw.pricing.also")}{" "}
            <Link href="/custom-software" className="text-primary hover:underline font-medium">
              {t("cw.pricing.alsoLink")} →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Service CTA ─── */

function ServiceCTA({ onScheduleClick }: { onScheduleClick: () => void }) {
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
            {t("cw.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("cw.cta.subtitle")}
          </p>
          <Button
            size="lg"
            className="shimmer-btn glow-border gap-2 text-base px-8 py-6"
            onClick={onScheduleClick}
          >
            {t("cw.cta.button")} <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page Component ─── */

export default function CustomWebsitesPage() {
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
      <div ref={pageRef} className="min-h-screen bg-background noise-bg service-page">
        <SeoHead
          title={t("cw.seo.title")}
          description={t("cw.seo.description")}
          path="/custom-websites"
          ogTitle={t("cw.seo.ogTitle")}
          ogDescription={t("cw.seo.ogDescription")}
        />
        <ServiceSchema
          name={t("cw.seo.ogTitle")}
          description={t("cw.seo.description")}
          price="200"
        />
        <BreadcrumbSchema
          items={[
            { name: t("breadcrumb.home"), url: "https://alloyready.io/" },
            { name: t("nav.services.websites"), url: "https://alloyready.io/custom-websites" },
          ]}
        />

        <SharedNavbar />
        <ProgressLine progress={scrollYProgress} />

        <main>
          <ServiceHero onScheduleClick={() => openScheduling()} />
          <ProblemsSection />
          <HowItWorksSection />
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <WebsitePricingSection onScheduleClick={() => openScheduling("Alloy eCommerce/Website")} />
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
              ? { businessDescription: `Selected Plan: ${selectedPlan}\n\n` }
              : undefined
          }
        />
      </div>
    </SchedulingContext.Provider>
  );
}
