import { createContext } from "react";

interface SchedulingContextType {
    openScheduling: (plan?: string) => void;
}

export const SchedulingContext = createContext<SchedulingContextType>({
    openScheduling: () => { }
});
