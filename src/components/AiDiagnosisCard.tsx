import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Copy, 
  Check, 
  ShieldCheck, 
  Droplet, 
  Bug
} from 'lucide-react';
import { DiseasePrediction, WeatherData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AiDiagnosisCardProps {
  prediction: DiseasePrediction;
  weather: WeatherData;
}

export const AiDiagnosisCard: React.FC<AiDiagnosisCardProps> = ({ prediction, weather }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const handleToggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopyReport = () => {
    const reportText = `AgriMind AI - Disease Prognosis & Field Action Plan
Target Crop: ${prediction.cropName}
Location: ${weather.locationName}
Weather: ${weather.temperature}°C, ${weather.humidity}% Humidity (${weather.condition})
Overall Pathogen Vulnerability: ${prediction.overallRisk}

1. EPIDEMIOLOGICAL PATHOLOGY SUMMARY:
${prediction.paragraph1_PathologySummary}

2. ENVIRONMENTAL INFECTION MECHANISMS:
${prediction.paragraph2_EnvironmentalTriggers}

3. AGRONOMIC PREVENTATIVE REGIMEN:
${prediction.paragraph3_ActionablePrecautions}

ACTIONABLE PRECAUTIONS:
${prediction.bulletPrecautions.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Immediate Action: ${prediction.immediateIntervention}
Recommended Treatment: ${prediction.recommendedFungicideOrTreatment}
Irrigation Guidance: ${prediction.irrigationGuidance}
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getRiskBadgeStyles = (risk: string) => {
    switch (risk) {
      case 'Severe':
        return 'text-rose-800 bg-rose-50 border-rose-300';
      case 'High':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'Moderate':
        return 'text-yellow-800 bg-yellow-50 border-yellow-300';
      default:
        return 'text-emerald-800 bg-emerald-50 border-emerald-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              {t.aiDiagnosisTitle}
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${getRiskBadgeStyles(prediction.overallRisk)}`}>
              {prediction.overallRisk} {t.threatLevelSuffix}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
            <span>{t.diagnosedCrop} <strong className="text-neutral-800">{prediction.cropName}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Google Gemini Botanical Model</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{prediction.confidenceScore}% {t.modelConfidence}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-md transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-800 font-semibold">{t.reportCopiedBtn}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-600" />
                <span>{t.copyReportBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Immediate Intervention Alert Banner */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-lg p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-950 uppercase tracking-wide text-[11px]">
            {t.immediateFieldProtocol}
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            {prediction.immediateIntervention}
          </p>
        </div>
      </div>

      {/* The 3 Core Gemini AI Paragraphs */}
      <div className="space-y-4 text-neutral-800 text-sm leading-relaxed">
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            {t.sec1Title}
          </div>
          <p className="text-neutral-700 text-justify leading-relaxed">
            {prediction.paragraph1_PathologySummary}
          </p>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            {t.sec2Title}
          </div>
          <p className="text-neutral-700 text-justify leading-relaxed">
            {prediction.paragraph2_EnvironmentalTriggers}
          </p>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            {t.sec3Title}
          </div>
          <p className="text-neutral-700 text-justify leading-relaxed">
            {prediction.paragraph3_ActionablePrecautions}
          </p>
        </div>
      </div>

      {/* Primary Diseases at Risk Table / Cards */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
          {t.identifiedPathogensTitle} {prediction.cropName}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.primaryDiseases.map((disease) => (
            <div
              key={disease.name}
              className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 transition-colors text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-neutral-900 text-sm">{disease.name}</div>
                  <div className="text-[11px] font-mono text-neutral-500 italic">
                    {disease.scientificName}
                  </div>
                </div>
                <span className="font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 shrink-0">
                  {disease.riskScore}% Risk
                </span>
              </div>

              <div className="space-y-1 text-neutral-600 text-[12px] pt-1 border-t border-neutral-200/60">
                <div>
                  <strong className="text-neutral-800">{t.visualSymptoms}</strong> {disease.typicalSymptoms}
                </div>
                <div>
                  <strong className="text-neutral-800">{t.weatherTrigger}</strong> {disease.weatherTrigger}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formatted Actionable Precautions with Interactive Checkmarks */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            {t.fieldChecklistTitle}
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            {Object.values(checkedItems).filter(Boolean).length} / {prediction.bulletPrecautions.length} {t.completedOf}
          </span>
        </div>

        <div className="space-y-2">
          {prediction.bulletPrecautions.map((precaution, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => handleToggleCheck(idx)}
                className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer select-none transition-all ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 text-neutral-500 line-through'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800 shadow-2xs'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleCheck(idx)}
                  className="mt-0.5 rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                />
                <div className="flex-1 leading-relaxed">
                  {precaution}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agronomic Technical Reference Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.recommendedTreatmentsTitle}</span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            {prediction.recommendedFungicideOrTreatment}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 uppercase tracking-wide">
            <Droplet className="w-4 h-4 text-blue-700" />
            <span>{t.irrigationTimingTitle}</span>
          </div>
          <p className="text-xs text-blue-900 leading-relaxed">
            {prediction.irrigationGuidance}
          </p>
        </div>
      </div>
    </div>
  );
};
