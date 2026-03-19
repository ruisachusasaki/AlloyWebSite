import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence, useScroll, useAnimationControls, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SeoHead } from "@/components/seo/seo-head";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { SchedulingModal } from "@/components/scheduling-modal";
import { SharedNavbar, SharedFooter } from "@/components/shared-layout";
import { SchedulingContext } from "@/context/scheduling-context";
import { SiMercadopago, SiAirbnb, SiGoogleads, SiFacebook, SiSlack } from "react-icons/si";
import {
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  ClipboardList,
  Bot,
  MapPin,
  QrCode,
  Database,
  Building2,
  UserCircle,
  Package,
  FileText,
  Mail,
  MessageCircle,
  Shield,
  ArrowLeftRight,
  LayoutDashboard,
  Webhook,
  CreditCard,
  Check,
  ArrowRight,
  Sparkles,
  Bell,
  Globe,
  Smartphone,
  FileSpreadsheet,
  Clock,
  Target,
  Zap,
  ShoppingCart,
  GraduationCap,
  RefreshCw,
  Plus,
  Layers,
  Store,
  LineChart,
  UserCheck
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  categoryId: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Communication": "142 76% 36%",   // Green
  "Productivity": "24 95% 53%",     // Orange
  "Security": "346 87% 43%",        // Red
  "Sales": "271 81% 56%",           // Purple
  "Analytics": "217 91% 60%",       // Blue
  "AI": "226 70% 55%",              // Indigo
  "Features": "173 80% 40%",        // Teal
  "Data": "190 90% 50%",            // Cyan
  "Industry": "45 93% 47%",         // Amber
  "Operations": "215 25% 40%",      // Slate/BlueGrey
  "Automation": "48 96% 51%",       // Yellow
  "Marketing": "330 81% 60%",       // Pink
  "Integration": "150 60% 45%",     // Emerald
  "Payments": "84 81% 44%",         // Lime
  "Development": "199 89% 48%",     // Sky
  "Education": "260 60% 60%"        // Violet
};

