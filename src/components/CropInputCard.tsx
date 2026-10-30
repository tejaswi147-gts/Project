import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  AlertCircle, 
  Satellite, 
  Radio, 
  Plus, 
  Check, 
  Navigation,
  Compass
} from 'lucide-react';
import { LocationPreset, getAllAgricultureStations } from '../services/weatherService';
import { useLanguage } from '../i18n/LanguageContext';

interface CropInputCardProps {
  cropName: string;
  setCropName: (name: string) => void;
  onAnalyze: (coordinates?: { latitude: number; longitude: number; regionName?: string }) => void;
  isLoading: boolean;
  geoError: string | null;
  setGeoError: (err: string | null) => void;
  selectedRegion: LocationPreset | null;
  setSelectedRegion: (region: LocationPreset | null) => void;
  onOpenStationManager: (initialTab?: 'select' | 'add') => void;
  onDirectGpsAcquired?: (coords: { latitude: number; longitude: number; accuracy?: number }) => void;
}

const COMMON_CROPS = [
  { en: 'Tomato', te: 'టమోటా', ta: 'தக்காளி', kn: 'ಟೊಮೇಟೊ', ml: 'തക്കാളി' },
  { en: 'Rice', te: 'వరి', ta: 'நெல்', kn: 'ಭತ್ತ', ml: 'നെല്ല്' },
  { en: 'Cotton', te: 'పత్తి', ta: 'பருத்தி', kn: 'ಹತ್ತಿ', ml: 'പരുത്തി' },
  { en: 'Chilli', te: 'మిరప', ta: 'மிளகாய்', kn: 'ಮೆಣಸಿನಕಾಯಿ', ml: 'മുളക്' },
  { en: 'Wheat', te: 'గోధుమ', ta: 'கோதுமை', kn: 'ಗೋಧಿ', ml: 'ಗೋതമ്പ്' },
  { en: 'Potato', te: 'బంగాళాదుంప', ta: 'உருளைக்கிழங்கு', kn: 'ಆಲೂಗಡ್ಡೆ', ml: 'உருളക്കിഴങ്ങ്' },
  { en: 'Corn', te: 'మొక్కజొన్న', ta: 'சோளம்', kn: 'ಮೆಕ್ಕೆಜೋಳ', ml: 'ചോളം' },
  { en: 'Banana', te: 'అరటి', ta: 'வாழை', kn: 'ಬಾಳೆ', ml: 'வாഴ' },
];

