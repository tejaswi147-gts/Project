import React, { useState } from 'react';
import { Sliders, RefreshCw, Thermometer, Droplets, ArrowRight } from 'lucide-react';
import { WeatherData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface WhatIfSimulatorProps {
  currentWeather: WeatherData | null;
  cropName: string;
  onSimulate: (temp: number, humidity: number) => void;
  isLoading: boolean;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentWeather,
  cropName,
  onSimulate,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [simTemp, setSimTemp] = useState<number>(currentWeather ? currentWeather.temperature : 26);
  const [simHumidity, setSimHumidity] = useState<number>(currentWeather ? currentWeather.humidity : 82);

  const handleApply = () => {
    onSimulate(simTemp, simHumidity);
  };

  const handleResetToCurrent = () => {
    if (currentWeather) {
      setSimTemp(currentWeather.temperature);
      setSimHumidity(currentWeather.humidity);
      onSimulate(currentWeather.temperature, currentWeather.humidity);
    }
  };

  const presets = [
    { label: 'Monsoon Rain & Humid', temp: 24, humidity: 92, note: 'High spore germination threat' },
    { label: 'Hot & Arid Heatwave', temp: 36, humidity: 32, note: 'High spider mite & thermal stress' },
    { label: 'Overcast & Warm', temp: 27, humidity: 76, note: 'Bacterial blight risk' },
    { label: 'Cool Morning Dew', temp: 15, humidity: 88, note: 'Botrytis / Damping-off risk' },
  ];

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <span>{t.whatIfTitle}</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {t.whatIfSubtitle} ({cropName || 'Crop'}).
          </p>
        </div>

        {currentWeather && (
          <button
            onClick={handleResetToCurrent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>{t.syncLiveWeatherBtn}</span>
          </button>
        )}
      </div>

      {/* Preset scenario buttons */}
      <div>
        <div className="text-xs font-semibold text-neutral-700 mb-2">
          {t.quickScenariosLabel}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setSimTemp(p.temp);
                setSimHumidity(p.humidity);
              }}
              className="text-left p-3 rounded-lg border border-neutral-200 hover:border-emerald-500/60 hover:bg-emerald-50/30 transition-all text-xs cursor-pointer"
            >
              <div className="font-semibold text-neutral-900">{p.label}</div>
              <div className="text-neutral-500 font-mono tabular-nums text-[11px] mt-0.5">
                {p.temp}°C · {p.humidity}% RH
              </div>
              <div className="text-[11px] text-emerald-800 mt-1 font-medium">{p.note}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Slider Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-emerald-700" />
              {t.simulatedTempLabel}
            </span>
            <span className="font-mono tabular-nums text-sm font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
              {simTemp.toFixed(1)}°C
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="45"
            step="0.5"
            value={simTemp}
            onChange={(e) => setSimTemp(parseFloat(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-neutral-400">
            <span>5°C</span>
            <span>25°C</span>
            <span>45°C</span>
          </div>
        </div>

        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-700" />
              {t.simulatedHumidityLabel}
            </span>
            <span className="font-mono tabular-nums text-sm font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
              {simHumidity}%
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={simHumidity}
            onChange={(e) => setSimHumidity(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-700 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-neutral-400">
            <span>20%</span>
            <span>60%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Execute simulation button */}
      <div>
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{t.runGeminiSimBtn} ({simTemp}°C, {simHumidity}%)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