const getModules = (t: (key: string) => string): Module[] => [
  { id: "whatsapp", title: t("module.whatsapp.title"), description: t("module.whatsapp.description"), icon: MessageSquare, category: t("category.Communication"), categoryId: "Communication" },
  { id: "google-calendar", title: t("module.google-calendar.title"), description: t("module.google-calendar.description"), icon: Calendar, category: t("category.Productivity"), categoryId: "Productivity" },
  { id: "login-management", title: t("module.login-management.title"), description: t("module.login-management.description"), icon: Users, category: t("category.Security"), categoryId: "Security" },


  { id: "task-management", title: t("module.task-management.title"), description: t("module.task-management.description"), icon: ClipboardList, category: t("category.Productivity"), categoryId: "Productivity" },
  { id: "ai-agent", title: t("module.ai-agent.title"), description: t("module.ai-agent.description"), icon: Bot, category: t("category.AI"), categoryId: "AI" },
  { id: "geolocalization", title: t("module.geolocalization.title"), description: t("module.geolocalization.description"), icon: MapPin, category: t("category.Features"), categoryId: "Features" },
  { id: "qr-codes", title: t("module.qr-codes.title"), description: t("module.qr-codes.description"), icon: QrCode, category: t("category.Features"), categoryId: "Features" },
  { id: "airtable", title: t("module.airtable.title"), description: t("module.airtable.description"), icon: Database, category: t("category.Data"), categoryId: "Data" },
  { id: "real-estate", title: t("module.real-estate.title"), description: t("module.real-estate.description"), icon: Building2, category: t("category.Industry"), categoryId: "Industry" },
  { id: "client-portals", title: t("module.client-portals.title"), description: t("module.client-portals.description"), icon: Globe, category: t("category.Features"), categoryId: "Features" },
  { id: "inventory", title: t("module.inventory.title"), description: t("module.inventory.description"), icon: Package, category: t("category.Operations"), categoryId: "Operations" },
  { id: "document-generation", title: t("module.document-generation.title"), description: t("module.document-generation.description"), icon: FileText, category: t("category.Automation"), categoryId: "Automation" },
  { id: "email-marketing", title: t("module.email-marketing.title"), description: t("module.email-marketing.description"), icon: Mail, category: t("category.Marketing"), categoryId: "Marketing" },
  { id: "internal-chat", title: t("module.internal-chat.title"), description: t("module.internal-chat.description"), icon: MessageCircle, category: t("category.Communication"), categoryId: "Communication" },
  { id: "multi-role", title: t("module.multi-role.title"), description: t("module.multi-role.description"), icon: Shield, category: t("category.Security"), categoryId: "Security" },
  { id: "data-migration", title: t("module.data-migration.title"), description: t("module.data-migration.description"), icon: ArrowLeftRight, category: t("category.Data"), categoryId: "Data" },

  { id: "webhooks", title: t("module.webhooks.title"), description: t("module.webhooks.description"), icon: Webhook, category: t("category.Integration"), categoryId: "Integration" },
  { id: "payments", title: t("module.payments.title"), description: t("module.payments.description"), icon: CreditCard, category: t("category.Payments"), categoryId: "Payments" },
  { id: "notifications", title: t("module.notifications.title"), description: t("module.notifications.description"), icon: Bell, category: t("category.Communication"), categoryId: "Communication" },
  { id: "mobile-app", title: t("module.mobile-app.title"), description: t("module.mobile-app.description"), icon: Smartphone, category: t("category.Development"), categoryId: "Development" },
  { id: "excel-import", title: t("module.excel-import.title"), description: t("module.excel-import.description"), icon: FileSpreadsheet, category: t("category.Data"), categoryId: "Data" },
  { id: "scheduling", title: t("module.scheduling.title"), description: t("module.scheduling.description"), icon: Clock, category: t("category.Productivity"), categoryId: "Productivity" },
  { id: "lead-scoring", title: t("module.lead-scoring.title"), description: t("module.lead-scoring.description"), icon: Target, category: t("category.Sales"), categoryId: "Sales" },
  { id: "workflow-automation", title: t("module.workflow-automation.title"), description: t("module.workflow-automation.description"), icon: Zap, category: t("category.Automation"), categoryId: "Automation" },
  { id: "website-migration", title: t("module.website-migration.title"), description: t("module.website-migration.description"), icon: RefreshCw, category: t("category.Development"), categoryId: "Development" },

  { id: "course-platform", title: t("module.course-platform.title"), description: t("module.course-platform.description"), icon: GraduationCap, category: t("category.Education"), categoryId: "Education" },
  // New Modules
  { id: "mercadolibre", title: t("module.mercadolibre.title"), description: t("module.mercadolibre.description"), icon: SiMercadopago, category: t("category.Integration"), categoryId: "Integration" },
  { id: "ecommerce-creation", title: t("module.ecommerce-creation.title"), description: t("module.ecommerce-creation.description"), icon: Store, category: t("category.Development"), categoryId: "Development" },
  { id: "ecommerce-admin", title: t("module.ecommerce-admin.title"), description: t("module.ecommerce-admin.description"), icon: LayoutDashboard, category: t("category.Operations"), categoryId: "Operations" },
  { id: "airbnb", title: t("module.airbnb.title"), description: t("module.airbnb.description"), icon: SiAirbnb, category: t("category.Integration"), categoryId: "Integration" },
  { id: "google-ads", title: t("module.google-ads.title"), description: t("module.google-ads.description"), icon: SiGoogleads, category: t("category.Marketing"), categoryId: "Marketing" },
  { id: "facebook-ads", title: t("module.facebook-ads.title"), description: t("module.facebook-ads.description"), icon: SiFacebook, category: t("category.Marketing"), categoryId: "Marketing" },
  { id: "data-analytics", title: t("module.data-analytics.title"), description: t("module.data-analytics.description"), icon: LineChart, category: t("category.Analytics"), categoryId: "Analytics" },
  { id: "slack", title: t("module.slack.title"), description: t("module.slack.description"), icon: SiSlack, category: t("category.Communication"), categoryId: "Communication" },
  { id: "client-management", title: t("module.client-management.title"), description: t("module.client-management.description"), icon: UserCheck, category: t("category.Sales"), categoryId: "Sales" },
];

