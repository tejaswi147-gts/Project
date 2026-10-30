import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CloudSun, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  Sun, 
  Thermometer, 
  Info, 
  X,
  Package,
  Layers,
  Camera,
  ArrowRight
} from 'lucide-react';
import { HARVEST_DATABASE, CropHarvestGuide } from '../data/harvestDatabase';
import { WeatherData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HarvestAdvisorProps {
  currentWeather?: WeatherData | null;
  onNavigateToScanner?: () => void;
}

type CategoryFilter = 'All' | 'Fruit' | 'Vegetable' | 'Grain' | 'Cash Crop';

export const HarvestAdvisor: React.FC<HarvestAdvisorProps> = ({ 
  currentWeather,
  onNavigateToScanner,
}) => {
  const { t, currentLanguage } = useLanguage();
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedCropModal, setSelectedCropModal] = useState<CropHarvestGuide | null>(null);

  // State for Interactive Readiness Checker
  const [checkerCropId, setCheckerCropId] = useState<string>('tomato');
  const [checkedVisualSigns, setCheckedVisualSigns] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [tactileSelected, setTactileSelected] = useState<boolean>(true);
  const [weatherCondition, setWeatherCondition] = useState<'dry' | 'damp' | 'rain_forecast'>('dry');

  // Currently selected crop for checker
  const activeCheckerCrop = useMemo(() => {
    return HARVEST_DATABASE.find(c => c.id === checkerCropId) || HARVEST_DATABASE[0];
  }, [checkerCropId]);

  // Handle crop change in checker
  const handleCropSelectChange = (cropId: string) => {
    setCheckerCropId(cropId);
    setCheckedVisualSigns({ 0: true });
    setTactileSelected(true);
  };

  // Filtered crops list
  const filteredCrops = useMemo(() => {
    return HARVEST_DATABASE.filter(crop => {
      // Category match
      if (selectedCategory !== 'All' && crop.category !== selectedCategory) {
        return false;
      }
      // Query match (checks English, regional names, duration)
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const localizedName = (crop.names[currentLanguage as keyof typeof crop.names] || '').toLowerCase();
      const enName = crop.name.toLowerCase();
      const categoryName = crop.category.toLowerCase();
      return enName.includes(q) || localizedName.includes(q) || categoryName.includes(q);
    });
  }, [selectedCategory, searchQuery, currentLanguage]);

  // Readiness Calculation
  const readinessResult = useMemo(() => {
    const totalSigns = activeCheckerCrop.visualSigns.length + 1; // visual + tactile
    let matchedSigns = 0;
    activeCheckerCrop.visualSigns.forEach((_, idx) => {
      if (checkedVisualSigns[idx]) matchedSigns++;
    });
    if (tactileSelected) matchedSigns++;

    const baseScore = Math.round((matchedSigns / totalSigns) * 100);

    let readinessVerdict: {
      score: number;
      status: 'ready' | 'approaching' | 'not_ready' | 'weather_risk';
      headline: string;
      advice: string;
      timingWindow: string;
    };

    if (weatherCondition === 'rain_forecast') {
      if (baseScore >= 70) {
        readinessVerdict = {
          score: baseScore,
          status: 'weather_risk',
          headline: 'Urgent Pre-Rain Harvest Advised',
          advice: 'Rain is forecasted. For mature produce, harvest immediately before rainfall to avoid fruit cracking, waterlogging, or fungal spore germination.',
          timingWindow: 'Complete before incoming rain; handle gently.',
        };
      } else {
        readinessVerdict = {
          score: baseScore,
          status: 'not_ready',
          headline: 'Protect Crop from Rain; Not Yet Mature',
          advice: 'Crop is not mature enough to pick early. Ensure proper field drainage and apply preventive biocontrol if prolonged wetness is expected.',
          timingWindow: 'Wait for next dry spell and maturity completion.',
        };
      }
    } else if (weatherCondition === 'damp') {
      readinessVerdict = {
        score: Math.max(30, baseScore - 15),
        status: 'approaching',
        headline: 'Wait for Dew to Dry Before Harvesting',
        advice: 'Never harvest wet produce under high morning humidity or morning dew. Surface moisture invites post-harvest bacterial and fungal rots.',
        timingWindow: 'Delay pick until late morning (after 09:30 AM).',
      };
    } else if (baseScore >= 80) {
      readinessVerdict = {
        score: baseScore,
        status: 'ready',
        headline: 'Optimal Commercial Maturity Reached!',
        advice: 'Maturity cues and tactile firmness match the peak commercial grade. Harvest during the recommended time of day for maximum shelf life.',
        timingWindow: activeCheckerCrop.idealTimeOfDay,
      };
    } else if (baseScore >= 50) {
      readinessVerdict = {
        score: baseScore,
        status: 'approaching',
        headline: 'Approaching Maturity (Wait 3–7 Days)',
        advice: 'Fruit or grain is actively filling and developing sugars. Continue monitoring for color change and shoulder expansion.',
        timingWindow: 'Check again in 3–5 days.',
      };
    } else {
      readinessVerdict = {
        score: baseScore,
        status: 'not_ready',
        headline: 'Immature / Vegetative Stage',
        advice: 'Key visual signs and firmness indicators are not yet present. Premature harvesting will result in poor flavor, low test weight, and weight loss.',
        timingWindow: 'Allow crop to complete physiological development.',
      };
    }

    return readinessVerdict;
  }, [activeCheckerCrop, checkedVisualSigns, tactileSelected, weatherCondition]);

  // Localized crop name helper
  const getCropDisplayName = (crop: CropHarvestGuide) => {
    const regional = crop.names[currentLanguage as keyof typeof crop.names];
    if (regional && currentLanguage !== 'en') {
      return `${regional} (${crop.name})`;
    }
    return crop.name;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* SECTION 1: HEADER & WEATHER SYNC BANNER */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.harvestAdvisorTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {t.harvestAdvisorTitle}
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {t.harvestAdvisorSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Real-time Field Weather Guidance Badge */}
            {currentWeather && (
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Field Atmosphere
                  </div>
                  <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span>{currentWeather.temperature}°C</span>
                    <span>·</span>
                    <span>{currentWeather.humidity}% RH</span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium">
                    {currentWeather.humidity > 80 
                      ? 'Delay harvest until dew dries'
                      : 'Dry morning window for picking'}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Camera Scan Trigger */}
            {onNavigateToScanner && (
              <button
                onClick={onNavigateToScanner}
                className="px-4 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-300" />
                <span className="whitespace-nowrap">Scan Photo for Harvest Time</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE HARVEST READINESS CHECKER */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-6 border-b border-neutral-200 pb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {t.harvestReadinessChecker}
            </h2>
            <p className="text-xs text-neutral-500">
              Select your crop, observed symptoms, and local atmosphere to calculate harvest timing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Crop Selector */}
            <div>
              <label htmlFor="checker-crop-select" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Select Crop / Fruit / Vegetable
              </label>
              <select
                id="checker-crop-select"
                value={checkerCropId}
                onChange={(e) => handleCropSelectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
              >
                {HARVEST_DATABASE.map(c => (
                  <option key={c.id} value={c.id}>
                    {getCropDisplayName(c)} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Visual Symptoms Observed */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5 flex items-center justify-between">
                <span>{t.visualMaturitySigns}</span>
                <span className="text-[11px] font-normal text-neutral-500">Check observed cues</span>
              </div>
              <div className="space-y-2">
                {activeCheckerCrop.visualSigns.map((sign, idx) => (
                  <label 
                    key={idx} 
                    className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      checkedVisualSigns[idx] 
                        ? 'bg-emerald-50/70 border-emerald-300 text-neutral-900 font-medium' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedVisualSigns[idx]}
                      onChange={(e) => {
                        setCheckedVisualSigns(prev => ({
                          ...prev,
                          [idx]: e.target.checked
                        }));
                      }}
                      className="mt-0.5 h-4 w-4 rounded text-emerald-700 focus:ring-emerald-700 border-neutral-300 cursor-pointer"
                    />
                    <span>{sign}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tactile Firmness / Snap Check */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                {t.tactileMaturitySigns}
              </div>
              <label 
                className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                  tactileSelected 
                    ? 'bg-emerald-50/70 border-emerald-300 text-neutral-900 font-medium' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={tactileSelected}
                  onChange={(e) => setTactileSelected(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-emerald-700 focus:ring-emerald-700 border-neutral-300 cursor-pointer"
                />
                <div>
                  <div className="font-semibold text-neutral-900 mb-0.5">Physical Texture Test</div>
                  <div className="text-neutral-600">{activeCheckerCrop.tactileSigns.join(' ')}</div>
                </div>
              </label>
            </div>

            {/* Weather / Rain Forecast */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                Current Weather & Sky Condition
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setWeatherCondition('dry')}
                  className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    weatherCondition === 'dry'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Sun className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span>Dry & Sunny</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeatherCondition('damp')}
                  className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    weatherCondition === 'damp'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Droplets className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                  <span>Heavy Dew / Fog</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeatherCondition('rain_forecast')}
                  className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    weatherCondition === 'rain_forecast'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <CloudSun className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                  <span>Rain Forecasted</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Verdict Result Card */}
          <div className="lg:col-span-5 bg-neutral-50 rounded-xl p-5 sm:p-6 border border-neutral-200 space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Harvest Readiness Evaluation
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-neutral-900">
                  {readinessResult.headline}
                </h3>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
                  readinessResult.status === 'ready'
                    ? 'bg-emerald-100 text-emerald-800'
                    : readinessResult.status === 'weather_risk'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {readinessResult.score}% Ready
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  readinessResult.status === 'ready'
                    ? 'bg-emerald-600'
                    : readinessResult.status === 'weather_risk'
                    ? 'bg-amber-500'
                    : 'bg-neutral-500'
                }`}
                style={{ width: `${readinessResult.score}%` }}
              />
            </div>

            {/* Recommended Time Window */}
            <div className="p-3.5 rounded-lg bg-white border border-neutral-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.bestTimeOfDay}</span>
              </div>
              <div className="text-xs text-neutral-900 font-medium">
                {readinessResult.timingWindow}
              </div>
            </div>

            {/* Weather Rule & Precaution */}
            <div className="p-3.5 rounded-lg bg-white border border-neutral-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.weatherHarvestRule}</span>
              </div>
              <div className="text-xs text-neutral-700 leading-relaxed">
                {activeCheckerCrop.weatherWarning}
              </div>
            </div>

            {/* Action Advice */}
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Agronomic Advisory</span>
              </div>
              <div className="text-xs text-emerald-950 leading-relaxed">
                {readinessResult.advice}
              </div>
            </div>

            {/* Grain Moisture or Post-Harvest Detail if Grain */}
            {activeCheckerCrop.optimalGrainMoisture && (
              <div className="p-3.5 rounded-lg bg-cyan-50 border border-cyan-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-900">
                  <Droplets className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Grain Moisture Standard</span>
                </div>
                <div className="text-xs text-cyan-950">
                  {activeCheckerCrop.optimalGrainMoisture}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: COMPREHENSIVE HARVEST DATABASE & CALENDAR */}
      <div className="space-y-6">
        {/* Search, Filter Pills & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {(['All', 'Fruit', 'Vegetable', 'Grain', 'Cash Crop'] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop or regional name..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-xl border border-neutral-200 hover:border-emerald-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Card Header: Category & Regional Name */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      crop.category === 'Fruit'
                        ? 'bg-amber-100 text-amber-800'
                        : crop.category === 'Vegetable'
                        ? 'bg-emerald-100 text-emerald-800'
                        : crop.category === 'Grain'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {crop.category}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-1.5">
                      {crop.name}
                    </h3>
                    <div className="text-xs text-emerald-800 font-medium">
                      {crop.names[currentLanguage as keyof typeof crop.names] || crop.names.en}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCropModal(crop)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="View Full Harvesting Protocol"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Duration */}
                <div className="text-xs text-neutral-600 flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-800">{t.maturityDuration}:</span>{' '}
                    <span>{crop.duration}</span>
                  </div>
                </div>

                {/* Best Time of Day */}
                <div className="text-xs text-neutral-600 flex items-start gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-800">{t.bestTimeOfDay}:</span>{' '}
                    <span>{crop.idealTimeOfDay}</span>
                  </div>
                </div>

                {/* Key Visual Signs */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {t.visualMaturitySigns}
                  </div>
                  <ul className="space-y-1">
                    {crop.visualSigns.slice(0, 2).map((sign, idx) => (
                      <li key={idx} className="text-xs text-neutral-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Maturity Stages Visual Timeline */}
                <div className="space-y-1 pt-2 border-t border-neutral-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {t.harvestStagesTitle}
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-medium">
                    {crop.harvestStages.slice(0, 3).map((stage, idx) => (
                      <div 
                        key={idx}
                        className={`p-1 rounded ${
                          stage.status === 'optimal'
                            ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                            : stage.status === 'ripe'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {stage.stage}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Open Full Protocol */}
              <div className="mt-5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedCropModal(crop)}
                  className="w-full py-2 px-3 bg-neutral-50 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 text-xs font-semibold rounded-lg border border-neutral-200 hover:border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Complete Harvesting Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: GOLDEN AGRONOMIC RULES FOR HARVESTING */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold">4 Golden Rules for Safe Harvesting & Storage</h3>
            <p className="text-xs text-emerald-200">Standard Agricultural Extension Best Practices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 space-y-1.5">
            <div className="font-bold text-emerald-100 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-300" />
              <span>1. Zero Dew Rule</span>
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              Never pick fruits or vegetables while dew is still on the surface. Trapped moisture inside packaging leads to rapid mold outbreak.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 space-y-1.5">
            <div className="font-bold text-emerald-100 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>2. Beat the Field Heat</span>
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              Harvest between 06:30–09:30 AM before midday temperatures heat up produce. Field heat causes rapid respiration and weight shrinkage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 space-y-1.5">
            <div className="font-bold text-emerald-100 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>3. Grain Moisture Check</span>
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              Harvest paddy and maize at 20–22% moisture; sun-dry on tarpaulins down to 12–14% within 48 hours to prevent aflatoxin contamination.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 space-y-1.5">
            <div className="font-bold text-emerald-100 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-teal-300" />
              <span>4. Gentle Handling</span>
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              Use shallow ventilated plastic crates instead of rough sacks. Stack no higher than 3 tiers to avoid crushing lower produce.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: DETAILED CROP HARVESTING PROTOCOL */}
      {selectedCropModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-neutral-900">
                      {selectedCropModal.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                      {selectedCropModal.category}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">
                    Regional: {selectedCropModal.names[currentLanguage as keyof typeof selectedCropModal.names] || selectedCropModal.names.en}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCropModal(null)}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-neutral-700">
              {/* Duration & Ideal Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t.maturityDuration}</span>
                  </div>
                  <div>{selectedCropModal.duration}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.bestTimeOfDay}</span>
                  </div>
                  <div>{selectedCropModal.idealTimeOfDay}</div>
                </div>
              </div>

              {/* Weather Window & Precautions */}
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.weatherHarvestRule}</span>
                </div>
                <p className="text-amber-950 leading-relaxed">
                  {selectedCropModal.weatherWarning}
                </p>
                <div className="text-[11px] text-amber-800 font-medium pt-1">
                  Ideal Weather: {selectedCropModal.idealWeatherWindow}
                </div>
              </div>

              {/* Visual Maturity Signs */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {t.visualMaturitySigns}
                </div>
                <div className="space-y-1.5">
                  {selectedCropModal.visualSigns.map((sign, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactile Signs */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {t.tactileMaturitySigns}
                </div>
                <div className="space-y-1.5">
                  {selectedCropModal.tactileSigns.map((sign, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Harvest Stages Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {t.harvestStagesTitle}
                </div>
                <div className="overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
                      <tr>
                        <th className="p-2.5 font-bold">Stage</th>
                        <th className="p-2.5 font-bold">Characteristics</th>
                        <th className="p-2.5 font-bold">Recommended Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedCropModal.harvestStages.map((stage, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="p-2.5 font-bold text-neutral-900 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              stage.status === 'optimal'
                                ? 'bg-emerald-100 text-emerald-800'
                                : stage.status === 'ripe'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              {stage.stage}
                            </span>
                          </td>
                          <td className="p-2.5 text-neutral-600">{stage.desc}</td>
                          <td className="p-2.5 text-neutral-800 font-medium">{stage.bestFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Post-Harvest Tips & Cold Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t.postHarvestCare}</span>
                  </div>
                  <div className="text-emerald-950 leading-relaxed">
                    {selectedCropModal.postHarvestTips}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Optimal Storage Conditions</span>
                  </div>
                  <div className="text-neutral-700 leading-relaxed">
                    {selectedCropModal.storageConditions}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50/70 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCropModal(null)}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
