import React from 'react';
import { Menu, Sprout, Camera, CloudSun, BookOpen, Sliders, CalendarCheck } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  onOpenMenu: () => void;
  onOpenLibrary: () => void;
  activeTab: 'scanner' | 'weather' | 'harvest' | 'simulator';
  setActiveTab: (tab: 'scanner' | 'weather' | 'harvest' | 'simulator') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMenu,
  onOpenLibrary,
  activeTab,
  setActiveTab,
}) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Top-Left Menu Bar Button & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors border border-neutral-200 cursor-pointer shadow-2xs"
            aria-label="Open main menu"
          >
            <Menu className="w-4 h-4 text-emerald-800" />
            <span>{t.menu}</span>
          </button>

          {/* Brand Icon & Wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <button
              onClick={() => setActiveTab('scanner')}
              className="text-left cursor-pointer"
            >
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
                AgriMind <span className="text-emerald-700 font-semibold">AI</span>
              </span>
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scanner'
                ? 'text-emerald-800 font-bold underline underline-offset-8 decoration-2 decoration-emerald-700'
                : ''
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.scannerTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'weather'
                ? 'text-emerald-800 font-bold underline underline-offset-8 decoration-2 decoration-emerald-700'
                : ''
            }`}
          >
            <CloudSun className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.weatherTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('harvest')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'harvest'
                ? 'text-emerald-800 font-bold underline underline-offset-8 decoration-2 decoration-emerald-700'
                : ''
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.harvestTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulator'
                ? 'text-emerald-800 font-bold underline underline-offset-8 decoration-2 decoration-emerald-700'
                : ''
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.simulatorTab}</span>
          </button>
        </nav>

        {/* Zone 3: Google Translate Language Selector & Guide Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSelector />

          <button
            onClick={onOpenLibrary}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.pathologyGuide}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
