import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Clock, 
  Headphones,
  Check,
  Sparkles
} from "lucide-react";
import { SiAirtable, SiHubspot, SiZapier, SiSlack, SiGooglesheets } from "react-icons/si";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight">
          <span className="text-primary">System</span>
          <span className="text-white">Forge</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-sm text-muted-foreground hover:text-white transition-colors" data-testid="link-problem">
            The Problem
          </a>
          <a href="#solution" className="text-sm text-muted-foreground hover:text-white transition-colors" data-testid="link-solution">
            Solution
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors" data-testid="link-pricing">
            Pricing
          </a>
        </div>
        <Button size="sm" className="font-medium" data-testid="button-cta-nav">
          Book Audit
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
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
          className="space-y-8"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Custom Software, Zero Chaos
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight"
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
            <Button size="lg" className="text-lg px-8 py-6 font-semibold" data-testid="button-cta-hero">
              Book a 15-minute System Audit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <span className="text-muted-foreground text-sm">No commitment required</span>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function ChaosVsClaritySection() {
  const chaosApps = [
    { icon: SiAirtable, name: "Airtable", color: "#18BFFF" },
    { icon: SiHubspot, name: "HubSpot", color: "#FF7A59" },
    { icon: SiZapier, name: "Zapier", color: "#FF4A00" },
    { icon: SiSlack, name: "Slack", color: "#4A154B" },
    { icon: SiGooglesheets, name: "Sheets", color: "#0F9D58" },
  ];

  return (
    <section id="problem" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            From Chaos to{" "}
            <span className="text-primary">Clarity</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't hire someone to manage your tools. Hire a system that manages itself.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <h3 className="text-2xl font-bold text-destructive/80">The Chaos</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {chaosApps.map((app, i) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 border border-border/50"
                  >
                    <app.icon className="w-8 h-8" style={{ color: app.color }} />
                    <span className="text-xs text-muted-foreground">{app.name}</span>
                  </motion.div>
                ))}
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border">
                  <span className="text-2xl text-muted-foreground">+12</span>
                  <span className="text-xs text-muted-foreground">more</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="text-destructive">$2,400/mo</span>
                  <span>in scattered subscriptions</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-card border-2 border-primary/30 rounded-2xl p-8 glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <h3 className="text-2xl font-bold text-primary">The Clarity</h3>
              </div>
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <Zap className="w-16 h-16 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white mb-2">Your Custom Platform</p>
                <p className="text-muted-foreground text-sm">One system. Infinite possibilities.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-primary/20">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-primary font-semibold">$1,000/mo</span>
                  <span className="text-muted-foreground">everything included</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServiceSection() {
  const features = [
    {
      icon: Zap,
      title: "Custom CRM & ERP",
      description: "Built around your exact workflow, not generic templates."
    },
    {
      icon: Clock,
      title: "Automated Workflows",
      description: "Eliminate repetitive tasks. Your system works while you sleep."
    },
    {
      icon: Shield,
      title: "Integrated Payments",
      description: "Seamless billing, invoicing, and financial reporting."
    },
    {
      icon: Headphones,
      title: "24/7 Developer Support",
      description: "Direct access to your developer. No ticket queues."
    },
  ];

  return (
    <section id="solution" className="py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            One Flat Fee.{" "}
            <span className="text-primary">Unlimited</span> Evolution.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We don't just build it; we evolve it. As your business changes, 
            the software changes with you—included in your subscription.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="pricing"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 p-8 md:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                Simple Pricing
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-primary">$1,000</span>
                <span className="text-muted-foreground text-xl">/month</span>
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Unlimited modifications & updates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Zero technical debt
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Cancel anytime
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-4">
              <Button size="lg" className="text-lg px-8 py-6 font-semibold" data-testid="button-cta-pricing">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <span className="text-muted-foreground text-sm">30-day money-back guarantee</span>
            </div>
          </div>
        </motion.div>
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
    <footer className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
                className="bg-card border-border min-h-[120px]"
                data-testid="input-message"
              />
              <Button type="submit" className="w-full sm:w-auto" data-testid="button-submit">
                Send Message
                <ArrowRight className="w-4 h-4 ml-2" />
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
              <a href="#" className="text-2xl font-bold tracking-tight">
                <span className="text-primary">System</span>
                <span className="text-white">Forge</span>
              </a>
              <p className="text-muted-foreground mt-4 max-w-sm">
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ChaosVsClaritySection />
      <ServiceSection />
      <Footer />
    </div>
  );
}
