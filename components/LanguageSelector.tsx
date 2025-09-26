import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';
import { useI18n } from "../context/I18nProvider";

const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useI18n();
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full hover:bg-green-50"
        >
          <Globe className="h-5 w-5 text-brand-darkblue" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((langOption) => (
          <DropdownMenuItem 
            key={langOption.code}
            onClick={() => setLang(langOption.code as any)}
          >
            <span className={lang === langOption.code ? 'font-semibold' : ''}>{langOption.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
