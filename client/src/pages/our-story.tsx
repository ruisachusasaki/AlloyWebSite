import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo/seo-head";
import { SharedNavbar, SharedFooter } from "@/components/shared-layout";
import { SchedulingContext } from "@/context/scheduling-context";
import { SchedulingModal } from "@/components/scheduling-modal";
import { useLanguage } from "@/context/language-context";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true, margin: "-80px" },
};

const staggerChild = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

function GradientDivider() {
  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

interface ChapterProps {
  number: string;
  title: string;
  titleHighlight: string;
  paragraphs: string[];
  quote: string;
}

function Chapter({ number, title, titleHighlight, paragraphs, quote }: ChapterProps) {
  return (
    <section className="py-20 md:py-28">
      <motion.div
        className="max-w-3xl mx-auto px-6"
        {...staggerContainer}
      >
        {/* Section number */}
        <motion.span
          className="section-number font-mono text-sm text-muted-foreground tracking-widest block mb-4"
          {...staggerChild}
        >
          {number}
        </motion.span>

        {/* Chapter title */}
        <motion.h2
          className="font-display text-2xl md:text-3xl font-bold mb-10"
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
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
              {...staggerChild}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Pull quote */}
        <motion.blockquote
          className="border-l-4 border-primary pl-6 my-12 text-xl md:text-2xl italic text-muted-foreground"
          {...fadeInUp}
        >
          "{quote}"
        </motion.blockquote>
      </motion.div>
    </section>
  );
}

export default function OurStoryPage() {
  const { t } = useLanguage();
  const [schedulingOpen, setSchedulingOpen] = useState(false);

  const openScheduling = () => setSchedulingOpen(true);

  const chapters: ChapterProps[] = [
    {
      number: t("story.ch1.number"),
      title: t("story.ch1.title"),
      titleHighlight: t("story.ch1.title").split(" ").pop() || "",
      paragraphs: [t("story.ch1.p1"), t("story.ch1.p2"), t("story.ch1.p3"), t("story.ch1.p4")],
      quote: t("story.ch1.quote"),
    },
    {
      number: t("story.ch2.number"),
      title: t("story.ch2.title"),
      titleHighlight: t("story.ch2.title").split(" ").pop() || "",
      paragraphs: [t("story.ch2.p1"), t("story.ch2.p2"), t("story.ch2.p3")],
      quote: t("story.ch2.quote"),
    },
    {
      number: t("story.ch3.number"),
      title: t("story.ch3.title"),
      titleHighlight: t("story.ch3.title").split(" ").pop() || "",
      paragraphs: [t("story.ch3.p1"), t("story.ch3.p2"), t("story.ch3.p3")],
      quote: t("story.ch3.quote"),
    },
    {
      number: t("story.ch4.number"),
      title: t("story.ch4.title"),
      titleHighlight: "Ready",
      paragraphs: [t("story.ch4.p1"), t("story.ch4.p2"), t("story.ch4.p3"), t("story.ch4.p4")],
      quote: t("story.ch4.quote"),
    },
  ];

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div className="min-h-screen bg-background">
        <SeoHead
          title={t("seo.story.title")}
          description={t("seo.story.description")}
          path="/our-story"
          ogTitle={t("seo.story.ogTitle")}
          ogDescription={t("seo.story.ogDescription")}
        />
        <SharedNavbar />

        <main className="pt-24">
          {/* ═══════════════════════════════════════════
              Section 1: Hero
          ═══════════════════════════════════════════ */}
          <section className="py-20 md:py-28 relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
              {/* Ghost text behind title */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span
                  className="font-display font-black text-foreground whitespace-nowrap"
                  style={{
                    fontSize: "clamp(4rem, 12vw, 10rem)",
                    opacity: 0.03,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  ALLOY
                </span>
              </div>

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
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {t("story.hero.subtitle")}
              </motion.p>
            </div>
          </section>

          <GradientDivider />

          {/* ═══════════════════════════════════════════
              Chapters 1–4
          ═══════════════════════════════════════════ */}
          {chapters.map((ch, i) => (
            <div key={ch.number}>
              <Chapter {...ch} />
              {i < chapters.length - 1 && <GradientDivider />}
            </div>
          ))}

          <GradientDivider />

          {/* ═══════════════════════════════════════════
              Section 6: CTA Closing
          ═══════════════════════════════════════════ */}
          <section className="py-20 md:py-28">
            <motion.div
              className="max-w-3xl mx-auto px-6 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2
                className="font-display text-3xl md:text-4xl font-black text-foreground mb-8"
                style={{ letterSpacing: "-0.02em" }}
              >
                {t("story.cta.title")}
              </h2>
              <Button
                size="lg"
                className="text-lg font-bold shimmer-btn glow-border px-10 py-6"
                onClick={() => openScheduling()}
              >
                {t("story.cta.button")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
