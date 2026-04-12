import { useState } from "react";
import { SeoHead } from "@/components/seo/seo-head";
import { FAQSchema } from "@/components/seo/structured-data";
import { SharedNavbar, SharedFooter } from "@/components/shared-layout";
import { SchedulingContext } from "@/context/scheduling-context";
import { SchedulingModal } from "@/components/scheduling-modal";
import { FAQSection } from "@/components/faq-section";
import { useLanguage } from "@/context/language-context";

const ALL_FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export default function FAQPage() {
  const { t } = useLanguage();
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const openScheduling = () => setSchedulingOpen(true);

  const faqItems = ALL_FAQ_KEYS.map((k) => ({
    question: t(`faq.q${k}`),
    answer: t(`faq.a${k}`),
  }));

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div className="min-h-screen bg-background">
        <SeoHead
          title={t("faq.page.title")}
          description={t("faq.page.description")}
          path="/faq"
        />
        <FAQSchema items={faqItems} />
        <SharedNavbar />

        <main className="pt-20">
          <FAQSection mode="full" />
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
