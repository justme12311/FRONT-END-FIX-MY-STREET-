import React from 'react';
import {
  FileText,
  MapPin,
  Building2,
  Accessibility,
  Plus,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { CivicReport } from '../types/civic';

interface HomeViewProps {
  reports: CivicReport[];
  disabilityFocus: boolean;
  onToggleDisabilityFocus: () => void;
  onNavigate: (tab: 'home' | 'report' | 'tracker' | 'map' | 'govt') => void;
  onOpenQR: () => void;
  onSelectReport: (report: CivicReport) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  reports,
  disabilityFocus,
  onToggleDisabilityFocus,
  onNavigate,
  onOpenQR,
  onSelectReport,
}) => {
  const totalSubmitted = reports.length;
  const verifiedCount = reports.filter((r) => r.status !== 'REPORTED').length;
  const scheduledCount = reports.filter((r) => r.status === 'SCHEDULED').length;
  const inProgressCount = reports.filter(
    (r) => r.status === 'INVESTIGATING' || r.status === 'ASSIGNED'
  ).length;
  const disabilityHazardCount = reports.filter((r) => r.is_disability_hazard).length;

  return (
    <div className="max-w-md mx-auto w-full">
      {/* Phone Mockup Container matching the user's sketch */}
      <div className="bg-white border-2 border-neutral-900 rounded-[38px] p-6 shadow-2xl relative overflow-hidden transition-all">
        {/* Top Speaker / Sensor Notch Bar */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-1.5 bg-neutral-300 rounded-full" />
        </div>

        {/* QR Code Quick Notice Banner from physical sticker (Requirement #6) */}
        <button
          type="button"
          onClick={onOpenQR}
          className="w-full mb-4 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-[11px] text-amber-900 font-medium flex items-center justify-between transition-colors shadow-2xs"
          title="Physical QR code entry for street signs"
        >
          <span className="flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
            <span>Physical QR Code on Pole #16th Available</span>
          </span>
          <span className="underline font-semibold">Simulate Scan →</span>
        </button>

        {/* Main Title matching sketch: "Fix my STREET #16th" */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest bg-neutral-900 text-white px-2 py-0.5 rounded">
              CivicFix
            </span>
            <span className="text-[10px] font-mono text-neutral-500 font-semibold">
              Citizen Reporting System
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mt-1.5 font-sans leading-tight">
            Fix my STREET <span className="text-red-600 font-mono">#16th</span>
          </h1>

          <p className="text-xs text-neutral-600 mt-1 leading-snug max-w-xs mx-auto">
            Allows residents to quickly report infrastructure problems directly to municipal crews.
          </p>
        </div>

        {/* 3 Capsule Action Buttons matching the sketch */}
        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => onNavigate('tracker')}
            className="w-full min-h-[46px] px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold rounded-2xl border-2 border-neutral-900 text-sm tracking-wide transition-all shadow-xs flex items-center justify-between group active:scale-[0.99]"
          >
            <span>Public Tracker</span>
            <span className="text-xs font-mono bg-white px-2 py-0.5 rounded-full border border-neutral-300 text-neutral-700 group-hover:border-neutral-900">
              {totalSubmitted} tickets
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="w-full min-h-[46px] px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold rounded-2xl border-2 border-neutral-900 text-sm tracking-wide transition-all shadow-xs flex items-center justify-between group active:scale-[0.99]"
          >
            <span>Civic Maps & Hazards</span>
            <span className="text-xs font-mono bg-white px-2 py-0.5 rounded-full border border-neutral-300 text-neutral-700 group-hover:border-neutral-900">
              Interactive Grid
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('govt')}
            className="w-full min-h-[46px] px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold rounded-2xl border-2 border-neutral-900 text-sm tracking-wide transition-all shadow-xs flex items-center justify-between group active:scale-[0.99]"
          >
            <span>Gov't Portal</span>
            <span className="text-xs font-mono bg-white px-2 py-0.5 rounded-full border border-neutral-300 text-neutral-700 group-hover:border-neutral-900">
              Agency Status
            </span>
          </button>
        </div>

        {/* Lower Row matching sketch:
            Left: Disability Focus button
            Center: Record ledger list
            Right: Big prominent "+" button with "file a complaint"
        */}
        <div className="pt-4 border-t-2 border-dashed border-neutral-300 relative">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Disability Focus Button */}
            <div className="flex flex-col items-center shrink-0">
              <button
                type="button"
                onClick={onToggleDisabilityFocus}
                aria-pressed={disabilityFocus}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all shadow-md active:scale-95 ${
                  disabilityFocus
                    ? 'bg-blue-600 border-blue-800 text-white ring-2 ring-blue-300 scale-105'
                    : 'bg-neutral-100 border-neutral-900 text-neutral-900 hover:bg-neutral-200'
                }`}
                title="Toggle Disability Focus (ADA & Mobility Hazards)"
              >
                <Accessibility className="w-8 h-8" />
              </button>
              <span className="text-[11px] font-bold text-neutral-700 mt-1.5 leading-tight text-center max-w-[70px]">
                Disability focus
              </span>
            </div>

            {/* Center: Record Ledger */}
            <div className="flex-1 px-2">
              <div className="text-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 underline underline-offset-2">
                  Record
                </span>
              </div>

              <div className="text-xs space-y-0.5 font-medium text-neutral-800 leading-snug">
                <div className="flex items-center justify-between">
                  <span>{totalSubmitted} complaints submitted</span>
                </div>
                <div className="flex items-center justify-between text-neutral-700">
                  <span>{verifiedCount} acknowledged</span>
                </div>
                <div className="flex items-center justify-between text-amber-800 font-semibold">
                  <span>{scheduledCount} scheduled for repair</span>
                </div>
                <div className="flex items-center justify-between text-purple-800 font-semibold">
                  <span>{inProgressCount} in progress</span>
                </div>
                <div className="flex items-center justify-between text-red-700 font-bold">
                  <span>{disabilityHazardCount} Disability Hazards</span>
                </div>
              </div>
            </div>

            {/* Right: Big prominent "+" button with "file a complaint" */}
            <div className="flex flex-col items-center shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('report')}
                className="w-14 h-14 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white border-2 border-neutral-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                title="Report a Problem / File a Complaint"
                aria-label="Report a Problem"
              >
                <Plus className="w-8 h-8 stroke-[2.5]" />
              </button>
              <span className="text-[11px] font-bold text-neutral-900 mt-1.5 leading-tight text-center max-w-[70px]">
                file a complaint
              </span>
            </div>
          </div>
        </div>

        {/* Quick Report a Problem primary banner button (Document Requirement #1: Include Report a Problem) */}
        <div className="mt-5 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => onNavigate('report')}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Report a Problem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
