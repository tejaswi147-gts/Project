import React from 'react';
import { 
  X, 
  Camera, 
  CloudSun, 
  Sliders, 
  BookOpen, 
  MapPin, 
  ShieldCheck, 
  Sprout, 
  Printer, 
  ChevronRight,
  CalendarCheck
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { LocationPreset, getAllAgricultureStations } from '../services/weatherService';
import { useLanguage } from '../i18n/LanguageContext';

interface LeftSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'scanner' | 'weather' | 'harvest' | 'simulator';
  setActiveTab: (tab: 'scanner' | 'weather' | 'harvest' | 'simulator') => void;
  onOpenLibrary: () => void;
  selectedRegion: LocationPreset | null;
  onSelectRegion: (region: LocationPreset) => void;
  onOpenStationManager?: (tab?: 'select' | 'add') => void;
  recentCount: number;
}

export const LeftSidebarDrawer: React.FC<LeftSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenLibrary,
  selectedRegion,
  onSelectRegion,
  onOpenStationManager,
  recentCount,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleNavClick = (tab: 'scanner' | 'weather' | 'harvest' | 'simulator') => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel on top-left */}
      <div className="fixed inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-white shadow-2xl flex flex-col z-50 border-r border-neutral-200 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold text-neutral-900 leading-tight">
                AgriMind <span className="text-emerald-700">AI</span>
              </div>
              <div className="text-[11px] text-neutral-500">
                {t.appSubtitle}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Bar inside Menu */}
        <div className="p-4 border-b border-neutral-200 bg-emerald-50/40">
          <div className="text-xs font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
            <span>{t.southIndianBarTitle}</span>
            <span className="text-[10px] text-emerald-800 font-bold">Google Translate</span>
          </div>
          <LanguageSelector isMobileDrawer={true} />
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main App Features */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-2">
              {t.coreModules}
            </div>

            <button
              onClick={() => handleNavClick('scanner')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>{t.scannerTab}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('weather')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'weather'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <CloudSun className="w-4 h-4 text-emerald-400" />
                <span>{t.weatherTab}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('harvest')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'harvest'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.harvestTab}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('simulator')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>{t.simulatorTab}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                onOpenLibrary();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{t.pathologyGuide}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Quick Agricultural Stations */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
              <span>{t.fieldWeatherStations}</span>
              <button
                onClick={() => {
                  if (onOpenStationManager) onOpenStationManager('select');
                  onClose();
                }}
                className="text-emerald-800 hover:underline font-bold text-[10px] cursor-pointer"
              >
                Directory →
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {getAllAgricultureStations().slice(0, 7).map((region) => {
                const isSelected = selectedRegion?.name === region.name || selectedRegion?.id === region.id;
                return (
                  <button
                    key={region.id || region.name}
                    onClick={() => {
                      onSelectRegion(region);
                      setActiveTab('weather');
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="truncate font-semibold">{region.name}</div>
                    <div className="text-[11px] text-neutral-400 font-normal">{region.region}</div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (onOpenStationManager) onOpenStationManager('add');
                onClose();
              }}
              className="w-full mt-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{t.addStationBtn}</span>
            </button>
          </div>

          {/* Quick Agronomic Guidelines Card */}
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3.5 text-xs space-y-2">
            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{t.ipmPrinciplesTitle}</span>
            </div>
            <ul className="text-[11px] text-neutral-600 space-y-1.5 list-disc pl-4 leading-normal">
              <li>{t.ipm1}</li>
              <li>{t.ipm2}</li>
              <li>{t.ipm3}</li>
            </ul>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>AgriMind South Asia Edition</span>
          </div>
          <button
            onClick={() => window.print()}
            className="text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printSavePdfBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
