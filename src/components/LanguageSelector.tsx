import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';

interface LanguageSelectorProps {
  isMobileDrawer?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobileDrawer = false }) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const activeLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <div className="relative inline-block text-left">
      {/* Styled Language Selector Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
          isMobileDrawer
            ? 'w-full justify-between bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-800 py-2.5'
            : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-800 shadow-2xs'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="font-bold text-neutral-900">{activeLangObj.native}</span>
          <span className="text-[11px] text-neutral-400 font-normal">({activeLangObj.name})</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 sm:right-auto sm:left-0 mt-1.5 w-64 max-h-96 overflow-y-auto rounded-xl bg-white border border-neutral-200 shadow-xl z-50 p-2 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100 mb-1 flex items-center justify-between">
              <span>South Indian &amp; Global</span>
              <span className="text-[10px] font-semibold text-emerald-800">Google Translate</span>
            </div>

            <div className="text-[10px] font-bold text-emerald-800 px-3 pt-1">
              South Indian Farming Languages
            </div>

            {languages
              .filter((l) => l.isSouthIndian)
              .map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-neutral-900 text-sm">{lang.native}</span>
                      <span className="text-[11px] text-emerald-800">{lang.name} · {lang.region}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                  </button>
                );
              })}

            <div className="border-t border-neutral-100 my-1 pt-1 text-[10px] font-bold text-neutral-400 px-3">
              Other Languages
            </div>

            {languages
              .filter((l) => !l.isSouthIndian)
              .map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{lang.native} ({lang.name})</span>
                      <span className="text-[10px] text-neutral-400">{lang.region}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                  </button>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};
