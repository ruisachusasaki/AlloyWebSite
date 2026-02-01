import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { SchedulingModal } from "@/components/scheduling-modal";
import { SharedNavbar, SharedFooter, SchedulingContext } from "@/components/shared-layout";
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
  Layers
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

const modules: Module[] = [
  { id: "whatsapp", title: "WhatsApp Integration", description: "Automate customer messaging and notifications", icon: MessageSquare, category: "Communication" },
  { id: "google-calendar", title: "Google Calendar", description: "Sync scheduling and appointments seamlessly", icon: Calendar, category: "Productivity" },
  { id: "login-management", title: "Login Management", description: "Secure authentication and user access control", icon: Users, category: "Security" },
  { id: "crm", title: "CRM", description: "Track leads, deals, and customer relationships", icon: UserCircle, category: "Sales" },
  { id: "campaign-reports", title: "Campaign Reports", description: "Analytics dashboards for marketing performance", icon: BarChart3, category: "Analytics" },
  { id: "task-management", title: "Task Management", description: "Assign, track, and complete team tasks", icon: ClipboardList, category: "Productivity" },
  { id: "ai-agent", title: "AI Business Agent", description: "Intelligent automation for repetitive workflows", icon: Bot, category: "AI" },
  { id: "geolocalization", title: "Geolocalization", description: "Location-based services and mapping features", icon: MapPin, category: "Features" },
  { id: "qr-codes", title: "QR Generation/Scanning", description: "Create and read QR codes for various uses", icon: QrCode, category: "Features" },
  { id: "airtable", title: "Airtable/Database Connection", description: "Connect to external databases and spreadsheets", icon: Database, category: "Data" },
  { id: "real-estate", title: "Argenprop/ZonaProp Integration", description: "Real estate portal synchronization", icon: Building2, category: "Industry" },
  { id: "client-portals", title: "Custom Client Portals", description: "Branded self-service portals for clients", icon: Globe, category: "Features" },
  { id: "inventory", title: "Inventory & Stock Tracking", description: "Monitor stock levels and movements", icon: Package, category: "Operations" },
  { id: "document-generation", title: "Automated Document Generation", description: "Create contracts, invoices, and reports", icon: FileText, category: "Automation" },
  { id: "email-marketing", title: "Email Marketing Automation", description: "Drip campaigns and newsletter management", icon: Mail, category: "Marketing" },
  { id: "internal-chat", title: "Internal Chat/Commenting", description: "Team collaboration and in-app messaging", icon: MessageCircle, category: "Communication" },
  { id: "multi-role", title: "Multi-Role Permissions", description: "Granular access control by user role", icon: Shield, category: "Security" },
  { id: "data-migration", title: "Legacy Data Migration", description: "Import data from existing systems", icon: ArrowLeftRight, category: "Data" },
  { id: "dashboards", title: "Custom Dashboards", description: "Personalized KPI and metrics views", icon: LayoutDashboard, category: "Analytics" },
  { id: "webhooks", title: "Webhooks & API Development", description: "Connect with any third-party service", icon: Webhook, category: "Integration" },
  { id: "payments", title: "Stripe/Payment Management", description: "Process payments and subscriptions", icon: CreditCard, category: "Payments" },
  { id: "notifications", title: "Push Notifications", description: "Real-time alerts across devices", icon: Bell, category: "Communication" },
  { id: "mobile-app", title: "Mobile App Development", description: "Native iOS and Android applications", icon: Smartphone, category: "Development" },
  { id: "excel-import", title: "Excel/CSV Import/Export", description: "Bulk data operations with spreadsheets", icon: FileSpreadsheet, category: "Data" },
  { id: "scheduling", title: "Appointment Scheduling", description: "Online booking with availability sync", icon: Clock, category: "Productivity" },
  { id: "lead-scoring", title: "Lead Scoring", description: "AI-powered lead qualification", icon: Target, category: "Sales" },
  { id: "workflow-automation", title: "Workflow Automation", description: "Custom triggers and automated actions", icon: Zap, category: "Automation" },
  { id: "website-migration", title: "Website Migration", description: "Seamlessly move from legacy sites to modern platforms", icon: RefreshCw, category: "Development" },
  { id: "ecommerce", title: "E-Commerce Platform", description: "Full online store with cart, checkout, and inventory", icon: ShoppingCart, category: "Sales" },
  { id: "course-platform", title: "Course & Learning Platform", description: "Create and sell online courses with progress tracking", icon: GraduationCap, category: "Education" },
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
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };
  
  return (
    <motion.button
      ref={cardRef}
      onClick={onToggle}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.02 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`module-glass-card relative w-full text-left p-6 rounded-2xl transition-all duration-500 group overflow-hidden
        ${isSelected 
          ? "border-primary/60 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 shadow-[0_0_40px_-10px] shadow-primary/30" 
          : "border-border/40 bg-gradient-to-br from-card/80 via-card/60 to-card/40 hover:border-primary/40 hover:shadow-[0_0_50px_-15px] hover:shadow-primary/20"
        }
        backdrop-blur-xl border`}
      style={{
        background: isSelected 
          ? 'linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.06), transparent)'
          : 'linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.7), hsl(var(--card) / 0.5))'
      }}
      data-testid={`module-card-${module.id}`}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.15), transparent 50%)'
        }}
      />

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05), transparent, hsl(var(--primary) / 0.03))'
        }}
      />

      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}
      
      <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 overflow-hidden
        ${isSelected 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
          : "bg-gradient-to-br from-muted/80 to-muted/40 text-muted-foreground group-hover:from-primary/20 group-hover:to-primary/10 group-hover:text-primary"
        }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <Icon className="w-7 h-7 relative z-10" />
      </div>
      
      <h3 className="font-bold text-foreground mb-2 text-lg tracking-tight">{module.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{module.description}</p>
      
      <span className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300
        ${isSelected 
          ? "bg-primary/20 text-primary border border-primary/30" 
          : "bg-muted/60 text-muted-foreground border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
        }`}>
        {module.category}
      </span>
    </motion.button>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * 600,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * 600],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-8 backdrop-blur-sm shadow-lg shadow-primary/10"
          >
            <Sparkles className="w-4 h-4" />
            Interactive Solution Builder
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 tracking-tight leading-[1.1]"
          >
            Architect Your{" "}
            <span className="relative inline-block">
              <span className="text-gradient bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Digital Empire
              </span>
              <motion.span 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Select the modules that power your vision. We craft a{" "}
            <span className="text-foreground font-semibold">unified platform</span>{" "}
            that eliminates tool chaos and amplifies your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>30+ Modules Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Unlimited Custom Features</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>One Unified Platform</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

function MoreFeaturesSection({ onScheduleClick }: { onScheduleClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-16 text-center"
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-xl border border-border/50 rounded-3xl p-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Need Something Else?
          </h3>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            These are just starting points. We build <span className="text-foreground font-semibold">any feature</span> your business needs. 
            If you can imagine it, we can create it.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["AI Integrations", "Custom APIs", "Third-Party Connectors", "Industry-Specific Tools", "Anything You Need"].map((tag) => (
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
            Discuss Custom Features
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
    let desc = formData.description || "Custom solution inquiry";
    
    if (selectedNames.length > 0) {
      desc += `\n\nSELECTED MODULES (${selectedNames.length}):\n- ${selectedNames.join("\n- ")}`;
    }
    
    if (formData.customRequest) {
      desc += `\n\nCUSTOM REQUEST:\n${formData.customRequest}`;
    }
    
    if (formData.companyName) {
      desc += `\n\nCOMPANY: ${formData.companyName}`;
    }
    
    return desc;
  };

  const openScheduling = () => setShowScheduling(true);

  return (
    <SchedulingContext.Provider value={{ openScheduling }}>
      <div className="min-h-screen bg-background noise-bg">
        <Helmet>
          <title>Build Your Solution | SystemForge</title>
          <meta name="description" content="Select the features you need for your custom internal tool. Interactive module builder with 30+ integrations." />
        </Helmet>
        
        <SharedNavbar />
        
        <main className="pb-32">
          <HeroSection />

          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                        <h2 className="font-bold text-foreground text-lg">Your Custom Stack</h2>
                        {selectedModules.size > 0 && (
                          <button
                            onClick={clearAll}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            data-testid="button-clear-all"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      <div className="min-h-[180px] max-h-[280px] overflow-y-auto mb-6 scrollbar-thin">
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
                                Click modules to add them to your stack
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
                        <p className="text-sm text-muted-foreground mb-1">Selected Modules</p>
                        <p className="text-3xl font-bold text-foreground">{selectedModules.size}</p>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-background/50 border-border/50"
                          data-testid="input-name"
                        />
                        <Input
                          placeholder="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-background/50 border-border/50"
                          data-testid="input-email"
                        />
                        <Input
                          placeholder="Company Name"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="bg-background/50 border-border/50"
                          data-testid="input-company"
                        />
                        <Textarea
                          placeholder="Brief project description..."
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="min-h-[80px] resize-none bg-background/50 border-border/50"
                          data-testid="input-description"
                        />
                        <Textarea
                          placeholder="Custom requests not listed above..."
                          value={formData.customRequest}
                          onChange={(e) => setFormData(prev => ({ ...prev, customRequest: e.target.value }))}
                          className="min-h-[60px] resize-none bg-background/50 border-border/50"
                          data-testid="input-custom-request"
                        />
                      </div>

                      <Button
                        onClick={handleRequestQuote}
                        disabled={!formData.name || !formData.email}
                        className="w-full mt-5 gap-2 font-semibold"
                        size="lg"
                        data-testid="button-request-quote"
                      >
                        Request Quote & Schedule Call
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
                  <p className="text-sm text-muted-foreground">Selected Modules</p>
                  <p className="text-xl font-bold text-foreground">{selectedModules.size} selected</p>
                </div>
                {selectedModules.size > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-muted-foreground hover:text-foreground"
                    data-testid="button-clear-all-mobile"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <Button
                onClick={handleRequestQuote}
                className="w-full gap-2 font-semibold"
                size="lg"
                data-testid="button-request-quote-mobile"
              >
                Continue to Quote Request
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
