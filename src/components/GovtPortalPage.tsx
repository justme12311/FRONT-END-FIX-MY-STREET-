import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Calendar,
  Clock,
  HardHat,
  Search,
  Check,
  ChevronRight,
} from 'lucide-react';
import { CivicReport, ReportStatus } from '../types/civic';

interface GovtPortalPageProps {
  reports: CivicReport[];
  onUpdateStatus: (reportId: string, newStatus: ReportStatus, note?: string) => void;
  onSelectReport: (report: CivicReport) => void;
  onBack: () => void;
}

const EXACT_STATUS_ORDER: ReportStatus[] = [
  'REPORTED',
  'VERIFIED',
  'ASSIGNED',
  'INVESTIGATING',
  'SCHEDULED',
  'RESOLVED',
];

export const GovtPortalPage: React.FC<GovtPortalPageProps> = ({
  reports,
  onUpdateStatus,
  onSelectReport,
  onBack,
}) => {
  const [selectedId, setSelectedId] = useState<string>(reports[0]?.report_id || 'CF-1042');
  const [statusNote, setStatusNote] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeReport = reports.find((r) => r.report_id === selectedId) || reports[0];

  const handleAdvanceStatus = (targetStatus: ReportStatus) => {
    if (!activeReport) return;
    onUpdateStatus(
      activeReport.report_id,
      targetStatus,
      statusNote.trim() || `Status updated to ${targetStatus} by Municipal Ops Desk.`
    );
    setStatusNote('');
    setSuccessToast(`Report ${activeReport.report_id} moved to ${targetStatus}!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-4">
      {/* Header */}
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
          <span className="text-[11px] font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
            Municipal Oversight
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-sans tracking-tight">
            Gov't Portal & Agency Dispatch
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Internal console for updating report lifecycle statuses across the 6 official milestones.
          </p>
        </div>

        {/* Ticket Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-neutral-500 shrink-0">Select Ticket:</span>
          {reports.map((r) => (
            <button
              key={r.report_id}
              type="button"
              onClick={() => setSelectedId(r.report_id)}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all border ${
                activeReport?.report_id === r.report_id
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
              }`}
            >
              {r.report_id} ({r.status})
            </button>
          ))}
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {activeReport && (
        <div className="bg-white border-2 border-neutral-900 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="text-xs font-mono font-bold text-neutral-500">
                Department: {activeReport.department}
              </span>
              <h2 className="text-lg font-bold text-neutral-950 mt-0.5">
                {activeReport.report_id}: {activeReport.category}
              </h2>
              <span className="text-xs text-neutral-600 block">{activeReport.address}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">
                Current Status
              </span>
              <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-full bg-neutral-900 text-white inline-block mt-0.5">
                {activeReport.status}
              </span>
            </div>
          </div>

          {/* Quick Note input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1">
              Dispatch Note / Inspection Update:
            </label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Field crew inspected crack; repair team scheduled for tomorrow morning"
              className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-neutral-900 outline-none"
            />
          </div>

          {/* Transition Buttons across the 6 exact statuses */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
              Update Report Status:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXACT_STATUS_ORDER.map((status) => {
                const isCurrent = activeReport.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleAdvanceStatus(status)}
                    disabled={isCurrent}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between min-h-[44px] ${
                      isCurrent
                        ? 'bg-neutral-900 text-white border-neutral-900 cursor-default opacity-90'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    <span>{status}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">
              Status changes immediately reflect on the Citizen Tracking Page.
            </span>
            <button
              type="button"
              onClick={() => onSelectReport(activeReport)}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-xs font-bold transition-colors"
            >
              View Citizen Timeline →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
