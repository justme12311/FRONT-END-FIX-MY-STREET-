import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Accessibility,
  Eye,
  Calendar,
  Building2,
  Clock,
  Compass,
} from 'lucide-react';
import { CivicReport } from '../types/civic';

interface CivicMapsPageProps {
  reports: CivicReport[];
  disabilityFocus: boolean;
  onToggleDisabilityFocus: () => void;
  onSelectReport: (report: CivicReport) => void;
  onBack: () => void;
}

export const CivicMapsPage: React.FC<CivicMapsPageProps> = ({
  reports,
  disabilityFocus,
  onToggleDisabilityFocus,
  onSelectReport,
  onBack,
}) => {
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(reports[0] || null);

  const displayedReports = reports.filter((r) => {
    if (disabilityFocus && !r.is_disability_hazard) return false;
    return true;
  });

  // Calculate coordinates across 16th corridor
  const minLat = 45.508;
  const maxLat = 45.565;
  const minLng = -122.705;
  const maxLng = -122.645;

  const getPinPosition = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 78 + 11;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 70 + 15;
    return {
      left: `${Math.max(10, Math.min(90, x))}%`,
      top: `${Math.max(15, Math.min(85, y))}%`,
    };
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-4">
      {/* Top Header */}
      <div className="bg-white border-2 border-neutral-900 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-neutral-950 min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={onToggleDisabilityFocus}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              disabilityFocus
                ? 'bg-blue-600 text-white border-blue-800 shadow-xs'
                : 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span>Disability Focus {disabilityFocus ? '(Active)' : ''}</span>
          </button>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-sans tracking-tight">
            Civic Maps & Street Hazards (#16th)
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Geographic view of verified complaints and wheelchair/pedestrian obstacles.
          </p>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative bg-[#1a222d] border-2 border-neutral-900 rounded-3xl overflow-hidden shadow-xl h-[420px] sm:h-[480px]">
        {/* Street Lines & Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#fff" strokeWidth="6" />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#fff" strokeWidth="6" />
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#fff" strokeWidth="6" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#fff" strokeWidth="4" />
          </svg>
        </div>

        {/* Labels on Map */}
        <span className="absolute top-4 left-6 text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
          Sector #16th North
        </span>
        <span className="absolute bottom-4 left-6 text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
          16th Corridor & Oak Street
        </span>
        <span className="absolute bottom-4 right-6 text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
          Sector #16th South
        </span>

        {/* Interactive Pins */}
        {displayedReports.map((r) => {
          const pos = getPinPosition(r.latitude, r.longitude);
          const isSelected = selectedReport?.report_id === r.report_id;

          return (
            <div
              key={r.report_id}
              style={{ left: pos.left, top: pos.top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                type="button"
                onClick={() => setSelectedReport(r)}
                className={`p-2 rounded-full shadow-lg transition-transform hover:scale-125 ${
                  r.is_disability_hazard
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : 'bg-amber-600 text-white'
                } ${isSelected ? 'scale-125 ring-4 ring-white z-30' : ''}`}
                title={`${r.report_id} - ${r.category}`}
              >
                {r.is_disability_hazard ? (
                  <Accessibility className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </button>

              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-neutral-900/90 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap border border-neutral-700 pointer-events-none">
                {r.report_id}
              </span>
            </div>
          );
        })}

        {/* Selected Pin Details Box */}
        {selectedReport && (
          <div className="absolute bottom-4 left-4 right-4 z-30 bg-white border-2 border-neutral-900 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-neutral-950">
                  {selectedReport.report_id}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border">
                  {selectedReport.status}
                </span>
                {selectedReport.is_disability_hazard && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Disability Hazard
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-neutral-900 truncate">
                {selectedReport.category}
              </h4>
              <p className="text-[11px] text-neutral-600 truncate">
                {selectedReport.address} · Lat: {selectedReport.latitude.toFixed(4)}, Lng:{' '}
                {selectedReport.longitude.toFixed(4)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectReport(selectedReport)}
              className="shrink-0 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Track Status →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
