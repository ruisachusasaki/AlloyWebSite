import { useState, useEffect, useRef, useContext } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
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
  Send,
  Lock,
  Rocket,
  ShoppingCart
} from "lucide-react";
import {
  SiNotion, SiZapier, SiAirtable, SiGooglesheets, SiHubspot, SiTrello, SiClickup, SiSlack,
  SiWhatsapp, SiAsana, SiGooglemeet, SiZoom, SiSap, SiTwilio, SiSalesforce, SiMailchimp,
  SiShopify, SiWordpress, SiTelegram, SiGmail, SiGooglecalendar, SiStripe
} from "react-icons/si";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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


function HeroSection({ onScheduleClick }: { onScheduleClick: () => void }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
      <div className="hero-glow" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="space-y-10"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] text-balance"
          >
            {t("hero.title.line1")}{" "}
            <span className="text-primary">{t("hero.title.highlight")}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="text-lg font-bold shimmer-btn glow-border w-full sm:w-auto"
                onClick={() => onScheduleClick()}
                data-testid="button-cta-hero"
              >
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
            <span className="text-muted-foreground text-sm">{t("hero.noCommitment")}</span>
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
  index
}: {
  app: { icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; imageSrc?: string; name: string; color: string; x: number; y: number; rotate: number; scale: number; zIndex: number; iconSize: string; useThemeColor?: boolean };
  progress: any;
  index: number
}) {
  const x = useTransform(progress, [0, 0.5, 0.85, 1], [app.x, app.x * 0.6, app.x * 0.1, 0]);
  const y = useTransform(progress, [0, 0.5, 0.85, 1], [app.y, app.y * 0.6, app.y * 0.1, 0]);
  const rotate = useTransform(progress, [0, 0.7, 1], [app.rotate, app.rotate * 0.3, 0]);
  const scale = useTransform(progress, [0, 0.7, 0.9, 1], [app.scale, app.scale, 0.7, 0]);
  const opacity = useTransform(progress, [0, 0.8, 0.95, 1], [1, 1, 0.5, 0]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-grab active:cursor-grabbing"
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
      drag
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.3}
      whileHover={{ scale: app.scale * 1.15, zIndex: 100 }}
      whileTap={{ scale: app.scale * 0.95 }}
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
        <span className="text-[8px] md:text-[10px] text-muted-foreground font-medium whitespace-nowrap">{app.name}</span>
      </div>
    </motion.div>
  );
}

function SpaghettiChaosSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

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
  const unifiedScale = useTransform(scrollYProgress, [0.75, 0.9, 1], [0.5, 0.8, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const headlineOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.9, 1], [30, 0]);

  const chaosTextOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);

  return (
    <section id="problem" ref={containerRef} className="relative md:mt-24" style={{ height: "200vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-start md:justify-center overflow-x-hidden pt-12 md:pt-0 gap-4 md:gap-8"
      >
        <motion.div
          className="text-center mb-4 md:mb-8 px-6"
          style={{ opacity: chaosTextOpacity }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4">
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
              <ChaosIcon key={app.name} app={app} progress={scrollYProgress} index={i} />
            ))}
          </div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: unifiedOpacity, scale: unifiedScale }}
          >
            <motion.div
              className="absolute w-80 h-80 rounded-full"
              style={{
                opacity: glowOpacity,
                background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
                filter: "blur(40px)"
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
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 px-4">
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

function PricingSection() {
  const { t } = useLanguage();
  const { openScheduling } = useContext(SchedulingContext);

  const plans = [
    {
      id: "ecommerce",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/20",
      icon: ShoppingCart,
      title: t("pricing.ecommerce.title"),
      subtitle: t("pricing.ecommerce.subtitle"),
      description: t("pricing.ecommerce.description"),
      priceSetup: t("pricing.ecommerce.price.setup"),
      priceMonthly: t("pricing.ecommerce.price.monthly"),
      features: [
        t("pricing.ecommerce.feature1"),
        t("pricing.ecommerce.feature2"),
        t("pricing.ecommerce.feature3"),
        t("pricing.ecommerce.feature4"),
        t("pricing.ecommerce.feature5")
      ],
      goal: t("pricing.ecommerce.goal")
    },
    {
      id: "premium",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/20",
      icon: TrendingUp,
      title: t("pricing.premium.title"),
      subtitle: t("pricing.premium.subtitle"),
      description: t("pricing.premium.description"),
      priceSetup: t("pricing.premium.price.setup"),
      priceMonthly: t("pricing.premium.price.monthly"),
      features: [
        t("pricing.premium.feature1"),
        t("pricing.premium.feature2"),
        t("pricing.premium.feature3"),
        t("pricing.premium.feature4")
      ],
      goal: t("pricing.premium.goal")
    },
    {
      id: "enterprise",
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/20",
      icon: Building2,
      title: t("pricing.enterprise.title"),
      subtitle: t("pricing.enterprise.subtitle"),
      description: t("pricing.enterprise.description"),
      priceSetup: t("pricing.enterprise.price.setup"),
      priceMonthly: t("pricing.enterprise.price.monthly"),
      features: [
        t("pricing.enterprise.feature1"),
        t("pricing.enterprise.feature2"),
        t("pricing.enterprise.feature3"),
        t("pricing.enterprise.feature4")
      ],
      goal: t("pricing.enterprise.goal")
    }
  ];

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <DollarSign className="w-4 h-4" />
            {t("nav.pricing")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            {t("pricing.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border ${plan.borderColor} bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-500 group overflow-hidden flex flex-col`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <plan.icon className="w-7 h-7 text-foreground" />
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black mb-2">{plan.title}</h3>
                  <p className="text-primary font-bold text-sm uppercase tracking-wider mb-4">{plan.subtitle}</p>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-8 p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {plan.priceSetup}
                  </div>
                  <div className="text-2xl font-black">{plan.priceMonthly}</div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <p className="text-xs font-semibold text-center text-primary mb-4 italic">"{plan.goal}"</p>
                  <Button
                    size="lg"
                    className="w-full font-bold shimmer-btn"
                    onClick={() => openScheduling(plan.title)}
                  >
                    {t("pricing.cta")}
                  </Button>
                </div>
              </div>
            </motion.div>
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
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Bot className="w-4 h-4" />
              {t("ai.badge")}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
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
            <div className="bento-card p-6 md:p-8">
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
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
                  <div className="p-3 rounded-xl bg-primary text-primary-foreground max-w-[80%]">
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
                  <div className="p-3 rounded-xl bg-muted/50 border border-border max-w-[85%]">
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
                  <div className="p-3 rounded-xl bg-primary text-primary-foreground max-w-[80%]">
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
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
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
  const [showYourPlatform, setShowYourPlatform] = useState(true);

  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            {t("comparison.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("comparison.subtitle")}
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-muted/50 border border-border">
            <Button
              variant={!showYourPlatform ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowYourPlatform(false)}
              className={`toggle-elevate ${!showYourPlatform ? 'toggle-elevated' : ''}`}
              data-testid="button-toggle-standard"
            >
              {t("comparison.standardSaas")}
            </Button>
            <Button
              variant={showYourPlatform ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowYourPlatform(true)}
              className={`toggle-elevate ${showYourPlatform ? 'toggle-elevated' : ''}`}
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
              <div className="bento-card p-6 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <RefreshCw className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold mb-2 text-muted-foreground">{t("comparison.standard.slowUpdates")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.standard.slowUpdatesDesc")}</p>
              </div>
              <div className="bento-card p-6 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold mb-2 text-muted-foreground">{t("comparison.standard.staticTools")}</h4>
                <p className="text-sm text-muted-foreground">{t("comparison.standard.staticToolsDesc")}</p>
              </div>
              <div className="bento-card p-6 opacity-60">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

function ProofSection() {
  const { t } = useLanguage();
  const portfolioItems = [
    {
      name: "Wealthfit.com",
      category: t("proof.wealthfit.category"),
      description: t("proof.wealthfit.description"),
      icon: DollarSign,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      evolutionTag: t("proof.wealthfit.tag"),
      link: "https://wealthfit.com",
    },
    {
      name: "EventGrowth.app",
      category: t("proof.eventgrowth.category"),
      description: t("proof.eventgrowth.description"),
      icon: TrendingUp,
      gradient: "from-blue-500/20 to-blue-500/5",
      evolutionTag: t("proof.eventgrowth.tag"),
      link: "https://eventgrowth.app",
    },
    {
      name: "AgencyBoost.app",
      category: t("proof.agencyboost.category"),
      description: t("proof.agencyboost.description"),
      icon: Briefcase,
      gradient: "from-purple-500/20 to-purple-500/5",
      evolutionTag: t("proof.agencyboost.tag"),
      link: "https://agencyboost.app",
    },
    {
      name: "DataLight.app",
      category: t("proof.datalight.category"),
      description: t("proof.datalight.description"),
      icon: Layers,
      gradient: "from-cyan-500/20 to-cyan-500/5",
      evolutionTag: t("proof.datalight.tag"),
      link: "https://datalight.app",
    },
  ];

  return (
    <section id="proof" className="py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            {t("proof.badge")}
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            {t("proof.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("proof.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="portfolio-card group cursor-pointer block"
              data-testid={`card-portfolio-${item.name.toLowerCase().replace('.', '-')}`}
            >
              <div className={`h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative`}>
                <div className="w-20 h-20 rounded-2xl bg-background/50 backdrop-blur flex items-center justify-center">
                  <item.icon className="w-10 h-10 text-foreground" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">{item.category}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium"
                  data-testid={`tag-evolution-${item.name.toLowerCase().replace('.', '-')}`}
                >
                  <Sparkles className="w-3 h-3" />
                  {item.evolutionTag}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsSection() {
  const { t } = useLanguage();
  const industries = [
    { name: t("clients.realEstate"), icon: Building2 },
    { name: t("clients.supplyChain"), icon: Layers },
    { name: t("clients.finance"), icon: DollarSign },
    { name: t("clients.agencies"), icon: Briefcase },
  ];

  return (
    <section id="clients" className="py-24 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-muted-foreground text-lg">{t("clients.title")}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <industry.icon className="w-8 h-8 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{industry.name}</span>
            </motion.div>
          ))}
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
        <PricingSection />
        <AIPartnerSection />
        <ComparisonToggleSection />
        <ProofSection />
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
