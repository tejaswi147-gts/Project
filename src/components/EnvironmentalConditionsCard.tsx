import React from 'react';
import { Thermometer, Droplets, Wind, CloudRain, Sun, MapPin, Gauge } from 'lucide-react';
import { WeatherData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface EnvironmentalConditionsCardProps {
  weather: WeatherData;
  cropName: string;
}

export const EnvironmentalConditionsCard: React.FC<EnvironmentalConditionsCardProps> = ({
  weather,
  cropName,
}) => {
  const { t } = useLanguage();

  const isHighHumidity = weather.humidity >= 75;
  const isOptimalHumidity = weather.humidity >= 50 && weather.humidity < 75;

  const isHot = weather.temperature >= 30;
  const isModerate = weather.temperature >= 18 && weather.temperature < 30;

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 flex flex-col justify-between">
      <div>
        {/* Card Header with Unboxed Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              {t.envConditionsTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-emerald-700" />
                {weather.locationName}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {weather.latitude >= 0 ? `${weather.latitude}°N` : `${Math.abs(weather.latitude)}°S`},{' '}
                {weather.longitude >= 0 ? `${weather.longitude}°E` : `${Math.abs(weather.longitude)}°W`}
              </span>
            </div>
          </div>

          <div className="text-xs text-neutral-500 self-start sm:self-auto font-mono">
            {t.syncedLabel} {weather.timestamp}
          </div>
        </div>

        {/* Primary 2 KPIs: Temperature (°C) and Humidity (%) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {/* Temperature Tile */}
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
              <span className="font-semibold uppercase tracking-wider">{t.ambientTemp}</span>
              <Thermometer className="w-4 h-4 text-emerald-700" />
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 font-mono tabular-nums">
                {weather.temperature.toFixed(1)}
              </span>
              <span className="text-xl font-bold text-neutral-500">°C</span>
            </div>

            <div className="mt-3 text-xs text-neutral-600 flex items-center justify-between border-t border-neutral-200/70 pt-2">
              <span>{t.statusLabel}</span>
              <span className="font-semibold text-neutral-800">
                {isHot ? 'High Thermal Stress' : isModerate ? 'Optimal Vegetative Range' : 'Cool Canopy Phase'}
              </span>
            </div>
          </div>

          {/* Humidity Tile */}
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
              <span className="font-semibold uppercase tracking-wider">{t.relHumidity}</span>
              <Droplets className="w-4 h-4 text-emerald-700" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 font-mono tabular-nums">
                {weather.humidity}
              </span>
              <span className="text-xl font-bold text-neutral-500">%</span>
            </div>

            <div className="mt-3 text-xs text-neutral-600 flex items-center justify-between border-t border-neutral-200/70 pt-2">
              <span>{t.foliarMoistureLabel}</span>
              <span className={`font-semibold ${isHighHumidity ? 'text-amber-800' : 'text-neutral-800'}`}>
                {isHighHumidity ? 'Saturated / High Dew' : isOptimalHumidity ? 'Moderate Evaporation' : 'Dry Boundary Layer'}
              </span>
            </div>
          </div>
        </div>

        {/* Atmospheric Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <div className="text-neutral-500 flex items-center gap-1.5 mb-1">
              <Droplets className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.dewPoint}</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
              {weather.dewPoint}°C
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <div className="text-neutral-500 flex items-center gap-1.5 mb-1">
              <Wind className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.windSpeed}</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
              {weather.windSpeed} km/h
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <div className="text-neutral-500 flex items-center gap-1.5 mb-1">
              <CloudRain className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.rainfallProb}</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
              {weather.precipitationChance}%
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <div className="text-neutral-500 flex items-center gap-1.5 mb-1">
              <Sun className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.uvIndex}</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
              {weather.uvIndex} / 10
            </div>
          </div>
        </div>
      </div>

      {/* Pathological microclimate summary */}
      <div className="mt-6 pt-4 border-t border-neutral-200 text-xs text-neutral-600 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
        <div className="font-semibold text-emerald-950 mb-1 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t.microclimateAssessmentFor} {cropName}</span>
        </div>
        <p className="text-emerald-900/90 leading-relaxed text-[11px]">
          {isHighHumidity && isModerate
            ? `Critical Warning: The combination of ${weather.temperature}°C with ${weather.humidity}% humidity creates sustained leaf wetness (>6 hrs), drastically elevating spore propagation and zoospore motility.`
            : `Favorable: Current conditions represent a manageable microclimate envelope. Continue baseline scouting and prophylactic protection.`}
        </p>
      </div>
    </div>
  );
};
