import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/context/notification-context";

function AnimatedCheckmark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M8 12l3 3 5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}

const AUTO_DISMISS_MS = 4000;

export function PremiumNotification() {
  const { notification, dismiss } = useNotification();

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notification, dismiss]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-[100] bg-primary/10 backdrop-blur-md border-b border-primary/20"
        >
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
            <span className="text-primary">
              <AnimatedCheckmark />
            </span>
            <span className="text-sm font-medium text-foreground">
              {notification.message}
            </span>
          </div>
          {/* Progress bar */}
          <motion.div
            className="h-[2px] bg-primary/40 origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
