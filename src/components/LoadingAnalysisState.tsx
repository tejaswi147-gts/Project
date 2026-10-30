import React from 'react';
import { CloudSun, Cpu, MapPin, Sparkles } from 'lucide-react';

interface LoadingAnalysisStateProps {
  cropName: string;
}

export const LoadingAnalysisState: React.FC<LoadingAnalysisStateProps> = ({ cropName }) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-8 animate-pulse">
      {/* Header loading bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-neutral-200 rounded"></div>
          <div className="h-4 w-96 max-w-full bg-neutral-100 rounded"></div>
        </div>
        <div className="h-8 w-32 bg-emerald-100 rounded-md"></div>
      </div>

      {/* Progress sequence indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MapPin className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-800">Field Geolocation</div>
            <div className="text-[11px] text-neutral-500">Acquiring GPS coordinates...</div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CloudSun className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-800">OpenWeatherMap API</div>
            <div className="text-[11px] text-neutral-500">Retrieving temp &amp; humidity...</div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-800">Google Gemini AI</div>
            <div className="text-[11px] text-neutral-500">Synthesizing {cropName || 'crop'} pathology...</div>
          </div>
        </div>
      </div>

      {/* 2 Skeletons simulating the 2 result cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Environmental conditions skeleton */}
        <div className="lg:col-span-5 p-6 rounded-lg border border-neutral-200 bg-neutral-50 space-y-4">
          <div className="h-5 w-48 bg-neutral-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white rounded border border-neutral-200 space-y-2">
              <div className="h-4 w-20 bg-neutral-100 rounded"></div>
              <div className="h-8 w-16 bg-neutral-200 rounded"></div>
            </div>
            <div className="p-4 bg-white rounded border border-neutral-200 space-y-2">
              <div className="h-4 w-20 bg-neutral-100 rounded"></div>
              <div className="h-8 w-16 bg-neutral-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-neutral-200 rounded"></div>
            <div className="h-3 w-3/4 bg-neutral-200 rounded"></div>
          </div>
        </div>

        {/* AI Diagnosis skeleton */}
        <div className="lg:col-span-7 p-6 rounded-lg border border-neutral-200 bg-neutral-50 space-y-4">
          <div className="h-5 w-56 bg-neutral-200 rounded"></div>
          <div className="space-y-2.5">
            <div className="h-3.5 w-full bg-neutral-200 rounded"></div>
            <div className="h-3.5 w-11/12 bg-neutral-200 rounded"></div>
            <div className="h-3.5 w-4/5 bg-neutral-200 rounded"></div>
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-3.5 w-full bg-neutral-200 rounded"></div>
            <div className="h-3.5 w-5/6 bg-neutral-200 rounded"></div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 w-32 bg-neutral-300 rounded"></div>
            <div className="h-3 w-4/5 bg-neutral-200 rounded"></div>
            <div className="h-3 w-3/4 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
