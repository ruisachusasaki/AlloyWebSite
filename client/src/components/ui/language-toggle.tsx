import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggle = () => {
        setLanguage(language === "en" ? "es" : "en");
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 rounded-full px-3"
            onClick={toggle}
            aria-label={language === "en" ? "Cambiar a español" : "Switch to English"}
            data-testid="button-language-toggle"
        >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">
                {language === "en" ? "ES" : "EN"}
            </span>
        </Button>
    );
}
