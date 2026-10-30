import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SOUTH_INDIAN_LANGUAGES, SupportedLanguage } from '../i18n/translations';
import { Globe, Sparkles } from 'lucide-react';

export const SouthIndianLanguageBar: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  return (
    <div className="bg-emerald-950 text-emerald-100 border-b border-emerald-800/80 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white whitespace-nowrap">
            {t.southIndianBarTitle}
          </span>
          <span className="hidden md:inline text-emerald-300/80 text-[11px]">
            (తెలుగు · தமிழ் · ಕನ್ನಡ · മലയാളം)
          </span>
        </div>

        {/* 1-Click Fast Language Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SOUTH_INDIAN_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm ring-1 ring-white/40'
                    : 'bg-emerald-900/60 hover:bg-emerald-800 text-white border border-emerald-700/60'
                }`}
                title={`Switch to ${lang.name} (${lang.region})`}
              >
                <span>{lang.native}</span>
                <span className="text-[10px] font-normal opacity-80">({lang.name})</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-emerald-700/60 mx-1 hidden sm:block" />

          {/* English & Hindi toggles */}
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              currentLanguage === 'en'
                ? 'bg-white text-neutral-900 shadow-sm font-bold'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            English
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              currentLanguage === 'hi'
                ? 'bg-white text-neutral-900 shadow-sm font-bold'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>
    </div>
  );
};
