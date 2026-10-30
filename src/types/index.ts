export interface WeatherData {
  latitude: number;
  longitude: number;
  locationName: string;
  temperature: number; // in °C
  humidity: number; // in %
  condition: string;
  dewPoint: number; // in °C
  windSpeed: number; // in km/h
  precipitationChance: number; // in %
  uvIndex: number;
  timestamp: string;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface DiseaseInfo {
  name: string;
  scientificName: string;
  threatType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Physiological';
  riskScore: number; // 0 - 100
  typicalSymptoms: string;
  weatherTrigger: string;
}

export interface DiseasePrediction {
  cropName: string;
  overallRisk: RiskLevel;
  primaryDiseases: DiseaseInfo[];
  paragraph1_PathologySummary: string;
  paragraph2_EnvironmentalTriggers: string;
  paragraph3_ActionablePrecautions: string;
  bulletPrecautions: string[];
  immediateIntervention: string;
  recommendedFungicideOrTreatment: string;
  irrigationGuidance: string;
  confidenceScore: number;
}

export interface AnalysisRecord {
  id: string;
  timestamp: string;
  cropName: string;
  weather: WeatherData;
  prediction: DiseasePrediction;
}

export interface VisionBoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
}

export interface HarvestReadinessAnalysis {
  isReady: boolean;
  readinessScore: number; // 0 - 100
  maturityStage: string; // e.g. "Optimal Harvest Stage (Peak Commercial Ripe)", "Breaker / Turning", "Immature Vegetative", "Over-mature"
  estimatedHarvestWindow: string; // e.g. "Ready to harvest today / next 24-48 hours", "Wait 3-5 days for color break"
  bestTimeOfDay: string; // e.g. "06:30 AM - 09:30 AM (after morning dew dries)"
  visualSignsObserved: string[];
  harvestTechnique: string;
  postHarvestCare: string;
}

export interface VisionDiagnosis {
  cropName: string;
  isPlant: boolean;
  isHealthy: boolean;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: string;
  threatType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Nutrient Deficiency' | 'Healthy';
  symptoms: string;
  causes: string;
  organicTreatment: string;
  chemicalTreatment: string;
  preventativeSteps: string[];
  box?: VisionBoundingBox;
  imagePreviewUrl: string;
  analyzedAt: string;
  engineUsed?: string;
  harvestReadiness?: HarvestReadinessAnalysis;
}
