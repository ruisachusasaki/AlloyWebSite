import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "wouter";

function SectionNumber({ number }: { number: string }) {
  return <span className="section-number">{number}</span>;
}

function FAQItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <details
        open={isOpen}
        className="group border border-border/50 rounded-xl overflow-hidden transition-colors hover:border-primary/30"
      >
        <summary
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none"
        >
          <h3 className="text-base md:text-lg font-semibold text-foreground text-left">
            {question}
          </h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </summary>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </details>
    </motion.div>
  );
}

const ALL_FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const TEASER_KEYS = [1, 4, 5, 6] as const;

export function FAQSection({ mode = "teaser" }: { mode?: "teaser" | "full" }) {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const keys = mode === "full" ? ALL_FAQ_KEYS : TEASER_KEYS;

  const faqItems = keys.map((k) => ({
    question: t(`faq.q${k}`),
    answer: t(`faq.a${k}`),
  }));

  return (
    <section id="faq" className="section-padding relative overflow-hidden bg-background" aria-label="Frequently Asked Questions">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          {mode === "teaser" && <SectionNumber number="07" />}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium mb-8 font-mono text-primary">
            <HelpCircle className="w-4 h-4" />
            {t("faq.badge")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground mb-6 section-title heading-glow" style={{ letterSpacing: "0.05em" }}>
            {t("faq.title.line1")}{" "}
            <span className="text-primary">{t("faq.title.highlight")}</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FAQItem
              key={`${mode}-${index}`}
              question={item.question}
              answer={item.answer}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* "See all questions" link — only in teaser mode */}
        {mode === "teaser" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mt-10"
          >
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors duration-200 group"
            >
              {t("faq.seeAll")}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
