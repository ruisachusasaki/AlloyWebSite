import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/language-context";
import { NotificationProvider } from "@/context/notification-context";
import { ScrollProvider, useScrollContext } from "@/context/scroll-context";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumNotification } from "@/components/premium-notification";
import { Preloader } from "@/components/preloader";
import { CustomCursor } from "@/components/custom-cursor";

import LandingPage from "@/pages/landing";
import HomePage from "@/pages/home";
import BuildSolutionPage from "@/pages/build-solution";
import OurStoryPage from "@/pages/our-story";
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
  const { scrollTo } = useScrollContext();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      // No hash — scroll to top after exit animation (400ms) completes
      const timeout = setTimeout(() => scrollTo(0, { duration: 0 }), 450);
      return () => clearTimeout(timeout);
    }

    // Wait for full page transition (400ms exit + 400ms enter = 800ms)
    // so all CSS transforms are gone and Lenis dimensions are accurate.
    // Using duration: 0 for instant jump since the page just finished fading in.
    const timeout = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        scrollTo(hash, { offset: -80, duration: 0 });
      }
    }, 850);

    return () => clearTimeout(timeout);
  }, [location, scrollTo]);

  return null;
}

/* Page transition variants */
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.4,
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
          <Route path="/about" component={OurStoryPage} />
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
        <NotificationProvider>
          <ScrollProvider>
            <TooltipProvider>
              <Toaster />
              <PremiumNotification />
              <Preloader />
              <CustomCursor />
              <Router />
            </TooltipProvider>
          </ScrollProvider>
        </NotificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
