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

    // Hash navigation — poll until the target element exists in the DOM.
    // AnimatePresence mode="wait" unmounts the old page (400ms exit)
    // before mounting the new one, so elements don't exist yet.
    // Use duration: 0 (instant) because the page is still fading in
    // from opacity 0 — smooth scrolling during the enter animation
    // would fight the translateY transform and land at wrong positions.
    let cancelled = false;
    let attempts = 0;

    const poll = () => {
      if (cancelled) return;
      attempts++;
      const el = document.querySelector(hash);
      if (el) {
        // Element found — wait two frames for layout to settle, then jump
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) scrollTo(hash, { offset: -80, duration: 0 });
          });
        });
      } else if (attempts < 40) {
        // Not in DOM yet, retry (max ~2 seconds)
        setTimeout(poll, 50);
      }
    };

    // Start polling after exit animation is mostly done
    const start = setTimeout(poll, 350);

    return () => {
      cancelled = true;
      clearTimeout(start);
    };
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
