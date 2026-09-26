/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CivicReport, ReportStatus, StatusHistoryItem } from './types/civic';
import { INITIAL_REPORTS } from './data/initialReports';
import { HomeView } from './components/HomeView';
import { ReportProblemPage } from './components/ReportProblemPage';
import { ConfirmationPage } from './components/ConfirmationPage';
import { TrackingPage } from './components/TrackingPage';
import { CivicMapsPage } from './components/CivicMapsPage';
import { GovtPortalPage } from './components/GovtPortalPage';
import { QRCodeModal } from './components/QRCodeModal';
import {
  Accessibility,
  ArrowLeft,
  Home,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ListFilter,
} from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState<CivicReport[]>(() => {
    const saved = localStorage.getItem('civicfix_kang_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'confirmation' | 'tracker' | 'map' | 'govt'>('home');
  const [lastSubmittedReport, setLastSubmittedReport] = useState<CivicReport | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string>('CF-1042');
  const [disabilityFocus, setDisabilityFocus] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [qrLocationPreset, setQrLocationPreset] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | undefined>(undefined);

  // Sync reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('civicfix_kang_reports', JSON.stringify(reports));
    } catch (_) {}
  }, [reports]);

  // Handle report submission adhering strictly to Kang's assignment
  const handleSubmitReport = (data: {
    photo: string;
    latitude: number;
    longitude: number;
    description?: string;
    address: string;
    category: string;
    is_disability_hazard: boolean;
  }) => {
    const nextNum = Math.floor(Math.random() * 899) + 100;
    const newReportId = `CF-10${nextNum}`;
    const nowFormatted = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const initialHistory: StatusHistoryItem[] = [
      {
        status: 'REPORTED',
        timestamp: nowFormatted,
        completed: true,
        notes: 'Report logged via citizen interface.',
      },
      {
        status: 'VERIFIED',
        timestamp: 'Pending',
        completed: false,
        notes: 'Pending municipal desk assessment.',
      },
      {
        status: 'ASSIGNED',
        timestamp: 'Pending',
        completed: false,
        notes: 'Pending work unit assignment.',
      },
      {
        status: 'INVESTIGATING',
        timestamp: 'Pending',
        completed: false,
        notes: 'Pending field survey.',
      },
      {
        status: 'SCHEDULED',
        timestamp: 'Pending',
        completed: false,
        notes: 'Pending crew repair schedule.',
      },
      {
        status: 'RESOLVED',
        timestamp: 'Pending',
        completed: false,
        notes: 'Pending sign-off.',
      },
    ];

    const departmentMap: Record<string, string> = {
      'Pothole & Road Hazard': 'Department of Transportation',
      'Snow Blocking Sidewalk': 'Municipal Public Works',
      'Clogged Storm Drain': 'Water & Sewer Authority',
      'Broken Traffic Light': 'Traffic Engineering Bureau',
      'Broken Street Light': 'Bureau of Street Lighting',
      'Garbage & Illegal Dumping': 'Department of Sanitation',
    };

    const newReport: CivicReport = {
      report_id: newReportId,
      category: data.category || 'Pothole & Road Hazard',
      severity: data.is_disability_hazard ? 'CRITICAL' : 'HIGH',
      department: departmentMap[data.category] || 'Department of Transportation',
      status: 'REPORTED',
      created_at: nowFormatted,
      status_history: initialHistory,
      photo: data.photo,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      address: data.address,
      neighborhood: 'Sector #16th Municipal Ward',
      is_disability_hazard: data.is_disability_hazard,
      upvotes: 1,
      has_upvoted: true,
    };

    setReports((prev) => [newReport, ...prev]);
    setLastSubmittedReport(newReport);
    setSelectedReportId(newReportId);
    setActiveTab('confirmation');
  };

  // Update status from Gov't Portal
  const handleUpdateStatus = (reportId: string, newStatus: ReportStatus, note?: string) => {
    const nowFormatted = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setReports((prev) =>
      prev.map((r) => {
        if (r.report_id === reportId) {
          const updatedHistory = r.status_history.map((step) => {
            if (step.status === newStatus) {
              return {
                ...step,
                completed: true,
                timestamp: nowFormatted,
                notes: note || step.notes,
              };
            }
            return step;
          });

          return {
            ...r,
            status: newStatus,
            status_history: updatedHistory,
          };
        }
        return r;
      })
    );
  };

  const handleOpenFromQR = (location: { address: string; latitude: number; longitude: number }) => {
    setQrLocationPreset(location);
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans flex flex-col antialiased">
      {/* Top Universal App Navigation Bar */}
      <header className="bg-white border-b-2 border-neutral-900 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left"
          >
            <span className="font-extrabold text-base tracking-tight font-sans text-neutral-950">
              CivicFix
            </span>
            <span className="text-[11px] font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
              Fix My Street #16th
            </span>
          </button>

          {/* Quick tab links */}
          <nav className="flex items-center gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === 'home'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === 'tracker'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Tracker
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`hidden sm:inline-block px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === 'map'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Hazards Map
            </button>
            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1"
              title="Physical QR Code Sign"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">QR Sign</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {activeTab === 'home' && (
          <HomeView
            reports={reports}
            disabilityFocus={disabilityFocus}
            onToggleDisabilityFocus={() => setDisabilityFocus(!disabilityFocus)}
            onNavigate={(tab) => {
              if (tab === 'home') setActiveTab('home');
              if (tab === 'report') {
                setQrLocationPreset(undefined);
                setActiveTab('report');
              }
              if (tab === 'tracker') setActiveTab('tracker');
              if (tab === 'map') setActiveTab('map');
              if (tab === 'govt') setActiveTab('govt');
            }}
            onOpenQR={() => setIsQRModalOpen(true)}
            onSelectReport={(rep) => {
              setSelectedReportId(rep.report_id);
              setActiveTab('tracker');
            }}
          />
        )}

        {activeTab === 'report' && (
          <ReportProblemPage
            onBack={() => setActiveTab('home')}
            onSubmit={handleSubmitReport}
            initialLocation={qrLocationPreset}
          />
        )}

        {activeTab === 'confirmation' && lastSubmittedReport && (
          <ConfirmationPage
            report={lastSubmittedReport}
            onViewTracking={(rep) => {
              setSelectedReportId(rep.report_id);
              setActiveTab('tracker');
            }}
            onGoHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'tracker' && (
          <TrackingPage
            reports={reports}
            selectedReportId={selectedReportId}
            onBack={() => setActiveTab('home')}
            onSelectReport={(rep) => setSelectedReportId(rep.report_id)}
          />
        )}

        {activeTab === 'map' && (
          <CivicMapsPage
            reports={reports}
            disabilityFocus={disabilityFocus}
            onToggleDisabilityFocus={() => setDisabilityFocus(!disabilityFocus)}
            onSelectReport={(rep) => {
              setSelectedReportId(rep.report_id);
              setActiveTab('tracker');
            }}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'govt' && (
          <GovtPortalPage
            reports={reports}
            onUpdateStatus={handleUpdateStatus}
            onSelectReport={(rep) => {
              setSelectedReportId(rep.report_id);
              setActiveTab('tracker');
            }}
            onBack={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* QR Code Modal for Section 6 */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onOpenReportAtLocation={handleOpenFromQR}
      />

      {/* Accessible Footer */}
      <footer className="py-4 border-t border-neutral-200 text-center text-xs text-neutral-500">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <span className="font-mono">CivicFix · Kang Assignment</span>
          <span className="font-mono">Exact Schema & Field Names</span>
        </div>
      </footer>
    </div>
  );
}