function ModuleCard({
  module,
  isSelected,
  onToggle,
  index
}: {
  module: Module;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = module.icon;
  const tiltRef = useRef<HTMLDivElement>(null);
  const color = CATEGORY_COLORS[module.categoryId] || "215 25% 27%";
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  // Row-based stagger: 3 cols on xl, 2 on smaller screens
  const cols = typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches ? 3 : 2;
  const staggerDelay = Math.floor(index / cols) * 0.08 + (index % cols) * 0.03;

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: staggerDelay }
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = tiltRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // CSS custom properties inherit to inner card for glow tracking
    wrapper.style.setProperty('--mouse-x', `${x}%`);
    wrapper.style.setProperty('--mouse-y', `${y}%`);

    if (!prefersReducedMotion) {
      const rotateY = ((x - 50) / 50) * 6;
      const rotateX = ((y - 50) / 50) * -6;
      wrapper.style.transition = 'none';
      wrapper.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      wrapper.style.willChange = 'transform';
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const wrapper = tiltRef.current;
    if (wrapper) {
      wrapper.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      wrapper.style.transform = '';
      wrapper.style.willChange = 'auto';
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    // Radial ripple from click point
    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const rx = ((e.clientX - rect.left) / rect.width) * 100;
      const ry = ((e.clientY - rect.top) / rect.height) * 100;
      setRipple({ x: rx, y: ry, key: Date.now() });

      if (!isSelected) {
        // Select pulse: 1.0 → 0.95 → 1.02 → 1.0
        await controls.start({
          scale: [1, 0.95, 1.02, 1],
          transition: { duration: 0.2, times: [0, 0.3, 0.7, 1], ease: "easeOut" }
        });
      } else {
        // Deselect pulse: 1.0 → 1.02 → 0.98 → 1.0
        await controls.start({
          scale: [1, 1.02, 0.98, 1],
          transition: { duration: 0.15, times: [0, 0.3, 0.7, 1], ease: "easeOut" }
        });
      }
    }

    onToggle();
  };

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        whileTap={{ scale: 0.97 }}
        className={`module-glass-card relative w-full h-full text-left p-4 md:p-6 rounded-2xl group overflow-hidden
          ${isSelected
            ? "border-transparent"
            : "border-border/40"
          }
          backdrop-blur-xl border`}
        style={{
          background: isSelected
            ? `linear-gradient(135deg, hsl(${color} / 0.15), hsl(${color} / 0.05), transparent)`
            : `linear-gradient(135deg, hsl(${color} / 0.03), hsl(var(--card) / 0.8), hsl(var(--card) / 0.5))`,
          borderColor: isSelected ? `hsl(${color} / 0.5)` : undefined,
          boxShadow: isSelected
            ? `0 0 40px -10px hsl(${color} / 0.3)`
            : isHovered
              ? `0 12px 40px -12px hsl(${color} / 0.2)`
              : undefined,
        }}
        data-testid={`module-card-${module.id}`}
      >
        {/* Mouse-tracking glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(${color} / 0.15), transparent 50%)`
          }}
        />

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, hsl(${color} / 0.05), transparent, hsl(${color} / 0.02))`
          }}
        />

        {/* Click ripple */}
        {ripple && (
          <motion.div
            key={ripple.key}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => setRipple(null)}
            className="absolute rounded-full pointer-events-none z-10"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              width: 120,
              height: 120,
              marginLeft: -60,
              marginTop: -60,
              background: `radial-gradient(circle, hsl(${color} / 0.3), transparent 70%)`
            }}
          />
        )}

        {/* Checkmark with scale overshoot + exit */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center shadow-lg z-20"
              style={{ backgroundColor: `hsl(${color})`, boxShadow: `0 0 15px hsl(${color} / 0.4)` }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Icon container — glow intensifies on hover */}
        <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-3 md:mb-5 transition-all duration-500 overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              backgroundColor: isSelected ? `hsl(${color})` : `hsl(${color} / ${isHovered ? 0.15 : 0.08})`,
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent transition-opacity duration-300"
            style={{ opacity: isHovered && !isSelected ? 1 : 0.7 }}
          />
          <Icon
            className="w-5 h-5 md:w-7 md:h-7 relative z-10 transition-colors duration-500"
            style={{ color: isSelected ? '#ffffff' : `hsl(${color})` }}
          />
        </div>

        <h3 className="font-bold text-foreground mb-2 text-sm md:text-lg tracking-tight">{module.title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">{module.description}</p>

        {/* Category badge — border & bg shift on hover */}
        <span
          className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 border"
          style={{
            backgroundColor: isSelected ? `hsl(${color} / 0.2)` : `hsl(${color} / ${isHovered ? 0.1 : 0.05})`,
            color: `hsl(${color})`,
            borderColor: `hsl(${color} / ${isHovered ? 0.35 : 0.2})`
          }}
        >
          {module.category}
        </span>
      </motion.button>
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${8 + i * 12}%`,
  top: `${10 + ((i * 37) % 80)}%`,
  size: i % 2 === 0 ? "1px" : "0.5px",
  duration: 8 + (i % 5),
  delay: i * 1.2,
}));

const HERO_STATS = [
  { color: "bg-primary", key: "build.hero.stat1" },
  { color: "bg-primary", key: "build.hero.stat2" },
  { color: "bg-accent", key: "build.hero.stat3" },
];

const HERO_EASE = [0.22, 1, 0.36, 1] as const;

function HeroSection() {
  const { t } = useLanguage();

  // Stagger delays — 0.2s base accounts for page transition
  const d = { number: 0.2, badge: 0.35, heading: 0.5, subtitle: 0.7, statsBase: 0.85, scroll: 1.3 };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Floating gradient orbs — synced with landing page */}
      <div
        className="absolute rounded-full pointer-events-none w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
        style={{
          top: "10%",
          left: "5%",
          background: "radial-gradient(circle, hsl(199 89% 48% / 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float-orb 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
        style={{
          top: "50%",
          right: "5%",
          background: "radial-gradient(circle, hsl(280 70% 55% / 0.08) 0%, hsl(199 89% 48% / 0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float-orb-reverse 14s ease-in-out infinite",
        }}
      />

      {/* Ambient particles — subtle, slow drift */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/15"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.15, 0.08, 0.15] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Ghost text — large faded backdrop */}
      <div className="ghost-text left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[1]" aria-hidden>
        BUILD
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Section number */}
        <motion.span
          className="section-number"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: d.number, ease: HERO_EASE }}
        >
          01 /
        </motion.span>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: d.badge }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-8 backdrop-blur-sm shadow-lg shadow-primary/10"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-current">Interactive Solution Builder</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </motion.div>

        {/* Heading — clamp sizing, font-weight mixing, tight tracking */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: d.heading, ease: HERO_EASE }}
          className="font-light text-foreground mb-6 leading-[1.05] heading-glow"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 4rem)", letterSpacing: "-0.03em" }}
        >
          <span className="font-light-display">
            {useLanguage()?.t ? (useLanguage().t("build.hero.title.line1") || "Architect Your") : "Architect Your"}
          </span>{" "}
          <span className="relative inline-block">
            <span className="font-heavy bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              {useLanguage()?.t ? (useLanguage().t("build.hero.title.highlight") || "Digital Empire") : "Digital Empire"}
            </span>
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: d.heading + 0.3 }}
            />
          </span>
        </motion.h1>

        {/* Subheadline — monospace prefix accent */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: d.subtitle, ease: HERO_EASE }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10"
        >
          <span className="font-mono text-primary/50 mr-1">&gt;</span>
          {useLanguage()?.t ? (useLanguage().t("build.hero.subtitle.line1") || "Select the modules that power your vision. We craft a") : "Select the modules that power your vision. We craft a"}{" "}
          <span className="text-foreground font-semibold">
            {useLanguage()?.t ? (useLanguage().t("build.hero.subtitle.highlight") || "unified platform") : "unified platform"}
          </span>{" "}
          {useLanguage()?.t ? (useLanguage().t("build.hero.subtitle.line2") || "that eliminates tool chaos and amplifies your business.") : "that eliminates tool chaos and amplifies your business."}
        </motion.p>

        {/* Stats — individually staggered with pulse-once dots */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          {HERO_STATS.map((stat, i) => (
            <motion.div
              key={stat.key}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: d.statsBase + i * 0.15, ease: HERO_EASE }}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${stat.color}`}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.4, delay: d.statsBase + i * 0.15 + 0.1 }}
              />
              <span>{t(stat.key)}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d.scroll, duration: 0.6 }}
      >
        <div className="scroll-indicator rounded-full" />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

