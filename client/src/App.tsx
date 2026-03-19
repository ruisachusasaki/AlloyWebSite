import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/language-context";
import { ScrollProvider } from "@/context/scroll-context";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/preloader";
import { CustomCursor } from "@/components/custom-cursor";

import LandingPage from "@/pages/landing";
import HomePage from "@/pages/home";
import BuildSolutionPage from "@/pages/build-solution";
import NotFound from "@/pages/not-found";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect handled by LandingPage being the default for logged out
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <Component {...rest} />;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timeout = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

/* Page transition variants */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
};

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Switch location={location}>
          <Route path="/" component={() => <PrivateRoute component={HomePage} />} />
          <Route path="/chat/:id" component={() => <PrivateRoute component={HomePage} />} />
          <Route path="/build" component={BuildSolutionPage} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <AnimatedRoutes />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ScrollProvider>
          <TooltipProvider>
            <Toaster />
            <Preloader />
            <CustomCursor />
            <Router />
          </TooltipProvider>
        </ScrollProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
