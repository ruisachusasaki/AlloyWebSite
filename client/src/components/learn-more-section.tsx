import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

export function LearnMoreSection() {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="learn-more" className="py-16 relative bg-background" aria-label="Learn more about productized software">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-4 py-4 text-left group"
          aria-expanded={isExpanded}
        >
          <span className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {t("learnMore.toggle")}
            </span>
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.article
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="prose prose-neutral dark:prose-invert max-w-none pb-8">
                <h2>{t("learnMore.h2.problem")}</h2>
                <p>{t("learnMore.p1")}</p>
                <p>{t("learnMore.p2")}</p>

                <h2>{t("learnMore.h2.solution")}</h2>
                <p>{t("learnMore.p3")}</p>
                <p>{t("learnMore.p4")}</p>

                <h2>{t("learnMore.h2.alloy")}</h2>
                <p>{t("learnMore.p5")}</p>
                <p>{t("learnMore.p6")}</p>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

        {/* Crawlable hidden content for search engines when collapsed */}
        {!isExpanded && (
          <div className="sr-only" aria-hidden="false">
            <h2>{t("learnMore.h2.problem")}</h2>
            <p>{t("learnMore.p1")}</p>
            <p>{t("learnMore.p2")}</p>
            <h2>{t("learnMore.h2.solution")}</h2>
            <p>{t("learnMore.p3")}</p>
            <p>{t("learnMore.p4")}</p>
            <h2>{t("learnMore.h2.alloy")}</h2>
            <p>{t("learnMore.p5")}</p>
            <p>{t("learnMore.p6")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