const CATEGORY_IDS = Object.keys(CATEGORY_COLORS);

function HeroDivider() {
  const { t } = useLanguage();
  const categories = CATEGORY_IDS.map(id => t(`category.${id}`));
  const doubled = [...categories, ...categories];

  return (
    <div className="relative">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="hero-marquee py-3 bg-secondary/30">
        <div className="hero-marquee-track text-xs uppercase tracking-[0.2em] font-mono text-muted-foreground/40">
          {doubled.map((cat, i) => (
            <span key={i} className="inline-flex items-center">
              <span>{cat}</span>
              <span className="mx-4 text-muted-foreground/20">&bull;</span>
            </span>
          ))}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}

function MoreFeaturesSection({ onScheduleClick }: { onScheduleClick: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-16 text-center"
    >
      <div className="relative block w-full max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <Plus className="w-8 h-8 text-primary" />
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t("build.more.title")}
          </h3>

          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            {t("build.more.subtitle.line1")} <span className="text-foreground font-semibold">{t("build.more.subtitle.highlight")}</span> {t("build.more.subtitle.line2")}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[t("build.more.tag1"), t("build.more.tag2"), t("build.more.tag3"), t("build.more.tag4"), t("build.more.tag5")].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-sm bg-muted/60 text-muted-foreground border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>

          <Button
            size="lg"
            onClick={onScheduleClick}
            className="gap-2 px-8 font-semibold"
            data-testid="button-more-features"
          >
            <Layers className="w-5 h-5" />
            {t("build.more.cta")}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}


export default function BuildSolutionPage() {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [showScheduling, setShowScheduling] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    description: "",
    customRequest: ""
  });

  const { t } = useLanguage();
  const modules = getModules(t);

  const toggleModule = (id: string) => {
    setSelectedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearAll = () => {
    setSelectedModules(new Set());
  };

  const getSelectedModuleNames = () => {
    return modules
      .filter(m => selectedModules.has(m.id))
      .map(m => m.title);
  };

  const handleRequestQuote = () => {
    setShowScheduling(true);
  };

  const buildDescription = () => {
    const selectedNames = getSelectedModuleNames();
    let desc = formData.description || t("build.desc.default");

    if (selectedNames.length > 0) {
      desc += `\n\n${t("build.desc.selectedModules")} (${selectedNames.length}):\n- ${selectedNames.join("\n- ")}`;
    }

    if (formData.customRequest) {
      desc += `\n\n${t("build.desc.customRequest")}:\n${formData.customRequest}`;
    }

    if (formData.companyName) {
      desc += `\n\n${t("build.desc.company")}: ${formData.companyName}`;
    }

    return desc;
  };

  const openScheduling = () => setShowScheduling(true);

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div className="min-h-screen bg-background noise-bg">
        <ScrollProgress />
        <SeoHead
          title={t("build.seo.title")}
          description={t("build.seo.description")}
          path="/build"
          ogTitle={t("seo.build.ogTitle")}
          ogDescription={t("seo.build.ogDescription")}
          ogImage={t("seo.landing.ogImage")}
        />
        <BreadcrumbSchema items={[
          { name: t("breadcrumb.home"), url: "https://alloyready.io/" },
          { name: t("breadcrumb.build"), url: "https://alloyready.io/build" },
        ]} />

        <SharedNavbar />

        <main className="pb-32">
          <HeroSection />
          <HeroDivider />

          <div className="max-w-7xl mx-auto px-6 mt-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5">
                  {modules.map((module, index) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isSelected={selectedModules.has(module.id)}
                      onToggle={() => toggleModule(module.id)}
                      index={index}
                    />
                  ))}
                </div>

                <MoreFeaturesSection onScheduleClick={openScheduling} />
              </div>

              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-2xl blur-xl" />
                    <div className="relative bg-gradient-to-br from-card/95 via-card/90 to-card/85 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-foreground text-lg">{t("build.sidebar.title")}</h2>
                        {selectedModules.size > 0 && (
                          <button
                            onClick={clearAll}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            data-testid="button-clear-all"
                          >
                            {t("build.sidebar.clearAll")}
                          </button>
                        )}
                      </div>

                      <div className="min-h-[180px] max-h-[280px] overflow-y-auto mb-6 scrollbar-thin" data-lenis-prevent>
                        <AnimatePresence mode="popLayout">
                          {selectedModules.size === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center justify-center py-8 text-center"
                            >
                              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                                <Layers className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {t("build.sidebar.emptyState")}
                              </p>
                            </motion.div>
                          ) : (
                            <ul className="space-y-2">
                              {getSelectedModuleNames().map((name) => (
                                <motion.li
                                  key={name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="flex items-center gap-2 text-sm text-foreground p-2 rounded-lg bg-primary/5 border border-primary/10"
                                >
                                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                  {name}
                                </motion.li>
                              ))}
                            </ul>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border-t border-border/50 pt-4 mb-5">
                        <p className="text-sm text-muted-foreground mb-1">{t("build.sidebar.selectedModules")}</p>
                        <p className="text-3xl font-bold text-foreground">{selectedModules.size}</p>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder={t("build.sidebar.inputName")}
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-background/50 border-border/50"
                          data-testid="input-name"
                        />
                        <Input
                          placeholder={t("build.sidebar.inputEmail")}
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-background/50 border-border/50"
                          data-testid="input-email"
                        />
                        <Input
                          placeholder={t("build.sidebar.inputCompany")}
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="bg-background/50 border-border/50"
                          data-testid="input-company"
                        />
                        <Textarea
                          placeholder={t("build.sidebar.inputDescription")}
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="min-h-[80px] resize-none bg-background/50 border-border/50"
                          data-testid="input-description"
                        />
                        <Textarea
                          placeholder={t("build.sidebar.inputCustom")}
                          value={formData.customRequest}
                          onChange={(e) => setFormData(prev => ({ ...prev, customRequest: e.target.value }))}
                          className="min-h-[60px] resize-none bg-background/50 border-border/50"
                          data-testid="input-custom-request"
                        />
                      </div>

                      <Button
                        onClick={handleRequestQuote}
                        disabled={!formData.name || !formData.email}
                        className="w-full mt-5 gap-2 font-semibold h-auto whitespace-normal text-center py-4"
                        size="lg"
                        data-testid="button-request-quote"
                      >
                        {t("build.sidebar.requestQuote")}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 p-4 z-40 shadow-2xl shadow-background/50">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t("build.mobile.selectedModules")}</p>
                  <p className="text-xl font-bold text-foreground">{selectedModules.size} {t("build.mobile.selected")}</p>
                </div>
                {selectedModules.size > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-muted-foreground hover:text-foreground"
                    data-testid="button-clear-all-mobile"
                  >
                    {t("build.sidebar.clearAll")}
                  </button>
                )}
              </div>

              <Button
                onClick={handleRequestQuote}
                className="w-full gap-2 font-semibold"
                size="lg"
                data-testid="button-request-quote-mobile"
              >
                {t("build.mobile.continue")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>

        <SharedFooter />

        <SchedulingModal
          open={showScheduling}
          onOpenChange={setShowScheduling}
          prefillData={{
            name: formData.name,
            email: formData.email,
            businessDescription: buildDescription()
          }}
        />
      </div>
    </SchedulingContext.Provider>
  );
}
