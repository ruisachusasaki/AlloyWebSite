import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plane, Unlink, Lightbulb, Layers, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo/seo-head";
import { SharedNavbar, SharedFooter } from "@/components/shared-layout";
import { SchedulingContext } from "@/context/scheduling-context";
import { SchedulingModal } from "@/components/scheduling-modal";
import { useLanguage } from "@/context/language-context";

/* ─── Animation Variants ─── */

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } },
  viewport: { once: true, margin: "-80px" },
};

const staggerChild = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

/* ─── Chapter icon mapping ─── */

const CHAPTER_ICONS = [Plane, Unlink, Lightbulb, Layers] as const;

/* ─── Gradient Divider ─── */

function GradientDivider() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-1">
      <div className="relative h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        {/* Center diamond */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary/30 rotate-45" />
      </div>
    </div>
  );
}

/* ─── Pull Quote Card ─── */

function PullQuote({ quote, variant }: { quote: string; variant: "standard" | "wide" | "glass" }) {
  const baseClasses =
    "relative bg-card/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-border/50 shadow-sm";

  return (
    <motion.blockquote
      className={`${baseClasses} ${variant === "wide" ? "max-w-4xl -mx-4 md:-mx-8" : ""} my-8`}
      {...fadeInUp}
    >
      {/* Decorative quotation mark */}
      <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/15" />
      <p className="text-lg md:text-xl italic text-foreground/80 pl-8 md:pl-10">
        "{quote}"
      </p>
    </motion.blockquote>
  );
}

/* ─── Journey Map (between hero and chapters) ─── */

