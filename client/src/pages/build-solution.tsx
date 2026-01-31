import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { SchedulingModal } from "@/components/scheduling-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "wouter";
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
  X,
  ArrowRight,
  Layers,
  Sparkles,
  Bell,
  Globe,
  Smartphone,
  FileSpreadsheet,
  Clock,
  Target,
  Zap
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
];

function ModuleCard({ 
  module, 
  isSelected, 
  onToggle 
}: { 
  module: Module; 
  isSelected: boolean; 
  onToggle: () => void;
}) {
  const Icon = module.icon;
  
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-300 group
        ${isSelected 
          ? "border-primary bg-primary/5 dark:bg-primary/10" 
          : "border-border/50 hover:border-primary/50 bg-card hover:bg-card/80"
        }`}
      data-testid={`module-card-${module.id}`}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors
        ${isSelected 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        }`}>
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{module.description}</p>
      
      <span className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
        {module.category}
      </span>
    </motion.button>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">SystemForge</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </nav>
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

  return (
    <>
      <Helmet>
        <title>Build Your Solution | SystemForge</title>
        <meta name="description" content="Select the features you need for your custom internal tool. Interactive module builder with 25+ integrations." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-background pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Interactive Solution Builder
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Build Your <span className="text-gradient">Custom Stack</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the modules you need for your business. We'll build a unified platform 
              that replaces your fragmented tools with one cohesive system.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {modules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    <ModuleCard
                      module={module}
                      isSelected={selectedModules.has(module.id)}
                      onToggle={() => toggleModule(module.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-foreground">Your Custom Stack</h2>
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
                  
                  <div className="min-h-[200px] max-h-[300px] overflow-y-auto mb-6">
                    <AnimatePresence mode="popLayout">
                      {selectedModules.size === 0 ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-muted-foreground text-center py-8"
                        >
                          Click modules to add them to your stack
                        </motion.p>
                      ) : (
                        <ul className="space-y-2">
                          {getSelectedModuleNames().map((name) => (
                            <motion.li
                              key={name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="flex items-center gap-2 text-sm text-foreground"
                            >
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              {name}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="border-t border-border pt-4 mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Selected Modules</p>
                    <p className="text-2xl font-bold text-foreground">{selectedModules.size}</p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      data-testid="input-name"
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      data-testid="input-email"
                    />
                    <Input
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      data-testid="input-company"
                    />
                    <Textarea
                      placeholder="Brief project description..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[80px] resize-none"
                      data-testid="input-description"
                    />
                    <Textarea
                      placeholder="Custom requests not listed above..."
                      value={formData.customRequest}
                      onChange={(e) => setFormData(prev => ({ ...prev, customRequest: e.target.value }))}
                      className="min-h-[60px] resize-none"
                      data-testid="input-custom-request"
                    />
                  </div>

                  <Button
                    onClick={handleRequestQuote}
                    disabled={!formData.name || !formData.email}
                    className="w-full mt-4 gap-2"
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

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-40">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Selected Modules</p>
                <p className="text-lg font-bold text-foreground">{selectedModules.size} selected</p>
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
              className="w-full gap-2"
              size="lg"
              data-testid="button-request-quote-mobile"
            >
              Continue to Quote Request
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <SchedulingModal
        open={showScheduling}
        onOpenChange={setShowScheduling}
        prefillData={{
          name: formData.name,
          email: formData.email,
          businessDescription: buildDescription()
        }}
      />
    </>
  );
}
