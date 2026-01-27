import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { SchedulingModal } from "@/components/scheduling-modal";

const SchedulingContext = createContext<{ openScheduling: () => void }>({ openScheduling: () => {} });
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
  Rocket
} from "lucide-react";
import { 
  SiNotion, SiZapier, SiAirtable, SiGooglesheets, SiHubspot, SiTrello, SiClickup, SiSlack,
  SiWhatsapp, SiAsana, SiGooglemeet, SiZoom, SiSap, SiTwilio, SiSalesforce, SiMailchimp,
  SiShopify, SiWordpress, SiTelegram, SiGmail, SiGooglecalendar, SiStripe
} from "react-icons/si";
import { FaShoppingCart } from "react-icons/fa";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import darwinLogo from "@assets/darwin-ai-logo_1769368824707.png";
import meliLogo from "@assets/image_1769370076739.png";
import tokkoLogo from "@assets/tokko_broker_logo_(1)_1_1769369724733.png";

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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const { openScheduling } = useContext(SchedulingContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portfolioItems = [
    { name: "Wealthfit", desc: "Financial Systems", icon: DollarSign },
    { name: "EventGrowth", desc: "Growth Infrastructure", icon: TrendingUp },
    { name: "AgencyBoost", desc: "Internal Automations", icon: Briefcase },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2" data-testid="link-logo">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">
            <span className="text-primary">System</span>
            <span className="text-foreground">Forge</span>
          </span>
        </a>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#solution" className="text-sm text-muted-foreground transition-colors" data-testid="link-solutions">
            Solutions
          </a>
          
          <div 
            className="relative"
            onMouseEnter={() => setPortfolioOpen(true)}
            onMouseLeave={() => setPortfolioOpen(false)}
          >
            <button 
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors"
              data-testid="button-portfolio"
            >
              Portfolio
              <ChevronDown className={`w-4 h-4 transition-transform ${portfolioOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {portfolioOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden"
                >
                  {portfolioItems.map((item) => (
                    <a
                      key={item.name}
                      href="#proof"
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover-elevate"
                      data-testid={`link-portfolio-${item.name.toLowerCase()}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <a href="#clients" className="text-sm text-muted-foreground transition-colors" data-testid="link-clients">
            Clients
          </a>
          <a href="#contact" className="text-sm text-muted-foreground transition-colors" data-testid="link-contact">
            Contact
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            size="sm" 
            className="font-semibold shimmer-btn glow-border"
            onClick={openScheduling}
            data-testid="button-cta-nav"
          >
            Schedule a Call
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
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
              Productized Software Development
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] text-balance"
          >
            Stop duct-taping your business together with{" "}
            <span className="text-primary">10 different apps.</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            I build the one platform that does it all—exactly how you work. 
            Replace your messy tech stack with a single, custom-coded digital backbone.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="text-lg font-bold shimmer-btn glow-border"
              data-testid="button-cta-hero"
            >
              Book a 15-minute System Audit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <span className="text-muted-foreground text-sm">No commitment required</span>
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
    <section id="problem" ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div 
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-visible pt-16 md:pt-0"
      >
        <motion.div
          className="text-center mb-4 md:mb-8 px-6"
          style={{ opacity: chaosTextOpacity }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4">
            Your business is{" "}
            <span className="text-destructive">drowning</span> in tabs.
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            I build the one that matters.
          </p>
        </motion.div>

        <div className="relative w-full max-w-6xl h-[420px] sm:h-[520px] md:h-[620px] flex items-center justify-center">
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
                <Zap className="w-16 h-16 md:w-24 md:h-24 text-primary-foreground" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
            style={{ opacity: headlineOpacity, y: headlineY }}
            data-testid="text-unified-headline"
          >
            <h3 className="text-2xl md:text-4xl font-black text-foreground mb-2">
              One System. <span className="text-primary">No Chaos.</span>
            </h3>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
          style={{ opacity: chaosTextOpacity }}
        >
          <p className="text-destructive font-semibold text-sm md:text-base">$2,400+/mo in scattered subscriptions</p>
        </motion.div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: chaosTextOpacity }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-muted-foreground text-xs flex flex-col items-center gap-1"
          >
            <span>Scroll to unify</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BentoGridSection() {
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
    <section id="solution" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            The <span className="text-primary">Productized</span> Model
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One flat fee. Unlimited evolution. Zero technical debt.
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
              A tool that grows at the speed of your imagination.
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Stop waiting for roadmap updates from giant SaaS companies. If your business needs a new feature, a custom report, or a fresh automation—we receive your request and <span className="text-foreground font-semibold">start building it the same day</span>. Your subscription includes unlimited, immediate development.
            </p>
            
            {/* Feature Request → Live Feature Animation */}
            <div className="flex items-center gap-4 md:gap-6">
              <motion.div 
                className="flex-1 p-4 rounded-xl bg-muted/50 border border-border"
                initial={{ x: 0 }}
                whileInView={{ x: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Feature Request</span>
                </div>
                <p className="text-sm font-medium">"I need a client portal with live updates"</p>
              </motion.div>
              
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-6 h-6 text-primary" />
              </motion.div>
              
              <motion.div 
                className="flex-1 p-4 rounded-xl bg-primary/10 border border-primary/20"
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Live Feature</span>
                </div>
                <p className="text-sm font-medium">Client Portal deployed & active</p>
              </motion.div>
            </div>
            
            <p className="text-sm text-primary font-semibold mt-6">
              Request → Reality. No extra fees, no tickets, just progress.
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
            <h3 className="text-xl font-black mb-2 tracking-tight">Custom Context AI</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Generic AI is for writing emails. Your built-in AI Partner is for <span className="text-foreground font-medium">running a company</span>.
            </p>
            
            {/* Mini Chat Preview */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <span className="text-muted-foreground">You:</span>
                <p className="mt-1">"Top 3 clients this month?"</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-primary">AI:</span>
                <p className="mt-1">Based on your CRM data: [Client A], [Client B], [Client C]</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Your data never leaves your ecosystem</span>
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
            <h3 className="text-xl font-bold mb-3">Total Integration</h3>
            <p className="text-muted-foreground">
              Connect your existing tools or <span className="text-foreground font-semibold">replace them entirely</span>. Your platform, your rules.
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
            <h3 className="text-xl font-bold mb-3">Zero Maintenance</h3>
            <p className="text-muted-foreground">
              Stop paying for Zapier experts. I am your dedicated systems partner.
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bento-card md:col-span-3 p-8 md:p-10 bg-gradient-to-br from-primary/10 via-card to-card"
            onMouseMove={handleMouseMove}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Fixed Pricing</h3>
                <p className="text-muted-foreground text-lg">
                  No hourly billing. No surprises. <span className="text-primary font-bold">$1,000/mo</span> for a platform that never stops evolving.
                </p>
              </div>
              <Button 
                size="lg" 
                className="font-bold shimmer-btn"
                onClick={openScheduling}
                data-testid="button-cta-bento"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AIPartnerSection() {
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
              Built-in AI Partner
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Meet the AI that actually <span className="text-primary">knows</span> your business.
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Generic AI is for writing emails. Your built-in AI Partner is for <span className="text-foreground font-semibold">running a company</span>.
            </p>
            
            {/* Key Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Zero Generic Responses</h4>
                  <p className="text-muted-foreground text-sm">It doesn't guess; it calculates based on your actual data.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Feature Integration</h4>
                  <p className="text-muted-foreground text-sm">The AI can trigger actions, like "Send a WhatsApp to all pending leads."</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Privacy First</h4>
                  <p className="text-muted-foreground text-sm">Your data never leaves your private ecosystem.</p>
                </div>
              </div>
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
                  <h4 className="font-bold text-sm">AI Partner</h4>
                  <p className="text-xs text-muted-foreground">Connected to your platform</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Live</span>
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
                    "Who are my top 3 real estate clients this month?"
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
                    <p className="mb-2">Based on your integrated Mercado Libre data and internal CRM:</p>
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
                    "Send a WhatsApp to all pending leads"
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
                      <span>Sent to 23 leads via WhatsApp Business API</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Input Area */}
              <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border">
                <input 
                  type="text" 
                  placeholder="Ask your AI Partner..."
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
      </div>
    </section>
  );
}

function ComparisonToggleSection() {
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
            See the difference
          </h2>
          <p className="text-muted-foreground">
            Toggle between approaches to see what you're missing.
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
              Standard SaaS
            </Button>
            <Button
              variant={showYourPlatform ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowYourPlatform(true)}
              className={`toggle-elevate ${showYourPlatform ? 'toggle-elevated' : ''}`}
              data-testid="button-toggle-platform"
            >
              Your Platform
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
                <h4 className="font-bold mb-2 text-muted-foreground">Slow Updates</h4>
                <p className="text-sm text-muted-foreground">Wait months for features on someone else's roadmap.</p>
              </div>
              <div className="bento-card p-6 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold mb-2 text-muted-foreground">Static Tools</h4>
                <p className="text-sm text-muted-foreground">One-size-fits-all solutions that don't adapt to you.</p>
              </div>
              <div className="bento-card p-6 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold mb-2 text-muted-foreground">Generic AI</h4>
                <p className="text-sm text-muted-foreground">AI that knows nothing about your specific business.</p>
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
                <h4 className="font-bold mb-2">Instant Updates</h4>
                <p className="text-sm text-muted-foreground">Request today, deployed today. No waiting.</p>
              </div>
              <div className="bento-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold mb-2">Living Platform</h4>
                <p className="text-sm text-muted-foreground">Evolves continuously based on your exact needs.</p>
              </div>
              <div className="bento-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold mb-2">Integrated AI</h4>
                <p className="text-sm text-muted-foreground">AI trained on your data, processes, and context.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProofSection() {
  const portfolioItems = [
    {
      name: "Wealthfit.com",
      category: "Financial Systems",
      description: "Unified investment tracking, client portal, and automated reporting for a wealth management firm.",
      icon: DollarSign,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      evolutionTag: "Evolved with 100+ custom features since launch",
    },
    {
      name: "EventGrowth.app",
      category: "Growth Infrastructure",
      description: "End-to-end event management with ticketing, CRM, marketing automation, and analytics.",
      icon: TrendingUp,
      gradient: "from-blue-500/20 to-blue-500/5",
      evolutionTag: "Evolved with 100+ custom features since launch",
    },
    {
      name: "AgencyBoost.app",
      category: "Internal Automations",
      description: "Project management, time tracking, invoicing, and client communication in one platform.",
      icon: Briefcase,
      gradient: "from-purple-500/20 to-purple-500/5",
      evolutionTag: "Evolved with 100+ custom features since launch",
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
            The Proof
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Real systems. Real results.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Case studies from businesses that replaced their SaaS chaos with unified platforms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="portfolio-card group cursor-pointer"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsSection() {
  const industries = [
    { name: "Real Estate", icon: Building2 },
    { name: "Supply Chain", icon: Layers },
    { name: "Finance", icon: DollarSign },
    { name: "Agencies", icon: Briefcase },
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
          <p className="text-muted-foreground text-lg">Industries we serve</p>
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

function Footer() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <footer id="contact" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to simplify?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let's discuss how a custom platform can transform your operations.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-card border-border"
                  data-testid="input-name"
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-card border-border"
                  data-testid="input-email"
                />
              </div>
              <Textarea
                placeholder="Tell me about your current tech stack..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-card border-border min-h-[140px]"
                data-testid="input-message"
              />
              <Button type="submit" size="lg" className="font-bold shimmer-btn" data-testid="button-submit">
                Send Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-primary">System</span>
                  <span className="text-foreground">Forge</span>
                </span>
              </div>
              <p className="text-muted-foreground max-w-sm text-lg">
                Building custom software platforms that replace chaos with clarity.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} SystemForge. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  
  const openScheduling = () => setSchedulingOpen(true);

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div className="min-h-screen bg-background noise-bg">
        <Helmet>
          <title>SystemForge - Custom Software Platforms | Replace SaaS Chaos with Clarity</title>
          <meta name="description" content="Stop paying for 10+ SaaS apps. SystemForge builds custom, unified software platforms for $1,000/mo. CRM, ERP, automations - all in one system built exactly for your workflow." />
          <meta property="og:title" content="SystemForge - Custom Software Platforms" />
          <meta property="og:description" content="Replace your messy tech stack with a single, custom-coded digital backbone. One flat fee, unlimited evolution." />
          <meta property="og:type" content="website" />
        </Helmet>
        <ScrollProgress />
        <Navbar />
        <HeroSection />
        <SpaghettiChaosSection />
        <BentoGridSection />
        <AIPartnerSection />
        <ComparisonToggleSection />
        <ProofSection />
        <ClientsSection />
        <Footer />
        <SchedulingModal open={schedulingOpen} onOpenChange={setSchedulingOpen} />
      </div>
    </SchedulingContext.Provider>
  );
}
