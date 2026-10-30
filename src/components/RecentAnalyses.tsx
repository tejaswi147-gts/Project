import React from 'react';
import { History, Trash2, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { AnalysisRecord } from '../types';

interface RecentAnalysesProps {
  records: AnalysisRecord[];
  onSelectRecord: (record: AnalysisRecord) => void;
  onClearHistory: () => void;
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({
  records,
  onSelectRecord,
  onClearHistory,
}) => {
  if (records.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-neutral-900">Recent Field Analyses</h3>
          <span className="text-xs text-neutral-400 font-mono">({records.length})</span>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-neutral-400 hover:text-neutral-700 inline-flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {records.map((rec) => (
          <div
            key={rec.id}
            onClick={() => onSelectRecord(rec)}
            className="p-3 rounded-lg border border-neutral-200 hover:border-emerald-600/50 hover:bg-emerald-50/20 cursor-pointer transition-all text-xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 text-sm group-hover:text-emerald-800">
                {rec.cropName}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                rec.prediction.overallRisk === 'High' || rec.prediction.overallRisk === 'Severe'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                {rec.prediction.overallRisk}
              </span>
            </div>

            <div className="flex items-center gap-2 text-neutral-500 font-mono tabular-nums text-[11px]">
              <span>{rec.weather.temperature}°C</span>
              <span>·</span>
              <span>{rec.weather.humidity}% RH</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                {rec.timestamp}
              </span>
            </div>

            <div className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="truncate">{rec.weather.locationName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
