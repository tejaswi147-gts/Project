import React from 'react';
import { CloudRain, ShieldAlert, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-10 md:py-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/60">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center space-y-4">
        {/* Kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <span>{t.heroKicker}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight" style={{ textWrap: 'balance' }}>
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* 3 Value Pillars */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.pillar1Title}</span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-normal">
              {t.pillar1Desc}
            </p>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
              <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.pillar2Title}</span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-normal">
              {t.pillar2Desc}
            </p>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.pillar3Title}</span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-normal">
              {t.pillar3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
