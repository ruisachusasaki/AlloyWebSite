import { createContext, useContext, useState, useCallback } from "react";

interface Notification {
  id: number;
  message: string;
  type: "success" | "info";
}

interface NotificationContextValue {
  notification: Notification | null;
  show: (message: string, type?: "success" | "info") => void;
  dismiss: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notification: null,
  show: () => {},
  dismiss: () => {},
});

export function useNotification() {
  return useContext(NotificationContext);
}

let idCounter = 0;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const dismiss = useCallback(() => setNotification(null), []);

  const show = useCallback((message: string, type: "success" | "info" = "success") => {
    const id = ++idCounter;
    setNotification({ id, message, type });
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, show, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}
