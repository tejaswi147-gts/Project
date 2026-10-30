import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, TranslationDictionary, TRANSLATIONS, ALL_LANGUAGES, LanguageMeta } from './translations';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  languages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'agrimind_selected_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}

    // Update Google Translate cookie as well
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    if (hostname.includes('.')) {
      document.cookie = `googtrans=/en/${lang}; path=/; domain=.${hostname};`;
    }

    // Trigger Google Translate dropdown element if rendered in DOM
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo && combo.value !== lang) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }
  };

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        languages: ALL_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
