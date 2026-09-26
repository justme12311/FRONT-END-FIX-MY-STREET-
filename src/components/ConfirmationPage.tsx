import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Home,
  Clock,
  MapPin,
  Share2,
  Building2,
  Copy,
  Check,
} from 'lucide-react';
import { CivicReport } from '../types/civic';

interface ConfirmationPageProps {
  report: CivicReport;
  onViewTracking: (report: CivicReport) => void;
  onGoHome: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  report,
  onViewTracking,
  onGoHome,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(report.report_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-white border-2 border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95">
        {/* Big Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Exact Text from Specification */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-neutral-950 font-sans tracking-tight">
            Report Submitted
          </h1>
          <p className="text-xs text-neutral-600">
            Your complaint has been successfully transmitted to municipal authorities.
          </p>
        </div>

        {/* Report ID Box (Example: Report ID: CF-1042) */}
        <div className="bg-neutral-100 border-2 border-neutral-900 rounded-2xl p-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-semibold text-neutral-500 block uppercase tracking-wider">
              Official Tracking Code
            </span>
            <span className="text-lg font-mono font-extrabold text-neutral-950">
              Report ID: {report.report_id}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Copy Report ID"
          >
            {copied ? (
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <Check className="w-4 h-4" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-4 h-4" /> Copy
              </span>
            )}
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Status:</span>
            <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {report.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Category:</span>
            <span className="font-semibold text-neutral-900">{report.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Location:</span>
            <span className="font-medium text-neutral-800 truncate max-w-[200px]">
              {report.address}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Department:</span>
            <span className="font-medium text-neutral-800">{report.department}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Submitted at:</span>
            <span className="font-mono text-neutral-600">{report.created_at}</span>
          </div>
        </div>

        {/* Deliverable Actions: View Status / Timeline OR Back to Home */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => onViewTracking(report)}
            className="w-full min-h-[48px] py-3 px-5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
          >
            <span>View Status & Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full min-h-[44px] py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-xs rounded-2xl border-2 border-neutral-300 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
