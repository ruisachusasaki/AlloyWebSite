import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";

type Language = "en" | "es";

interface LanguageContextValue {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
    language: "en",
    setLanguage: () => { },
    t: (key: string) => key,
});

const SPANISH_COUNTRIES = [
    "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GQ",
    "GT", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "ES", "UY", "VE",
];

const STORAGE_KEY = "alloy-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        // 1. Check sessionStorage for a manual override
        const saved = sessionStorage.getItem(STORAGE_KEY) as Language | null;
        if (saved === "en" || saved === "es") {
            setLanguageState(saved);
            return;
        }

        // 2. Geo-detect via ipapi.co
        fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.country_code) {
                    const detectedLang: Language = SPANISH_COUNTRIES.includes(data.country_code) ? "es" : "en";
                    setLanguageState(detectedLang);
                }
            })
            .catch(() => {
                // Default to English on error
            });
    }, []);

    const setLanguage = (lang: Language) => {
        sessionStorage.setItem(STORAGE_KEY, lang);
        setLanguageState(lang);
    };

    const translations = language === "es" ? es : en;

    const t = (key: string): string => {
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