function JourneyMap({
  labels,
  activeIdx,
  onNavigate,
}: {
  labels: string[];
  activeIdx: number;
  onNavigate: (idx: number) => void;
}) {
  return (
    <motion.nav
      className="max-w-3xl mx-auto px-6 py-8"
      aria-label="Chapter navigation"
      {...fadeInUp}
    >
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 transition-colors"
          >
            <span
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                i === activeIdx
                  ? "bg-primary border-primary scale-125"
                  : "border-muted-foreground/40 group-hover:border-primary/60"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                i === activeIdx
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {label}
            </span>
            {i < labels.length - 1 && (
              <div className="w-12 lg:w-20 h-px bg-border ml-2" />
            )}
          </button>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col gap-3">
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 transition-colors"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                i === activeIdx
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/40 group-hover:border-primary/60"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                i === activeIdx
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {label}
            </span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}

/* ─── Chapter Sidebar Navigation (desktop) ─── */

function ChapterSidebar({
  labels,
  activeIdx,
  onNavigate,
}: {
  labels: string[];
  activeIdx: number;
  onNavigate: (idx: number) => void;
}) {
  return (
    <nav
      className="hidden lg:flex fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 z-20 flex-col items-start gap-4"
      aria-label="Chapter progress"
    >
      {/* Connecting line */}
      <div className="absolute left-[5px] top-3 bottom-3 w-px bg-border" />

      {labels.map((label, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          className="group flex items-center gap-3 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-1 py-0.5 transition-all"
        >
          <span
            className={`w-[11px] h-[11px] rounded-full border-2 transition-all duration-500 relative z-10 ${
              i === activeIdx
                ? "bg-primary border-primary shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                : i < activeIdx
                  ? "bg-primary/40 border-primary/40"
                  : "bg-background border-muted-foreground/30 group-hover:border-primary/50"
            }`}
          />
          <span
            className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${
              i === activeIdx
                ? "text-primary opacity-100 translate-x-0"
                : "text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {label}
          </span>
        </button>
      ))}
    </nav>
  );
}

/* ─── Chapter Component (with layout variation) ─── */

interface ChapterProps {
  index: number;
  number: string;
  title: string;
  titleHighlight: string;
  paragraphs: string[];
  quote: string;
}

function Chapter({ index, number, title, titleHighlight, paragraphs, quote }: ChapterProps) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = CHAPTER_ICONS[index];

  // Layout variation per chapter
  const isEven = index % 2 === 0;
  // Chapter 3 (index 2) gets the wide quote treatment
  const quoteVariant = index === 2 ? "wide" : "standard";

  return (
    <section className="py-14 md:py-20" id={`chapter-${index}`}>
      <motion.div
        className="max-w-3xl mx-auto px-6 relative"
        {...staggerContainer}
      >
        {/* Decorative background icon — always on the right to avoid overlapping the chapter number */}
        <div
          className={`absolute ${isEven ? "-top-2 right-0 md:-right-8" : "top-8 right-4 md:-right-4"} pointer-events-none select-none`}
          aria-hidden="true"
        >
          <Icon
            className="w-16 h-16 md:w-24 md:h-24 text-primary/[0.07]"
            strokeWidth={1.2}
          />
        </div>

        {/* Section number — watermark style */}
        <motion.div
          className="relative mb-4"
          {...staggerChild}
        >
          <span
            className="font-display font-black text-5xl md:text-6xl text-primary/10 leading-none select-none"
            aria-hidden="true"
          >
            {number}
          </span>
        </motion.div>

        {/* Chapter title */}
        <motion.h2
          className="font-display text-2xl md:text-3xl font-bold mb-8"
          {...staggerChild}
        >
          {title.replace(titleHighlight, "").trim()}{" "}
          <span className="text-primary">{titleHighlight}</span>
        </motion.h2>

        {/* Paragraphs */}
        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className="text-base md:text-lg text-foreground/75 leading-relaxed"
              {...staggerChild}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Pull quote */}
        <PullQuote quote={quote} variant={quoteVariant} />
      </motion.div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function OurStoryPage() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const openScheduling = () => setSchedulingOpen(true);

  // Refs for each chapter section
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const setChapterRef = useCallback((el: HTMLElement | null, idx: number) => {
    chapterRefs.current[idx] = el;
  }, []);

  // IntersectionObserver for active chapter tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    chapterRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveChapter(idx);
          }
        },
        { rootMargin: "-30% 0px -50% 0px" }
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToChapter = (idx: number) => {
    const el = chapterRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  };

  const journeyLabels = [
    t("story.journey.ch1"),
    t("story.journey.ch2"),
    t("story.journey.ch3"),
    t("story.journey.ch4"),
  ];

  const chapters: ChapterProps[] = [
    {
      index: 0,
      number: t("story.ch1.number"),
      title: t("story.ch1.title"),
      titleHighlight: t("story.ch1.title").split(" ").pop() || "",
      paragraphs: [t("story.ch1.p1"), t("story.ch1.p2"), t("story.ch1.p3"), t("story.ch1.p4")],
      quote: t("story.ch1.quote"),
    },
    {
      index: 1,
      number: t("story.ch2.number"),
      title: t("story.ch2.title"),
      titleHighlight: t("story.ch2.title").split(" ").pop() || "",
      paragraphs: [t("story.ch2.p1"), t("story.ch2.p2"), t("story.ch2.p3")],
      quote: t("story.ch2.quote"),
    },
    {
      index: 2,
      number: t("story.ch3.number"),
      title: t("story.ch3.title"),
      titleHighlight: t("story.ch3.title").split(" ").pop() || "",
      paragraphs: [t("story.ch3.p1"), t("story.ch3.p2"), t("story.ch3.p3"), t("story.ch3.p4"), t("story.ch3.p5"), t("story.ch3.p6")],
      quote: t("story.ch3.quote"),
    },
    {
      index: 3,
      number: t("story.ch4.number"),
      title: t("story.ch4.title"),
      titleHighlight: "Ready",
      paragraphs: [t("story.ch4.p1"), t("story.ch4.p2"), t("story.ch4.p3"), t("story.ch4.p4"), t("story.ch4.p5"), t("story.ch4.p6"), t("story.ch4.p7"), t("story.ch4.p8")],
      quote: t("story.ch4.quote"),
    },
  ];

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div className="min-h-screen bg-background">
        <SeoHead
          title={t("seo.story.title")}
          description={t("seo.story.description")}
          path="/about"
          ogTitle={t("seo.story.ogTitle")}
          ogDescription={t("seo.story.ogDescription")}
        />
        <SharedNavbar />

        {/* Chapter sidebar navigation (desktop) */}
        <ChapterSidebar
          labels={journeyLabels}
          activeIdx={activeChapter}
          onNavigate={scrollToChapter}
        />

        <main className="pt-24">
          {/* ═══════════════════════════════════════════
              Hero Section
          ═══════════════════════════════════════════ */}
          <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
              {/* Ghost text behind */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span
                  className="font-logo text-foreground whitespace-nowrap"
                  style={{
                    fontSize: "clamp(4rem, 12vw, 10rem)",
                    opacity: 0.05,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  AlloyReady
                </span>
              </div>

              {/* Desktop: text left, portrait right */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Text */}
                <div className="flex-1 text-center md:text-left relative">
                  <motion.h1
                    className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-foreground heading-glow mb-6 relative"
                    style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t("story.hero.title")}
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-muted-foreground max-w-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t("story.hero.subtitle")}
                  </motion.p>
                </div>

              </div>
            </div>
          </section>

          {/* Journey Map */}
          <JourneyMap
            labels={journeyLabels}
            activeIdx={activeChapter}
            onNavigate={scrollToChapter}
          />

          <GradientDivider />

          {/* ═══════════════════════════════════════════
              Chapters 1–4
          ═══════════════════════════════════════════ */}
          {chapters.map((ch, i) => (
            <div
              key={ch.number}
              ref={(el) => setChapterRef(el, i)}
            >
              <Chapter {...ch} />
              {i < chapters.length - 1 && <GradientDivider />}
            </div>
          ))}

          <GradientDivider />

          {/* ═══════════════════════════════════════════
              CTA — Personal Invitation Card
          ═══════════════════════════════════════════ */}
          <section className="py-14 md:py-20">
            <motion.div
              className="max-w-2xl mx-auto px-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-secondary/30 rounded-2xl border border-border/50 p-8 md:p-12 text-center">
                <h2
                  className="font-display text-3xl md:text-4xl font-black text-foreground mb-3"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {t("story.cta.title")}
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {t("story.cta.subtitle")}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg font-bold px-10 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => openScheduling()}
                >
                  {t("story.cta.button")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="mt-6 text-sm text-muted-foreground italic">
                  {t("story.cta.signature")}
                </p>
              </div>
            </motion.div>
          </section>
        </main>

        <SharedFooter />

        <SchedulingModal
          open={schedulingOpen}
          onOpenChange={setSchedulingOpen}
        />
      </div>
    </SchedulingContext.Provider>
  );
}
