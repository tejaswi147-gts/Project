import { WeatherData } from '../types';

export interface LocationPreset {
  id?: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  stationType?: 'IoT Micro-Weather' | 'KVK Agromet Node' | 'Govt AWS Telemetry' | 'Farm Field Observer' | 'Direct Farm GPS' | string;
  isCustom?: boolean;
  primaryCrops?: string[];
  elevationMeters?: number;
  createdAt?: string;
}

export const FARMING_REGIONS: LocationPreset[] = [
  {
    id: 'guntur-agromet',
    name: 'Guntur Agromet Research Station',
    region: 'Andhra Pradesh, India',
    latitude: 16.3067,
    longitude: 80.4365,
    description: 'Black cotton soil agro-climate, major hub for chilli, cotton, and tobacco pathology',
    stationType: 'KVK Agromet Node',
    primaryCrops: ['Chilli', 'Cotton', 'Tobacco', 'Paddy'],
    elevationMeters: 33,
  },
  {
    id: 'thanjavur-cauvery',
    name: 'Thanjavur Cauvery Delta Station',
    region: 'Tamil Nadu, India',
    latitude: 10.7870,
    longitude: 79.1378,
    description: 'Cauvery alluvial rice bowl with high foliar humidity and blast disease pressure',
    stationType: 'Govt AWS Telemetry',
    primaryCrops: ['Rice', 'Banana', 'Sugarcane', 'Coconut'],
    elevationMeters: 59,
  },
  {
    id: 'mandya-telemetry',
    name: 'Mandya Agro-Telemetry Center',
    region: 'Karnataka, India',
    latitude: 12.5218,
    longitude: 76.8951,
    description: 'Irrigated Cauvery canal basin specializing in sugarcane, paddy, and ragi',
    stationType: 'IoT Micro-Weather',
    primaryCrops: ['Sugarcane', 'Rice', 'Ragi', 'Mulberry'],
    elevationMeters: 678,
  },
  {
    id: 'wayanad-hills',
    name: 'Wayanad Spice Hill Station',
    region: 'Kerala, India',
    latitude: 11.6854,
    longitude: 76.1320,
    description: 'Highland tropical rainforest microclimate with persistent mist and phytophthora risks',
    stationType: 'IoT Micro-Weather',
    primaryCrops: ['Pepper', 'Coffee', 'Tea', 'Cardamom', 'Banana'],
    elevationMeters: 920,
  },
  {
    id: 'warangal-agri',
    name: 'Warangal Cotton & Maize Agro Station',
    region: 'Telangana, India',
    latitude: 17.9689,
    longitude: 79.5941,
    description: 'Semi-arid Deccan plateau with intense summer heat and red-chalka soils',
    stationType: 'KVK Agromet Node',
    primaryCrops: ['Cotton', 'Chilli', 'Corn', 'Rice'],
    elevationMeters: 266,
  },
  {
    id: 'nashik-horticulture',
    name: 'Nashik Horticulture Basin Station',
    region: 'Maharashtra, India',
    latitude: 19.9975,
    longitude: 73.7898,
    description: 'Premier grape, onion, and tomato belt with powdery and downy mildew surveillance',
    stationType: 'IoT Micro-Weather',
    primaryCrops: ['Grapes', 'Onion', 'Tomato', 'Pomegranate'],
    elevationMeters: 560,
  },
  {
    id: 'punjab-alluvial',
    name: 'Punjab Fertile Alluvial Belt',
    region: 'Northern Plains, India',
    latitude: 31.1471,
    longitude: 75.3412,
    description: 'Intensive canal and tube-well wheat, rice, and cotton agricultural basin',
    stationType: 'Govt AWS Telemetry',
    primaryCrops: ['Wheat', 'Rice', 'Cotton', 'Potato'],
    elevationMeters: 232,
  },
  {
    id: 'san-joaquin-valley',
    name: 'San Joaquin Agricultural Valley',
    region: 'California, US',
    latitude: 36.7468,
    longitude: -119.7726,
    description: 'Irrigated fertile valley basin, warm-dry Mediterranean climate with high evapotranspiration',
    stationType: 'Govt AWS Telemetry',
    primaryCrops: ['Tomato', 'Grapes', 'Almonds', 'Citrus'],
    elevationMeters: 88,
  },
  {
    id: 'corn-belt-plains',
    name: 'Corn Belt Agricultural Plains',
    region: 'Iowa / Illinois, US',
    latitude: 41.8781,
    longitude: -93.0977,
    description: 'Temperate loam soils, high moisture retention basin for large-scale grain pathology',
    stationType: 'IoT Micro-Weather',
    primaryCrops: ['Corn', 'Soybean'],
    elevationMeters: 290,
  },
  {
    id: 'mekong-delta',
    name: 'Mekong Delta Rice Terrace Zone',
    region: 'Can Tho, Vietnam',
    latitude: 10.0452,
    longitude: 105.7469,
    description: 'Subtropical wet lowland ideal for wetland grain pathology and sheath blight dynamics',
    stationType: 'Farm Field Observer',
    primaryCrops: ['Rice', 'Mango', 'Dragon Fruit'],
    elevationMeters: 3,
  },
];

