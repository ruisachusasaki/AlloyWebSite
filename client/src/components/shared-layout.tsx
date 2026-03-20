import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/context/language-context";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Briefcase,
  Mail,
  MapPin,
  Menu,
  X
} from "lucide-react";

import alloyLogo from "@assets/Alloy_Logo_1770503010900.png";

import { SchedulingContext } from "@/context/scheduling-context";
import { useScrollContext } from "@/context/scroll-context";
export { SchedulingContext };

export function SharedNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openScheduling } = useContext(SchedulingContext);
  const [location] = useLocation();
  const { t } = useLanguage();
  const { scrollTo } = useScrollContext();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portfolioItems = [
    { name: t("nav.portfolio.wealthfit"), desc: t("nav.portfolio.wealthfit.desc"), icon: DollarSign },
    { name: t("nav.portfolio.eventgrowth"), desc: t("nav.portfolio.eventgrowth.desc"), icon: TrendingUp },
    { name: t("nav.portfolio.agencyboost"), desc: t("nav.portfolio.agencyboost.desc"), icon: Briefcase },
  ];

  const isLandingPage = location === "/";

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileMenuOpen ? "glass shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo" onClick={() => scrollTo(0)}>
          <img
            src={alloyLogo}
            alt="ALLOY"
            className="h-8 w-auto dark:brightness-110 brightness-90 dark:drop-shadow-[0_0_4px_rgba(200,160,120,0.3)]"
          />
          <span className="text-lg font-bold tracking-tight hidden sm:block">
            <span className="text-primary">ALL</span>
            <span className="text-foreground">OY</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {isLandingPage ? (
            <a href="#solution" onClick={(e) => { e.preventDefault(); scrollTo("#solution", { offset: -80 }); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-solutions">
              {t("nav.solutions")}
            </a>
          ) : (
            <Link href="/#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-solutions">
              {t("nav.solutions")}
            </Link>
          )}

          {isLandingPage ? (
            <a href="#cases" onClick={(e) => { e.preventDefault(); scrollTo("#cases", { offset: -80 }); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-cases">
              {t("nav.portfolio")}
            </a>
          ) : (
            <Link href="/#cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-cases">
              {t("nav.portfolio")}
            </Link>
          )}

          <Link
            href="/build"
            className={`text-sm transition-colors duration-200 ${location === '/build' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            data-testid="link-build"
          >
            {t("nav.buildYourSolution")}
          </Link>
          {isLandingPage ? (
            <a href="#clients" onClick={(e) => { e.preventDefault(); scrollTo("#clients", { offset: -80 }); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-clients">
              {t("nav.clients")}
            </a>
          ) : (
            <Link href="/#clients" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-clients">
              {t("nav.clients")}
            </Link>
          )}
          {isLandingPage ? (
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo("#pricing", { offset: -80 }); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-pricing">
              {t("nav.pricing")}
            </a>
          ) : (
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-pricing">
              {t("nav.pricing")}
            </Link>
          )}
          {isLandingPage ? (
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("#contact", { offset: -80 }); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-contact">
              {t("nav.contact")}
            </a>
          ) : (
            <Link href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-contact">
              {t("nav.contact")}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Button
            size="sm"
            className="font-semibold shimmer-btn glow-border hidden md:flex"
            onClick={() => openScheduling()}
            data-testid="button-cta-nav"
          >
            {t("nav.scheduleCall")}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

    </nav>

    {/* Full-screen mobile overlay — outside nav to avoid stacking context */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
          animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] md:hidden flex flex-col"
          style={{ backgroundColor: "hsl(var(--background))" }}
        >
          {/* Top bar with logo + close */}
          <div className="flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2" onClick={() => { setMobileMenuOpen(false); scrollTo(0); }}>
              <img src={alloyLogo} alt="ALLOY" className="h-8 w-auto dark:brightness-110 brightness-90 dark:drop-shadow-[0_0_4px_rgba(200,160,120,0.3)]" />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-primary">ALL</span>
                <span className="text-foreground">OY</span>
              </span>
            </Link>
            <Button size="icon" variant="ghost" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-close">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Nav links — staggered */}
          <nav className="flex-1 flex flex-col justify-center px-10 gap-6">
            {[
              { href: isLandingPage ? "#solution" : "/#solution", label: t("nav.solutions"), isAnchor: isLandingPage, isActive: false },
              { href: isLandingPage ? "#cases" : "/#cases", label: t("nav.portfolio"), isAnchor: isLandingPage, isActive: false },
              { href: "/build", label: t("nav.buildYourSolution"), isAnchor: false, isActive: location === "/build" },
              { href: isLandingPage ? "#clients" : "/#clients", label: t("nav.clients"), isAnchor: isLandingPage, isActive: false },
              { href: isLandingPage ? "#pricing" : "/#pricing", label: t("nav.pricing"), isAnchor: isLandingPage, isActive: false },
              { href: isLandingPage ? "#contact" : "/#contact", label: t("nav.contact"), isAnchor: isLandingPage, isActive: false },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                {item.isAnchor ? (
                  <a
                    href={item.href}
                    className={`text-2xl font-display font-semibold transition-colors duration-200 ${item.isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
                    onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); scrollTo(item.href, { offset: -80 }); }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-2xl font-display font-semibold transition-colors duration-200 ${item.isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Bottom: CTA + Language/Theme toggle */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="px-10 pb-10 flex flex-col gap-5"
          >
            <Button
              size="lg"
              className="font-semibold shimmer-btn glow-border w-full text-lg"
              onClick={() => { setMobileMenuOpen(false); openScheduling(); }}
              data-testid="mobile-button-cta"
            >
              {t("nav.scheduleCall")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>

            <div className="flex items-center justify-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

export function SharedFooter() {
  const { openScheduling } = useContext(SchedulingContext);
  const { t, language, setLanguage } = useLanguage();
  const { scrollTo } = useScrollContext();
  const [location] = useLocation();
  const isLandingPage = location === "/";

  /* ── Strikethrough animation on "chaos" ── */
  const strikeRef = useRef<HTMLSpanElement>(null);
  const strikeInView = useInView(strikeRef, { once: true, margin: "-100px" });

  return (
    <footer id="contact">
      {/* ═══════════════════════════════════════════
          1. PRE-FOOTER CTA
      ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 bg-secondary dark:bg-[hsl(225,25%,6%)] overflow-hidden">
        {/* Snow particles */}
        <div className="footer-particles">
          <span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground heading-glow mb-10"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            {t("footer.cta.ready")}{" "}
            <span ref={strikeRef} className="relative inline-block text-muted-foreground">
              {t("footer.cta.chaos")}
              <motion.span
                className="absolute left-0 top-1/2 h-[3px] bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={strikeInView ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>{" "}
            {t("footer.cta.with")}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="text-lg md:text-xl font-bold shimmer-btn glow-border px-10 py-6"
              onClick={() => openScheduling()}
              data-testid="button-footer-cta"
            >
              {t("footer.cta.button")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. MAIN FOOTER
      ═══════════════════════════════════════════ */}
      <section className="relative py-20 md:py-24 bg-background dark:bg-[hsl(225,25%,8%)] overflow-hidden">
        {/* Giant "ALLOY" wordmark backdrop */}
        <div
          className="wordmark-container absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          {"ALLOY".split("").map((letter, i) => (
            <span
              key={i}
              className="wordmark-letter font-display font-black text-foreground pointer-events-auto"
              style={{
                fontSize: "clamp(8rem, 25vw, 20rem)",
                opacity: 0.04,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Footer content grid */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {/* Column 1: Logo + description + social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={() => scrollTo(0)}
                className="flex items-center gap-2 mb-5 cursor-pointer"
              >
                <img
                  src={alloyLogo}
                  alt="ALLOY"
                  className="h-10 w-auto dark:brightness-110 brightness-90 dark:drop-shadow-[0_0_4px_rgba(200,160,120,0.3)]"
                />
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-primary">ALL</span>
                  <span className="text-foreground">OY</span>
                </span>
              </button>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {t("footer.description")}
              </p>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3
                className="text-sm font-bold uppercase tracking-wider text-foreground mb-6 font-mono"
                style={{ letterSpacing: "0.15em" }}
              >
                {t("footer.col.links")}
              </h3>
              <nav className="flex flex-col gap-3">
                {isLandingPage ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); scrollTo(0); }} className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                    {t("footer.nav.home")}
                  </a>
                ) : (
                  <Link href="/" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                    {t("footer.nav.home")}
                  </Link>
                )}
                {isLandingPage ? (
                  <a href="#cases" onClick={(e) => { e.preventDefault(); scrollTo("#cases", { offset: -80 }); }} className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                    {t("footer.nav.portfolio")}
                  </a>
                ) : (
                  <Link href="/#cases" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                    {t("footer.nav.portfolio")}
                  </Link>
                )}
                {isLandingPage ? (
                  <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo("#pricing", { offset: -80 }); }} className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                    {t("footer.nav.pricing")}
                  </a>
                ) : (
                  <Link href="/#pricing" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                    {t("footer.nav.pricing")}
                  </Link>
                )}
                <Link href="/build" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                  {t("footer.nav.build")}
                </Link>
              </nav>
            </motion.div>

            {/* Column 3: Contact + Book a Call */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3
                className="text-sm font-bold uppercase tracking-wider text-foreground mb-6 font-mono"
                style={{ letterSpacing: "0.15em" }}
              >
                {t("footer.col.connect")}
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:rui@alloyready.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  rui@alloyready.com
                </a>
                <a
                  href="mailto:felipe@alloyready.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  felipe@alloyready.com
                </a>
                <button
                  onClick={() => openScheduling()}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium cursor-pointer text-left"
                  data-testid="button-footer-book-call"
                >
                  <ArrowRight className="w-4 h-4" />
                  {t("footer.bookCall")}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. BOTTOM BAR
      ═══════════════════════════════════════════ */}
      <div className="bg-background dark:bg-[hsl(225,25%,8%)] border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Copyright */}
            <p className="text-muted-foreground text-xs font-mono order-2 sm:order-1">
              &copy; {new Date().getFullYear()} ALLOY
            </p>

            {/* Center: Language toggle */}
            <div className="flex items-center gap-3 order-1 sm:order-2">
              <button
                onClick={() => setLanguage("en")}
                className={`text-xs font-mono transition-colors duration-200 cursor-pointer ${language === "en" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
              <span className="text-muted-foreground/40 text-xs">|</span>
              <button
                onClick={() => setLanguage("es")}
                className={`text-xs font-mono transition-colors duration-200 cursor-pointer ${language === "es" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                ES
              </button>
            </div>

            {/* Right: Location + back to top */}
            <div className="flex items-center gap-4 order-3">
              <span className="text-muted-foreground text-xs font-mono flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {t("footer.location")}
                <span className="text-muted-foreground/50 ml-1">34.6°S 58.4°W</span>
              </span>
              <button
                onClick={() => scrollTo(0)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 text-xs font-mono cursor-pointer"
                data-testid="button-back-to-top"
              >
                {t("footer.backToTop")}
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
