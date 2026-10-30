/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { SouthIndianLanguageBar } from './components/SouthIndianLanguageBar';
import { HeroSection } from './components/HeroSection';
import { CropInputCard } from './components/CropInputCard';
import { LoadingAnalysisState } from './components/LoadingAnalysisState';
import { EnvironmentalConditionsCard } from './components/EnvironmentalConditionsCard';
import { AiDiagnosisCard } from './components/AiDiagnosisCard';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { DiseaseLibraryModal } from './components/DiseaseLibraryModal';
import { StationManagerModal } from './components/StationManagerModal';
import { RecentAnalyses } from './components/RecentAnalyses';
import { AiLeafScanner } from './components/AiLeafScanner';
import { HarvestAdvisor } from './components/HarvestAdvisor';
import { LeftSidebarDrawer } from './components/LeftSidebarDrawer';
import { fetchMockOpenWeatherData, LocationPreset } from './services/weatherService';
import { generateGeminiCropDiagnosis } from './services/geminiService';
import { AnalysisRecord, DiseasePrediction, WeatherData } from './types';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Camera, CloudSun, Sliders, ArrowRight, CalendarCheck } from 'lucide-react';

function AppContent() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'weather' | 'harvest' | 'simulator'>('scanner');
  const [cropName, setCropName] = useState<string>('Tomato');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<LocationPreset | null>(null);
  
  // Current weather analysis results
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<DiseasePrediction | null>(null);
  const [lastAnalyzedCrop, setLastAnalyzedCrop] = useState<string>('');

  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState<boolean>(false);
  const [stationModalTab, setStationModalTab] = useState<'select' | 'add'>('select');
  
  // Recent analyses saved in localStorage
  const [history, setHistory] = useState<AnalysisRecord[]>(() => {
    try {
      const saved = localStorage.getItem('agrimind_recent_analyses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const weatherResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('agrimind_recent_analyses', JSON.stringify(history));
    } catch (e) {
      console.warn('Unable to persist history', e);
    }
  }, [history]);

  // Initial atmospheric demo load on mount
  useEffect(() => {
    let mounted = true;
    const runInitialDemo = async () => {
      try {
        const initialWeather = await fetchMockOpenWeatherData(36.7468, -119.7726, 'San Joaquin Agricultural Valley');
        const initialPrediction = await generateGeminiCropDiagnosis('Tomato', initialWeather);
        if (mounted) {
          setCurrentWeather(initialWeather);
          setCurrentPrediction(initialPrediction);
          setLastAnalyzedCrop('Tomato');
        }
      } catch (err) {
        console.error('Initial demo load failed', err);
      }
    };
    runInitialDemo();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAnalyzeCropHealth = async (overrideCoords?: {
    latitude: number;
    longitude: number;
    regionName?: string;
  }) => {
    if (!cropName.trim()) return;

    setIsLoading(true);
    setGeoError(null);

    let targetLat = 36.7468;
    let targetLon = -119.7726;
    let locationLabel: string | undefined = undefined;

    if (overrideCoords) {
      targetLat = overrideCoords.latitude;
      targetLon = overrideCoords.longitude;
      locationLabel = overrideCoords.regionName;
    } else if (selectedRegion) {
      targetLat = selectedRegion.latitude;
      targetLon = selectedRegion.longitude;
      locationLabel = `${selectedRegion.name} (${selectedRegion.region})`;
    } else {
      try {
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser.');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 60000,
          });
        });

        targetLat = position.coords.latitude;
        targetLon = position.coords.longitude;
      } catch (err: any) {
        let msg = 'Browser geolocation access was not granted or timed out.';
        if (err.code === 1) {
          msg = 'Location permission was denied by the browser.';
        } else if (err.code === 2) {
          msg = 'Position unavailable on this network/device.';
        }
        setGeoError(`${msg} Defaulted to San Joaquin Agricultural Valley station.`);
        targetLat = 36.7468;
        targetLon = -119.7726;
        locationLabel = 'San Joaquin Agricultural Valley (Default Station)';
      }
    }

    try {
      const weatherData = await fetchMockOpenWeatherData(targetLat, targetLon, locationLabel);
      const prediction = await generateGeminiCropDiagnosis(cropName.trim(), weatherData);

      setCurrentWeather(weatherData);
      setCurrentPrediction(prediction);
      setLastAnalyzedCrop(cropName.trim());

      const newRecord: AnalysisRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cropName: cropName.trim(),
        weather: weatherData,
        prediction,
      };

      setHistory((prev) => [newRecord, ...prev.filter((r) => r.cropName !== newRecord.cropName)].slice(0, 6));

      setTimeout(() => {
        weatherResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Weather analysis failed:', err);
      setGeoError('An error occurred during atmospheric analysis. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrelateWeatherFromVision = (crop: string) => {
    setCropName(crop);
    setActiveTab('weather');
    handleAnalyzeCropHealth();
  };

  const handleSimulateWeather = async (temp: number, humidity: number) => {
    if (!currentWeather) return;
    setIsLoading(true);

    try {
      const simulatedWeather: WeatherData = {
        ...currentWeather,
        temperature: temp,
        humidity,
        timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Simulated)`,
        condition: humidity > 80 ? 'Simulated Saturated Atmospheric Moisture' : 'Simulated Thermal Shift',
      };

      const simPrediction = await generateGeminiCropDiagnosis(cropName.trim() || 'Tomato', simulatedWeather);

      setCurrentWeather(simulatedWeather);
      setCurrentPrediction(simPrediction);
      setLastAnalyzedCrop(cropName.trim() || 'Tomato');

      setTimeout(() => {
        weatherResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryRecord = (record: AnalysisRecord) => {
    setCropName(record.cropName);
    setCurrentWeather(record.weather);
    setCurrentPrediction(record.prediction);
    setLastAnalyzedCrop(record.cropName);
    setActiveTab('weather');
    weatherResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('agrimind_recent_analyses');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Prominent South Indian Regional Language Bar */}
      <SouthIndianLanguageBar />

      {/* Top-Left Slide-over Menu Drawer */}
      <LeftSidebarDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => {
          setSelectedRegion(reg);
          handleAnalyzeCropHealth({
            latitude: reg.latitude,
            longitude: reg.longitude,
            regionName: `${reg.name} (${reg.region})`,
          });
        }}
        onOpenStationManager={(tab) => {
          setStationModalTab(tab || 'select');
          setIsStationModalOpen(true);
        }}
        recentCount={history.length}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Primary Functional Mode Segmented Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2.5 rounded-xl border border-neutral-200/90 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>{t.scannerTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'weather'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <CloudSun className="w-4 h-4 text-emerald-300" />
              <span>{t.weatherTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('harvest')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'harvest'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-emerald-300" />
              <span>{t.harvestTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-300" />
              <span>{t.simulatorTab}</span>
            </button>
          </div>

          <div className="text-xs text-neutral-500 font-mono hidden lg:flex items-center gap-2">
            <span>AgriMind AI</span>
            <span>·</span>
            <span className="text-emerald-800 font-semibold">South Asia Agri-Intelligence</span>
          </div>
        </div>

        {/* TAB 1: AI PHOTO / LIVE CAPTURE SCANNER */}
        {activeTab === 'scanner' && (
          <section aria-label="AI Leaf Vision Scanner">
            <AiLeafScanner
              onCorrelateWeather={handleCorrelateWeatherFromVision}
              onNavigateToHarvest={(crop) => {
                setActiveTab('harvest');
              }}
              currentWeather={currentWeather}
            />
          </section>
        )}

        {/* TAB 2: WEATHER & MICROCLIMATE DISEASE PREDICTOR */}
        {activeTab === 'weather' && (
          <div className="space-y-8">
            <section aria-label="Crop Input and Weather Settings">
              <CropInputCard
                cropName={cropName}
                setCropName={setCropName}
                onAnalyze={handleAnalyzeCropHealth}
                isLoading={isLoading}
                geoError={geoError}
                setGeoError={setGeoError}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                onOpenStationManager={(tab) => {
                  setStationModalTab(tab || 'select');
                  setIsStationModalOpen(true);
                }}
                onDirectGpsAcquired={(coords) => {
                  handleAnalyzeCropHealth({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    regionName: `Direct Field GPS (${coords.latitude.toFixed(3)}°N, ${coords.longitude.toFixed(3)}°E)`,
                  });
                }}
              />
            </section>

            {isLoading && (
              <section aria-label="Analysis in progress">
                <LoadingAnalysisState cropName={cropName} />
              </section>
            )}

            {!isLoading && currentWeather && currentPrediction && (
              <section ref={weatherResultsRef} id="results-dashboard" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                      {currentPrediction.cropName}: {t.aiDiagnosisTitle}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                      <span>{t.diagnosedCrop} <strong>{currentPrediction.cropName}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>OpenWeatherMap · Google Gemini</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      {t.printSavePdfBtn}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 h-full">
                    <EnvironmentalConditionsCard
                      weather={currentWeather}
                      cropName={currentPrediction.cropName}
                    />
                  </div>

                  <div className="lg:col-span-7 h-full">
                    <AiDiagnosisCard
                      prediction={currentPrediction}
                      weather={currentWeather}
                    />
                  </div>
                </div>
              </section>
            )}

            <section aria-label="Analysis History">
              <RecentAnalyses
                records={history}
                onSelectRecord={handleSelectHistoryRecord}
                onClearHistory={handleClearHistory}
              />
            </section>
          </div>
        )}

        {/* TAB 3: HARVEST TIMING & READINESS ADVISOR */}
        {activeTab === 'harvest' && (
          <section aria-label="Harvest Timing and Readiness Advisor">
            <HarvestAdvisor 
              currentWeather={currentWeather}
              onNavigateToScanner={() => setActiveTab('scanner')}
            />
          </section>
        )}

        {/* TAB 4: WHAT-IF WEATHER SIMULATOR */}
        {activeTab === 'simulator' && (
          <section aria-label="What-If Weather Simulator" className="space-y-6">
            <WhatIfSimulator
              currentWeather={currentWeather}
              cropName={lastAnalyzedCrop || cropName}
              onSimulate={handleSimulateWeather}
              isLoading={isLoading}
            />

            {!isLoading && currentWeather && currentPrediction && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
                <div className="lg:col-span-5 h-full">
                  <EnvironmentalConditionsCard
                    weather={currentWeather}
                    cropName={currentPrediction.cropName}
                  />
                </div>
                <div className="lg:col-span-7 h-full">
                  <AiDiagnosisCard
                    prediction={currentPrediction}
                    weather={currentWeather}
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Quick Cross-Navigation Banner */}
        {activeTab === 'weather' && (
          <div className="p-4 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">{t.visionScannerTitle}</div>
                <div className="text-xs text-neutral-500">{t.visionScannerSubtitle}</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>{t.scannerTab}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Disease Library Modal */}
      <DiseaseLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectCrop={(selected) => {
          setCropName(selected);
          setActiveTab('weather');
          handleAnalyzeCropHealth();
        }}
      />

      {/* Agriculture Station Manager Modal */}
      <StationManagerModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        selectedStation={selectedRegion}
        initialTab={stationModalTab}
        onSelectStation={(station) => {
          setSelectedRegion(station);
          if (station) {
            handleAnalyzeCropHealth({
              latitude: station.latitude,
              longitude: station.longitude,
              regionName: `${station.name} (${station.region})`,
            });
          }
        }}
        onSelectDirectGps={(coords) => {
          const gpsStation: LocationPreset = {
            id: `direct-gps-${Date.now()}`,
            name: `Direct Field GPS (${coords.latitude.toFixed(3)}°, ${coords.longitude.toFixed(3)}°)`,
            region: `Device Live Coordinates (±${coords.accuracy || 10}m accuracy)`,
            latitude: coords.latitude,
            longitude: coords.longitude,
            description: `Real-time browser satellite lock acquired with ±${coords.accuracy || 10}m radius accuracy.`,
            stationType: 'Direct Farm GPS',
            isCustom: true,
          };
          setSelectedRegion(gpsStation);
          handleAnalyzeCropHealth({
            latitude: coords.latitude,
            longitude: coords.longitude,
            regionName: `Direct Field GPS (${coords.latitude.toFixed(3)}°N, ${coords.longitude.toFixed(3)}°E)`,
          });
        }}
      />

      {/* Clean Footer */}
      <footer className="border-t border-neutral-200 bg-white mt-12 py-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-neutral-700">
            <span>AgriMind AI</span>
            <span>·</span>
            <span>{t.appSubtitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-neutral-400">
            <span>తెలుగు</span>
            <span>·</span>
            <span>தமிழ்</span>
            <span>·</span>
            <span>ಕನ್ನಡ</span>
            <span>·</span>
            <span>മലയാളം</span>
            <span>·</span>
            <span>English</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
