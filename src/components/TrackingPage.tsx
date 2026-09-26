import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  AlertTriangle,
  Accessibility,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CivicReport, ReportStatus, StatusHistoryItem } from '../types/civic';

interface TrackingPageProps {
  reports: CivicReport[];
  selectedReportId?: string;
  onBack: () => void;
  onSelectReport: (report: CivicReport) => void;
}

const EXACT_STATUS_ORDER: ReportStatus[] = [
  'REPORTED',
  'VERIFIED',
  'ASSIGNED',
  'INVESTIGATING',
  'SCHEDULED',
  'RESOLVED',
];

export const TrackingPage: React.FC<TrackingPageProps> = ({
  reports,
  selectedReportId,
  onBack,
  onSelectReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const activeReport =
    reports.find((r) => r.report_id === (selectedReportId || 'CF-1042')) || reports[0];

  const filteredReports = reports.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.report_id.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    );
  });

  const getStatusStepState = (report: CivicReport, status: ReportStatus) => {
    const currentIdx = EXACT_STATUS_ORDER.indexOf(report.status);
    const stepIdx = EXACT_STATUS_ORDER.indexOf(status);

    const historyItem = report.status_history.find((h) => h.status === status);

    if (stepIdx < currentIdx) {
      return {
        state: 'completed',
        timestamp: historyItem?.timestamp || 'Completed',
        notes: historyItem?.notes || 'Phase finalized',
      };
    } else if (stepIdx === currentIdx) {
      return {
        state: 'active',
        timestamp: historyItem?.timestamp || 'In Progress',
        notes: historyItem?.notes || 'Currently active phase',
      };
    } else {
      return {
        state: 'pending',
        timestamp: 'Pending',
        notes: historyItem?.notes || 'Scheduled following previous stage',
      };
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-5">
      {/* Top Header & Search */}
      <div className="bg-white border-2 border-neutral-900 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-neutral-950 min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs font-mono font-bold text-neutral-500">
            CivicFix Tracking Engine
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight font-sans">
            Report Status & Timeline Tracker
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Official municipal tracking page showing the 6-stage lifecycle of street infrastructure reports.
          </p>
        </div>

        {/* Search Bar for Report ID */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Report ID (e.g. CF-1042) or street name..."
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none"
          />
        </div>

        {/* Quick Report Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-neutral-500 shrink-0">Tickets:</span>
          {reports.map((r) => (
            <button
              key={r.report_id}
              type="button"
              onClick={() => onSelectReport(r)}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-colors border ${
                activeReport?.report_id === r.report_id
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
              }`}
            >
              {r.report_id}
            </button>
          ))}
        </div>
      </div>

      {activeReport ? (
        <div className="space-y-5">
          {/* SECTION 5: REPORT INFORMATION */}
          <div className="bg-white border-2 border-neutral-900 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                  Report Information
                </span>
                <h2 className="text-xl font-mono font-extrabold text-neutral-950">
                  {activeReport.report_id}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border bg-neutral-900 text-white">
                  {activeReport.status}
                </span>
              </div>
            </div>

            {/* Display required exact fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">category</span>
                <span className="font-bold text-neutral-900">{activeReport.category}</span>
              </div>

              <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">severity</span>
                <span className="font-mono font-bold text-neutral-900">{activeReport.severity}</span>
              </div>

              <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-neutral-500 block">department</span>
                <span className="font-bold text-neutral-900 truncate block">
                  {activeReport.department}
                </span>
              </div>

              <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">created_at</span>
                <span className="font-mono text-neutral-800">{activeReport.created_at}</span>
              </div>

              <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">latitude</span>
                <span className="font-mono text-neutral-800">{activeReport.latitude.toFixed(4)}</span>
              </div>

              <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">longitude</span>
                <span className="font-mono text-neutral-800">{activeReport.longitude.toFixed(4)}</span>
              </div>
            </div>

            {/* Photo & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              {activeReport.photo && (
                <div className="sm:col-span-5 h-36 rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100">
                  <img
                    src={activeReport.photo}
                    alt={activeReport.category}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="sm:col-span-7 space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-500 block">
                    Street Location:
                  </span>
                  <span className="font-bold text-neutral-900 block">{activeReport.address}</span>
                  <span className="text-neutral-500">{activeReport.neighborhood}</span>
                </div>

                {activeReport.description && (
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 block">
                      description:
                    </span>
                    <p className="text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 italic">
                      "{activeReport.description}"
                    </p>
                  </div>
                )}

                {activeReport.is_disability_hazard && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] flex items-center gap-1.5 font-bold">
                    <Accessibility className="w-3.5 h-3.5 text-blue-700" />
                    <span>Flagged as Disability & Mobility Barrier</span>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4: SIMPLE TIMELINE WITH EXACT STATUSES */}
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-700" />
                <span>status_history (Simple Lifecycle Timeline)</span>
              </h3>

              <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-300">
                {EXACT_STATUS_ORDER.map((statusName) => {
                  const stepInfo = getStatusStepState(activeReport, statusName);

                  return (
                    <div key={statusName} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          stepInfo.state === 'completed'
                            ? 'bg-neutral-950 border-neutral-950 text-white'
                            : stepInfo.state === 'active'
                            ? 'bg-amber-500 border-amber-600 text-white ring-4 ring-amber-100 animate-pulse'
                            : 'bg-white border-neutral-300 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>

                      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono font-bold ${
                              stepInfo.state === 'active'
                                ? 'text-amber-800'
                                : stepInfo.state === 'completed'
                                ? 'text-neutral-950'
                                : 'text-neutral-500'
                            }`}
                          >
                            {statusName}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-500">
                            {stepInfo.timestamp}
                          </span>
                        </div>

                        {stepInfo.notes && (
                          <p className="text-[11px] text-neutral-600 mt-1">{stepInfo.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white border-2 border-neutral-900 rounded-3xl text-center text-xs text-neutral-600">
          No report selected. Use the search bar above to look up by Report ID.
        </div>
      )}
    </div>
  );
};
