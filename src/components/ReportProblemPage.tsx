import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  Navigation,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Accessibility,
  X,
  Sparkles,
} from 'lucide-react';
import { NewReportInput } from '../types/civic';
import potholeImg from '../assets/images/pothole_asphalt_street_1790391694326.jpg';
import snowImg from '../assets/images/snow_blocking_sidewalk_1790391704923.jpg';
import drainImg from '../assets/images/clogged_storm_drain_1790391714639.jpg';

interface ReportProblemPageProps {
  onBack: () => void;
  onSubmit: (reportData: {
    photo: string;
    latitude: number;
    longitude: number;
    description?: string;
    address: string;
    category: string;
    is_disability_hazard: boolean;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export const ReportProblemPage: React.FC<ReportProblemPageProps> = ({
  onBack,
  onSubmit,
  initialLocation,
}) => {
  // Exact required fields according to Kang specification
  const [photo, setPhoto] = useState<string>(potholeImg);
  const [latitude, setLatitude] = useState<number>(initialLocation?.latitude || 45.5189);
  const [longitude, setLongitude] = useState<number>(initialLocation?.longitude || -122.6784);
  const [description, setDescription] = useState<string>('');

  // Additional display helpers
  const [address, setAddress] = useState<string>(
    initialLocation?.address || '420 16th Avenue (at Oak St)'
  );
  const [category, setCategory] = useState<string>('Pothole & Road Hazard');
  const [isDisabilityHazard, setIsDisabilityHazard] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePhotos = [
    { label: 'Pothole (#16th)', url: potholeImg, category: 'Pothole & Road Hazard' },
    { label: 'Snow Sidewalk', url: snowImg, category: 'Snow Blocking Sidewalk' },
    { label: 'Clogged Drain', url: drainImg, category: 'Clogged Storm Drain' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        setPhoto(resultUrl);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectGPS = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          setLatitude(lat);
          setLongitude(lng);
          setAddress(`${Math.floor(Math.abs(lat) * 10) % 800 + 100} 16th Street`);
          setIsLocating(false);
        },
        () => {
          // Fallback location on 16th street
          setLatitude(45.5189);
          setLongitude(-122.6784);
          setAddress('420 16th Avenue (at Oak St)');
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      setErrorMessage('Please provide a photo of the problem.');
      return;
    }

    onSubmit({
      photo,
      latitude,
      longitude,
      description: description.trim() || undefined,
      address,
      category,
      is_disability_hazard: isDisabilityHazard,
    });
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="bg-white border-2 border-neutral-900 rounded-3xl p-5 sm:p-7 shadow-xl">
        {/* Navigation Back */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-5">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-neutral-950 min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs font-mono font-bold text-neutral-400">Step 1 of 2</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-sans tracking-tight">
            Report a Problem
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Provide a photo, confirm your location, and add an optional description.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. PHOTO (Required) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-neutral-700" />
                <span>1. Photo</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <span className="text-[11px] text-neutral-500">Take or upload photo</span>
            </div>

            {/* Photo Preview Container */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-300 bg-neutral-100 aspect-video sm:h-52 flex items-center justify-center">
              {photo ? (
                <>
                  <img
                    src={photo}
                    alt="Problem to report"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setPhoto('')}
                    className="absolute top-2 right-2 p-1.5 bg-neutral-900/80 text-white rounded-full hover:bg-neutral-900"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-neutral-600 block">
                    No photo provided yet
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Upload from your device or choose a sample below
                  </span>
                </div>
              )}
            </div>

            {/* Choose or Upload actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                id="camera-file-input"
              />
              <label
                htmlFor="camera-file-input"
                className="w-full sm:flex-1 cursor-pointer min-h-[42px] px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload from Device / Camera</span>
              </label>
            </div>

            {/* Quick Presets for Rapid Testing */}
            <div className="pt-2">
              <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                Or choose sample photo:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {samplePhotos.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPhoto(s.url);
                      setCategory(s.category);
                      if (s.category.includes('Snow')) setIsDisabilityHazard(true);
                    }}
                    className={`p-1.5 border rounded-xl text-left transition-all flex items-center gap-2 ${
                      photo === s.url
                        ? 'border-neutral-950 bg-neutral-100 ring-1 ring-neutral-950 font-bold'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <img
                      src={s.url}
                      alt={s.label}
                      className="w-9 h-9 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] leading-tight truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. LOCATION (Required latitude, longitude) */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-neutral-700" />
                <span>2. Location</span>
                <span className="text-red-500 font-bold">*</span>
              </label>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 min-h-[32px] px-2"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Auto-Detect GPS'}</span>
              </button>
            </div>

            <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-3.5 space-y-2">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">
                  Street Address:
                </span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs font-bold text-neutral-900 bg-white border border-neutral-300 rounded-lg p-2 focus:ring-1 focus:ring-neutral-900 outline-none"
                  placeholder="e.g. 420 16th Street"
                />
              </div>

              {/* Exact fields: latitude and longitude */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] font-mono text-neutral-500 block">
                    latitude
                  </span>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono font-bold text-neutral-900 bg-white border border-neutral-300 rounded-lg p-2 focus:ring-1 focus:ring-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-neutral-500 block">
                    longitude
                  </span>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono font-bold text-neutral-900 bg-white border border-neutral-300 rounded-lg p-2 focus:ring-1 focus:ring-neutral-900 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. OPTIONAL DESCRIPTION (Exact field: description) */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label
                htmlFor="report-description"
                className="text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                3. Optional Description
              </label>
              <span className="text-[11px] text-neutral-500">(Optional)</span>
            </div>
            <textarea
              id="report-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of the issue (e.g. exact spot on 16th street, severity, hazards)..."
              className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none"
            />
          </div>

          {/* Disability / Mobility Hazard Checkbox */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isDisabilityHazard}
                onChange={(e) => setIsDisabilityHazard(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-blue-300"
              />
              <div className="text-xs">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Accessibility className="w-3.5 h-3.5 text-blue-700" />
                  Flag as Disability Hazard (Disability Focus)
                </span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Check if this blocks wheelchairs, canes, crosswalk chirpers, or sidewalks.
                </p>
              </div>
            </label>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* CLEAR "Submit Report" BUTTON (Document Requirement: Include a clear: Submit Report) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[50px] py-3.5 px-6 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