export const CropInputCard: React.FC<CropInputCardProps> = ({
  cropName,
  setCropName,
  onAnalyze,
  isLoading,
  geoError,
  setGeoError,
  selectedRegion,
  setSelectedRegion,
  onOpenStationManager,
  onDirectGpsAcquired,
}) => {
  const { t, currentLanguage } = useLanguage();
  const [isGpsAcquiring, setIsGpsAcquiring] = useState(false);
  const [gpsLockedCoords, setGpsLockedCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null>(null);

  const allStations = getAllAgricultureStations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    if (gpsLockedCoords) {
      onAnalyze({
        latitude: gpsLockedCoords.latitude,
        longitude: gpsLockedCoords.longitude,
        regionName: `Direct GPS Field (${gpsLockedCoords.latitude.toFixed(3)}°N, ${gpsLockedCoords.longitude.toFixed(3)}°E)`,
      });
    } else if (selectedRegion) {
      onAnalyze({
        latitude: selectedRegion.latitude,
        longitude: selectedRegion.longitude,
        regionName: `${selectedRegion.name} (${selectedRegion.region})`,
      });
    } else {
      onAnalyze();
    }
  };

  const handleSelectCrop = (cropEn: string) => {
    setCropName(cropEn);
  };

  const handleSelectRegion = (region: LocationPreset) => {
    setSelectedRegion(region);
    setGpsLockedCoords(null);
    setGeoError(null);
  };

  // Direct 1-Click GPS Field Acquisition
  const handleSelectFieldByGps = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsAcquiring(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsAcquiring(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        const gpsStation: LocationPreset = {
          id: `direct-gps-${Date.now()}`,
          name: `Direct Field GPS (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`,
          region: `Device Live Coordinates (±${acc}m accuracy)`,
          latitude: lat,
          longitude: lon,
          description: `Real-time browser satellite lock acquired with ±${acc}m radius accuracy.`,
          stationType: 'Direct Farm GPS',
          isCustom: true,
        };

        setGpsLockedCoords({ latitude: lat, longitude: lon, accuracy: acc });
        setSelectedRegion(gpsStation);
        if (onDirectGpsAcquired) {
          onDirectGpsAcquired({ latitude: lat, longitude: lon, accuracy: acc });
        }

        // Run analysis immediately with detected coordinates if crop name is already populated
        if (cropName.trim()) {
          onAnalyze({
            latitude: lat,
            longitude: lon,
            regionName: `Direct Field GPS (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`,
          });
        }
      },
      (err) => {
        setIsGpsAcquiring(false);
        let msg = 'Could not acquire browser GPS location.';
        if (err.code === 1) msg = 'Location permission was denied by browser.';
        else if (err.code === 2) msg = 'GPS satellite fix unavailable.';
        else if (err.code === 3) msg = 'GPS request timed out.';
        setGeoError(`${msg} Defaulted to regional station.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="crop-input" className="block text-sm font-semibold text-neutral-800 mb-2">
            {t.enterCropLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="crop-input"
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder={t.enterCropPlaceholder}
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3 text-base text-neutral-900 bg-neutral-50/80 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-neutral-400"
            />
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            {t.cropHelpText}
          </p>
        </div>

        {/* Quick select crop suggestions */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            {t.popularCropsLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_CROPS.map((crop) => {
              const localizedName = (crop as any)[currentLanguage] || crop.en;
              const isSelected = cropName.toLowerCase() === crop.en.toLowerCase();
              return (
                <button
                  key={crop.en}
                  type="button"
                  onClick={() => handleSelectCrop(crop.en)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/30'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <span>{localizedName}</span>
                  {currentLanguage !== 'en' && (
                    <span className="text-[10px] opacity-75 ml-1">({crop.en})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dedicated Direct GPS Field & Agriculture Station Control Bar */}
        <div className="bg-emerald-50/60 rounded-xl border border-emerald-200/90 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                {selectedRegion?.stationType === 'Direct Farm GPS' ? (
                  <Navigation className="w-4 h-4 animate-pulse" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-neutral-900">{t.weatherAcquisitionMode}</span>
                  {selectedRegion && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                      {selectedRegion.stationType || 'Station'}
                    </span>
                  )}
                </div>

                <div className="text-xs text-emerald-950 font-medium mt-0.5">
                  {selectedRegion ? (
                    <span>
                      <strong className="text-emerald-900">{selectedRegion.name}</strong>{' '}
                      <span className="text-neutral-500 font-normal">
                        ({selectedRegion.region} • {selectedRegion.latitude.toFixed(3)}°, {selectedRegion.longitude.toFixed(3)}°)
                      </span>
                    </span>
                  ) : (
                    <span className="text-neutral-600">
                      {t.liveBrowserGpsLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Action Buttons: 1-Click GPS & Station Directory */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleSelectFieldByGps}
                disabled={isGpsAcquiring || isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer disabled:bg-neutral-300"
                title="Directly detect current field coordinates via device GPS"
              >
                {isGpsAcquiring ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t.gpsAcquiring}</span>
                  </>
                ) : (
                  <>
                    <Satellite className="w-3.5 h-3.5 text-emerald-200" />
                    <span>{t.selectFieldByGpsBtn}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenStationManager('select')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.changeStationBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenStationManager('add')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                title="Register custom agriculture station"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addStationBtn}</span>
              </button>
            </div>
          </div>

          {/* Quick Station Switcher Chips */}
          <div className="pt-2 border-t border-emerald-200/60">
            <div className="flex items-center justify-between text-[11px] text-neutral-600 mb-1.5 font-medium">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-700" />
                <span>Quick Agriculture Stations:</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenStationManager('select')}
                className="text-emerald-800 hover:underline font-semibold"
              >
                View all ({allStations.length}) →
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {allStations.slice(0, 6).map((station) => {
                const isCur = selectedRegion?.id === station.id || selectedRegion?.name === station.name;
                return (
                  <button
                    key={station.id || station.name}
                    type="button"
                    onClick={() => handleSelectRegion(station)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isCur
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {isCur && <Check className="w-3 h-3 text-emerald-200" />}
                    <span>{station.name.replace(' Agricultural Valley', '').replace(' Agromet Research Station', '').replace(' Station', '').replace(' Agro Station', '')}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onOpenStationManager('add')}
                className="px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer bg-emerald-100/60 hover:bg-emerald-200/60 text-emerald-900 border border-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{t.addStationBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Geolocation Error Alert */}
        {geoError && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="font-semibold text-amber-900">{t.locationNoticeTitle}</div>
              <p className="text-amber-800">{geoError}</p>
              <p className="text-[11px] text-amber-700 pt-0.5">
                {t.locationDefaultedNotice}
              </p>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || !cropName.trim()}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-neutral-300 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t.analyzingBtn}</span>
              </>
            ) : (
              <span>{t.analyzeCropHealthBtn}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
