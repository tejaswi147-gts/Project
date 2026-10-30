import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Radio, 
  Plus, 
  Trash2, 
  Check, 
  Navigation, 
  Search, 
  Compass, 
  Sprout, 
  Layers, 
  Satellite,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  LocationPreset, 
  getAllAgricultureStations, 
  saveCustomStation, 
  deleteCustomStation 
} from '../services/weatherService';
import { useLanguage } from '../i18n/LanguageContext';

interface StationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStation: LocationPreset | null;
  onSelectStation: (station: LocationPreset | null) => void;
  onSelectDirectGps: (coords: { latitude: number; longitude: number; accuracy?: number }) => void;
  initialTab?: 'select' | 'add';
}

const COMMON_CROP_TAGS = [
  'Rice',
  'Tomato',
  'Chilli',
  'Cotton',
  'Sugarcane',
  'Wheat',
  'Potato',
  'Corn',
  'Banana',
  'Pepper',
  'Onion',
  'Grapes'
];

export const StationManagerModal: React.FC<StationManagerModalProps> = ({
  isOpen,
  onClose,
  selectedStation,
  onSelectStation,
  onSelectDirectGps,
  initialTab = 'select',
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'select' | 'add'>(initialTab);
  const [stations, setStations] = useState<LocationPreset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'custom' | 'regional'>('all');

  // GPS acquisition states
  const [isAcquiringGps, setIsAcquiringGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState<string | null>(null);

  // Form states for adding a new station
  const [formName, setFormName] = useState('');
  const [formRegion, setFormRegion] = useState('');
  const [formStationType, setFormStationType] = useState<string>('IoT Micro-Weather');
  const [formLat, setFormLat] = useState<string>('');
  const [formLon, setFormLon] = useState<string>('');
  const [formElevation, setFormElevation] = useState<string>('');
  const [formDescription, setFormDescription] = useState('');
  const [formCrops, setFormCrops] = useState<string[]>(['Rice', 'Chilli']);
  const [customCropInput, setCustomCropInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStations(getAllAgricultureStations());
      setActiveTab(initialTab);
      setGpsError(null);
      setGpsSuccessMsg(null);
      setFormSuccess(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const reloadStations = () => {
    setStations(getAllAgricultureStations());
  };

  // Direct 1-Click GPS Field Acquisition
  const handleDirectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsAcquiringGps(true);
    setGpsError(null);
    setGpsSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsAcquiringGps(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        setGpsSuccessMsg(`Field GPS locked: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E (±${acc}m accuracy)`);
        
        onSelectDirectGps({
          latitude: lat,
          longitude: lon,
          accuracy: acc,
        });

        setTimeout(() => {
          onClose();
        }, 800);
      },
      (err) => {
        setIsAcquiringGps(false);
        let msg = 'Could not acquire browser GPS location.';
        if (err.code === 1) msg = 'Location permission denied by browser.';
        else if (err.code === 2) msg = 'GPS satellite signal unavailable.';
        else if (err.code === 3) msg = 'GPS acquisition request timed out.';
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Auto-fill form coordinates using GPS
  const handleAutoFillFormGps = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation not supported.');
      return;
    }

    setIsAcquiringGps(true);
    setFormError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsAcquiringGps(false);
        setFormLat(pos.coords.latitude.toFixed(4));
        setFormLon(pos.coords.longitude.toFixed(4));
        if (pos.coords.altitude) {
          setFormElevation(Math.round(pos.coords.altitude).toString());
        }
      },
      (err) => {
        setIsAcquiringGps(false);
        setFormError('Unable to fetch live GPS fix: ' + (err.message || 'Permission denied'));
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
      }
    );
  };

  const handleToggleCrop = (crop: string) => {
    if (formCrops.includes(crop)) {
      setFormCrops(formCrops.filter((c) => c !== crop));
    } else {
      setFormCrops([...formCrops, crop]);
    }
  };

  const handleAddCustomCrop = () => {
    const trimmed = customCropInput.trim();
    if (trimmed && !formCrops.includes(trimmed)) {
      setFormCrops([...formCrops, trimmed]);
      setCustomCropInput('');
    }
  };

  const handleSaveStation = (andActivate: boolean) => {
    setFormError(null);
    setFormSuccess(null);

    if (!formName.trim()) {
      setFormError('Please enter a station name.');
      return;
    }

    const latNum = parseFloat(formLat);
    const lonNum = parseFloat(formLon);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      setFormError('Please enter a valid Latitude between -90 and 90 degrees.');
      return;
    }
    if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      setFormError('Please enter a valid Longitude between -180 and 180 degrees.');
      return;
    }

    const newStation: LocationPreset = {
      id: `station-${Date.now()}`,
      name: formName.trim(),
      region: formRegion.trim() || 'Custom Farm Block',
      latitude: latNum,
      longitude: lonNum,
      stationType: formStationType,
      elevationMeters: formElevation ? parseFloat(formElevation) : undefined,
      description: formDescription.trim() || `Custom agriculture station with ${formCrops.join(', ') || 'field crops'}.`,
      primaryCrops: formCrops.length > 0 ? formCrops : ['Paddy', 'Chilli'],
      isCustom: true,
    };

    saveCustomStation(newStation);
    reloadStations();
    setFormSuccess(t.stationSavedSuccess);

    // Reset inputs
    setFormName('');
    setFormRegion('');
    setFormLat('');
    setFormLon('');
    setFormElevation('');
    setFormDescription('');

    if (andActivate) {
      onSelectStation(newStation);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setActiveTab('select');
    }
  };

  const handleDeleteStation = (e: React.MouseEvent, station: LocationPreset) => {
    e.stopPropagation();
    if (confirm(`Remove custom station "${station.name}"?`)) {
      deleteCustomStation(station.id || station.name);
      reloadStations();
      if (selectedStation?.id === station.id || selectedStation?.name === station.name) {
        onSelectStation(null);
      }
    }
  };

  const filteredStations = stations.filter((s) => {
    if (filterType === 'custom' && !s.isCustom) return false;
    if (filterType === 'regional' && s.isCustom) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = s.name.toLowerCase().includes(q);
    const matchRegion = s.region.toLowerCase().includes(q);
    const matchCrops = s.primaryCrops?.some((c) => c.toLowerCase().includes(q));
    const matchType = s.stationType?.toLowerCase().includes(q);
    return matchName || matchRegion || matchCrops || matchType;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-start justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/90 border border-emerald-700/60 flex items-center justify-center text-emerald-200 shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{t.stationDirectoryTitle}</span>
              </h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {t.stationDirectorySubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Direct Field GPS Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200/80 p-3.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900">
                {t.liveBrowserGpsLabel}
              </div>
              <div className="text-[11px] text-neutral-600">
                Directly locks your phone/device GPS coordinates for instant microclimate telemetry.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDirectGps}
            disabled={isAcquiringGps}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer disabled:bg-neutral-300 shrink-0"
          >
            {isAcquiringGps ? (
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
        </div>

        {/* GPS Notifications */}
        {gpsError && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
        {gpsSuccessMsg && (
          <div className="px-6 py-2 bg-emerald-100 border-b border-emerald-300 text-xs text-emerald-950 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{gpsSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 px-6 bg-neutral-50/70">
          <button
            onClick={() => setActiveTab('select')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'select'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{t.tabSelectStation}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-neutral-200/80 text-neutral-700">
              {stations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{t.tabAddStation}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'select' ? (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchStationsPlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder:text-neutral-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      filterType === 'all'
                        ? 'bg-neutral-800 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    All ({stations.length})
                  </button>
                  <button
                    onClick={() => setFilterType('regional')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      filterType === 'regional'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Agromet
                  </button>
                  <button
                    onClick={() => setFilterType('custom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      filterType === 'custom'
                        ? 'bg-teal-800 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Custom ({stations.filter((s) => s.isCustom).length})
                  </button>
                </div>
              </div>

              {/* Stations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {filteredStations.map((station) => {
                  const isCurrent = selectedStation?.name === station.name || selectedStation?.id === station.id;

                  return (
                    <div
                      key={station.id || station.name}
                      onClick={() => {
                        onSelectStation(station);
                        onClose();
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/30'
                          : 'border-neutral-200 bg-white hover:border-emerald-300 hover:bg-neutral-50/80 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="font-bold text-xs text-neutral-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                          {station.name}
                        </div>
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white shrink-0">
                            <Check className="w-3 h-3" />
                            {t.activeStationBadge}
                          </span>
                        ) : station.isCustom ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
                            {t.customStationBadge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                            {station.stationType || 'Agromet'}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-neutral-600 flex items-center gap-1.5 mb-2">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{station.region}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500 mb-2 font-mono">
                        <span>Lat: {station.latitude.toFixed(3)}°</span>
                        <span>Lon: {station.longitude.toFixed(3)}°</span>
                        {station.elevationMeters && <span>Alt: {station.elevationMeters}m</span>}
                      </div>

                      {station.primaryCrops && station.primaryCrops.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {station.primaryCrops.map((c) => (
                            <span
                              key={c}
                              className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                        {station.description}
                      </p>

                      {/* Footer Actions */}
                      <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isCurrent ? 'Current Field Station' : 'Select Field Station'}</span>
                        </button>

                        {station.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteStation(e, station)}
                            className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title={t.deleteStationBtn}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredStations.length === 0 && (
                <div className="text-center py-10 bg-neutral-50 rounded-xl border border-neutral-200">
                  <Compass className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs text-neutral-600 font-medium">No stations found matching &quot;{searchQuery}&quot;.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}
                    className="mt-2 text-xs text-emerald-800 hover:underline font-semibold"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Add New Agriculture Station Form */
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-3.5 flex items-start gap-3">
                <Radio className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-700">
                  <span className="font-bold text-neutral-900">Custom Farm Telemetry Node:</span> Register your farm plot, KVK field unit, or village weather observer station. These stations are stored persistently and can be toggled at any time.
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t.stationNameLabel} *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Cauvery Canal Block 4 or West Field Plot"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t.stationRegionLabel}
                  </label>
                  <input
                    type="text"
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value)}
                    placeholder="e.g. Guntur District, Andhra Pradesh"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Station Type & Elevation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t.stationTypeLabel}
                  </label>
                  <select
                    value={formStationType}
                    onChange={(e) => setFormStationType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  >
                    <option value="IoT Micro-Weather">IoT Micro-Weather Station (Wireless Sensors)</option>
                    <option value="KVK Agromet Node">KVK Agromet Advisory Node</option>
                    <option value="Govt AWS Telemetry">Govt AWS Telemetry Unit</option>
                    <option value="Farm Field Observer">Farm Field Manual Observer</option>
                    <option value="Direct Farm GPS">Direct Farm GPS Telemetry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t.elevationLabel}
                  </label>
                  <input
                    type="number"
                    value={formElevation}
                    onChange={(e) => setFormElevation(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Coordinates Section with Live GPS Auto-Fill */}
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Station GPS Coordinates *</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleAutoFillFormGps}
                    disabled={isAcquiringGps}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-md shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Satellite className="w-3 h-3" />
                    <span>{t.autoFillGpsBtn}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1 font-mono">
                      {t.stationLatLabel} *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formLat}
                      onChange={(e) => setFormLat(e.target.value)}
                      placeholder="e.g. 16.3067"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1 font-mono">
                      {t.stationLonLabel} *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formLon}
                      onChange={(e) => setFormLon(e.target.value)}
                      placeholder="e.g. 80.4365"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Crops Monitored */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {t.primaryCropsLabel}
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_CROP_TAGS.map((crop) => {
                    const isSelected = formCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => handleToggleCrop(crop)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {crop}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCropInput}
                    onChange={(e) => setCustomCropInput(e.target.value)}
                    placeholder="Add custom crop (e.g. Turmeric, Mustard)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCrop();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCrop}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Description & Soil Notes */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Field Notes / Soil & Microclimate Context
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Black alluvial soil, canal irrigated, high night condensation zone..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white resize-none"
                />
              </div>

              {/* Form Submit Buttons */}
              <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSaveStation(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  {t.saveStationBtn}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveStation(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.saveAndActivateBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
