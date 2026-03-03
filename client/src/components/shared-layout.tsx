import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/context/language-context";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Briefcase,
  Menu,
  X
} from "lucide-react";

import alloyLogo from "@assets/Alloy_Logo_1770503010900.png";

import { SchedulingContext } from "@/context/scheduling-context";
export { SchedulingContext };

export function SharedNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openScheduling } = useContext(SchedulingContext);
  const [location] = useLocation();
  const { t } = useLanguage();

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileMenuOpen ? "glass shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
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
            <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-solutions">
              {t("nav.solutions")}
            </a>
          ) : (
            <Link href="/#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-solutions">
              {t("nav.solutions")}
            </Link>
          )}

          {isLandingPage ? (
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-pricing">
              {t("nav.pricing")}
            </a>
          ) : (
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-pricing">
              {t("nav.pricing")}
            </Link>
          )}

          {isLandingPage ? (
            <a href="#cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-cases">
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
            <a href="#clients" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-clients">
              {t("nav.clients")}
            </a>
          ) : (
            <Link href="/#clients" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-clients">
              {t("nav.clients")}
            </Link>
          )}
          {isLandingPage ? (
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-contact">
              {t("nav.contact")}
            </a>
          ) : (
            <Link href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-contact">
              {t("nav.contact")}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
              {isLandingPage ? (
                <a
                  href="#solution"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-solutions"
                >
                  {t("nav.solutions")}
                </a>
              ) : (
                <Link
                  href="/#solution"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-solutions"
                >
                  {t("nav.solutions")}
                </Link>
              )}

              {isLandingPage ? (
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-pricing"
                >
                  {t("nav.pricing")}
                </a>
              ) : (
                <Link
                  href="/#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-pricing"
                >
                  {t("nav.pricing")}
                </Link>
              )}

              {isLandingPage ? (
                <a
                  href="#cases"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-cases"
                >
                  {t("nav.portfolio")}
                </a>
              ) : (
                <Link
                  href="/#cases"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-cases"
                >
                  {t("nav.portfolio")}
                </Link>
              )}

              <Link
                href="/build"
                className={`text-sm py-2 transition-colors duration-200 ${location === '/build' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-link-build"
              >
                {t("nav.buildYourSolution")}
              </Link>

              {isLandingPage ? (
                <a
                  href="#clients"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-clients"
                >
                  {t("nav.clients")}
                </a>
              ) : (
                <Link
                  href="/#clients"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-clients"
                >
                  {t("nav.clients")}
                </Link>
              )}

              {isLandingPage ? (
                <a
                  href="#contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-contact"
                >
                  {t("nav.contact")}
                </a>
              ) : (
                <Link
                  href="/#contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-contact"
                >
                  {t("nav.contact")}
                </Link>
              )}

              <Button
                size="sm"
                className="font-semibold shimmer-btn glow-border w-full mt-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openScheduling();
                }}
                data-testid="mobile-button-cta"
              >
                {t("nav.scheduleCall")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function SharedFooter() {
  const { openScheduling } = useContext(SchedulingContext);
  const { t } = useLanguage();

  return (
    <footer id="contact" className="relative py-24 bg-background dark:bg-[hsl(225,25%,8%)]">
      <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background dark:to-[hsl(225,25%,8%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
              {t("footer.readyToSimplify")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("footer.subtitle")}
            </p>
            <Button
              size="lg"
              className="text-lg font-bold shimmer-btn glow-border"
              onClick={() => openScheduling()}
              data-testid="button-footer-schedule"
            >
              {t("footer.scheduleCall")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="mt-4">
              <Link href="/build">
                <Button variant="outline" size="lg" className="text-lg font-bold w-full sm:w-auto" data-testid="button-footer-build">
                  {t("footer.buildSolution")}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              {t("nav.solutions")}
            </h3>
            <nav className="flex flex-col gap-3">
              <a href="#solution" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                {t("footer.nav.solutions")}
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                {t("footer.nav.pricing")}
              </a>
              <a href="#cases" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                {t("footer.nav.portfolio")}
              </a>
              <Link href="/build" className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 text-sm">
                {t("footer.nav.build")}
              </Link>
            </nav>
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
                <img
                  src={alloyLogo}
                  alt="ALLOY"
                  className="h-10 w-auto dark:brightness-110 brightness-90 dark:drop-shadow-[0_0_4px_rgba(200,160,120,0.3)]"
                />
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-primary">ALL</span>
                  <span className="text-foreground">OY</span>
                </span>
              </div>
              <p className="text-muted-foreground max-w-sm text-lg">
                {t("footer.tagline")}
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} ALLOY. {t("footer.rights")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
