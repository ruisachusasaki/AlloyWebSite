import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

interface SchedulingContextType {
  openScheduling: () => void;
}

export const SchedulingContext = createContext<SchedulingContextType>({ 
  openScheduling: () => {} 
});

export function SharedNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openScheduling } = useContext(SchedulingContext);
  const [location] = useLocation();

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

  const isLandingPage = location === "/";

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
            <a href="#solution" className="text-sm text-muted-foreground transition-colors" data-testid="link-solutions">
              Solutions
            </a>
          ) : (
            <Link href="/#solution" className="text-sm text-muted-foreground transition-colors" data-testid="link-solutions">
              Solutions
            </Link>
          )}
          
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
                      href={isLandingPage ? "#proof" : "/#proof"}
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
          
          <Link 
            href="/build" 
            className={`text-sm transition-colors ${location === '/build' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            data-testid="link-build"
          >
            Build Your Solution
          </Link>
          {isLandingPage ? (
            <a href="#clients" className="text-sm text-muted-foreground transition-colors" data-testid="link-clients">
              Clients
            </a>
          ) : (
            <Link href="/#clients" className="text-sm text-muted-foreground transition-colors" data-testid="link-clients">
              Clients
            </Link>
          )}
          {isLandingPage ? (
            <a href="#contact" className="text-sm text-muted-foreground transition-colors" data-testid="link-contact">
              Contact
            </a>
          ) : (
            <Link href="/#contact" className="text-sm text-muted-foreground transition-colors" data-testid="link-contact">
              Contact
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            size="sm" 
            className="font-semibold shimmer-btn glow-border hidden sm:flex"
            onClick={openScheduling}
            data-testid="button-cta-nav"
          >
            Schedule a Call
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
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-solutions"
                >
                  Solutions
                </a>
              ) : (
                <Link 
                  href="/#solution" 
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-solutions"
                >
                  Solutions
                </Link>
              )}
              
              <div className="border-t border-border pt-2">
                <p className="text-xs text-muted-foreground mb-2">Portfolio</p>
                {portfolioItems.map((item) => (
                  <a
                    key={item.name}
                    href={isLandingPage ? "#proof" : "/#proof"}
                    className="flex items-center gap-3 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-link-portfolio-${item.name.toLowerCase()}`}
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
              </div>
              
              <Link 
                href="/build" 
                className={`text-sm py-2 ${location === '/build' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-link-build"
              >
                Build Your Solution
              </Link>
              
              {isLandingPage ? (
                <a 
                  href="#clients" 
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-clients"
                >
                  Clients
                </a>
              ) : (
                <Link 
                  href="/#clients" 
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-clients"
                >
                  Clients
                </Link>
              )}
              
              {isLandingPage ? (
                <a 
                  href="#contact" 
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-contact"
                >
                  Contact
                </a>
              ) : (
                <Link 
                  href="/#contact" 
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-contact"
                >
                  Contact
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
                Schedule a Call
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export function SharedFooter() {
  const { openScheduling } = useContext(SchedulingContext);

  return (
    <footer id="contact" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
              Ready to simplify?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let's discuss how a custom platform can transform your operations.
            </p>
            <Button 
              size="lg" 
              className="text-lg font-bold shimmer-btn glow-border"
              onClick={openScheduling}
              data-testid="button-footer-schedule"
            >
              Schedule a 30-minute Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
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
                Building custom software platforms that replace chaos with clarity.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} ALLOY. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