const CUSTOM_STATIONS_STORAGE_KEY = 'agrimind_custom_stations';

/**
 * Retrieves user-defined custom agriculture stations from localStorage
 */
export function getSavedCustomStations(): LocationPreset[] {
  try {
    const raw = localStorage.getItem(CUSTOM_STATIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse custom agriculture stations from storage', err);
    return [];
  }
}

/**
 * Saves a new or updated custom agriculture station
 */
export function saveCustomStation(newStation: LocationPreset): LocationPreset[] {
  try {
    const existing = getSavedCustomStations();
    const stationId = newStation.id || `custom-station-${Date.now()}`;
    const stationToSave: LocationPreset = {
      ...newStation,
      id: stationId,
      isCustom: true,
      createdAt: newStation.createdAt || new Date().toISOString(),
      stationType: newStation.stationType || 'IoT Micro-Weather',
    };

    const updated = [stationToSave, ...existing.filter((s) => s.id !== stationId && s.name !== newStation.name)];
    localStorage.setItem(CUSTOM_STATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save custom station', err);
    return [];
  }
}

/**
 * Deletes a custom agriculture station by id or name
 */
export function deleteCustomStation(stationIdOrName: string): LocationPreset[] {
  try {
    const existing = getSavedCustomStations();
    const updated = existing.filter((s) => s.id !== stationIdOrName && s.name !== stationIdOrName);
    localStorage.setItem(CUSTOM_STATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete custom station', err);
    return [];
  }
}

/**
 * Returns all active agriculture stations (defaults + custom-added)
 */
export function getAllAgricultureStations(): LocationPreset[] {
  const custom = getSavedCustomStations();
  return [...custom, ...FARMING_REGIONS];
}

/**
 * Mock integration for OpenWeatherMap API.
 * Takes user coordinates (lat, lon) and simulates realistic weather data
 * with temperature in °C and humidity in %, dew point, and condition.
 */
export async function fetchMockOpenWeatherData(
  latitude: number,
  longitude: number,
  customLocationName?: string
): Promise<WeatherData> {
  // Simulate network roundtrip latency to OpenWeatherMap API (650ms)
  await new Promise((resolve) => setTimeout(resolve, 650));

  // Determine realistic climatic variance based on latitude
  const absLat = Math.abs(latitude);
  let baseTemp = 24.5;
  let baseHumidity = 68;
  let condition = 'Partly Cloudy';

  if (absLat < 15) {
    // Equatorial / Tropical: warm and humid
    baseTemp = 28.5 + (Math.sin(latitude * 10) * 3);
    baseHumidity = 78 + (Math.cos(longitude * 10) * 12);
    condition = baseHumidity > 82 ? 'Humid Mist with Afternoon Showers' : 'Tropical Warm & Humid';
  } else if (absLat < 35) {
    // Subtropical / Temperate-warm: variable
    baseTemp = 23.0 + (Math.sin(latitude * 5) * 6);
    baseHumidity = 62 + (Math.cos(longitude * 7) * 18);
    condition = baseHumidity > 75 ? 'Overcast with High Canopy Moisture' : 'Clear Sky with Solar Radiance';
  } else {
    // Temperate / Cooler latitudes
    baseTemp = 16.5 + (Math.sin(latitude * 4) * 5);
    baseHumidity = 58 + (Math.cos(longitude * 4) * 20);
    condition = baseHumidity > 70 ? 'Damp Morning Dew & Cloud Cover' : 'Brisk Autumn Sunshine';
  }

  // Constrain bounds to physically realistic values
  const temperature = Math.round(Math.min(42, Math.max(8, baseTemp)) * 10) / 10;
  const humidity = Math.round(Math.min(96, Math.max(25, baseHumidity)));
  
  // Approximate dew point using Magnus formula approximation
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
  const dewPoint = Math.round(((b * alpha) / (a - alpha)) * 10) / 10;

  // Determine realistic rainfall chance from humidity
  const precipitationChance = Math.min(95, Math.max(5, Math.round((humidity - 35) * 1.3)));

  // Simulated wind speed
  const windSpeed = Math.round(7 + Math.abs(Math.sin(longitude)) * 14);

  // Derive location description
  let locationName = customLocationName;
  if (!locationName) {
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';
    locationName = `Field Station (${Math.abs(latitude).toFixed(3)}°${latDir}, ${Math.abs(longitude).toFixed(3)}°${lonDir})`;
  }

  return {
    latitude: Math.round(latitude * 10000) / 10000,
    longitude: Math.round(longitude * 10000) / 10000,
    locationName,
    temperature,
    humidity,
    condition,
    dewPoint,
    windSpeed,
    precipitationChance,
    uvIndex: Math.max(2, Math.min(10, Math.round(11 - (humidity / 14)))),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
