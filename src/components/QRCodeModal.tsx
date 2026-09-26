import React from 'react';
import { QrCode, MapPin, X, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportAtLocation: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  onOpenReportAtLocation,
}) => {
  if (!isOpen) return null;

  const physicalTags = [
    {
      id: 'POLE-16A',
      name: 'Utility Pole #16A',
      address: '420 16th Avenue (at Oak St)',
      lat: 45.5189,
      lng: -122.6784,
    },
    {
      id: 'RAMP-16B',
      name: 'ADA Curb Ramp #16B',
      address: '1120 NE 16th Street',
      lat: 45.5591,
      lng: -122.6542,
    },
    {
      id: 'DRAIN-16C',
      name: 'Catch Basin Grate #16C',
      address: '780 16th Terrace',
      lat: 45.5212,
      lng: -122.6953,
    },
  ];

  const [selectedTag, setSelectedTag] = React.useState(physicalTags[0]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white border-2 border-neutral-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
          aria-label="Close QR Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto border-2 border-amber-300">
          <QrCode className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded font-bold">
            Physical QR Code Interface (Req #6)
          </span>
          <h2 className="text-lg font-extrabold text-neutral-950 mt-1 font-sans">
            Scan Physical Street QR Code
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Physical signs mounted on 16th Street poles allow citizens to instantly report without typing addresses.
          </p>
        </div>

        {/* Simulated QR Graphic */}
        <div className="p-3 bg-neutral-900 rounded-2xl border-2 border-neutral-900 inline-block shadow-inner">
          <div className="w-36 h-36 bg-white rounded-xl p-2 flex flex-col items-center justify-center relative">
            {/* Visual SVG QR Code pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full fill-neutral-950">
              <rect x="10" y="10" width="25" height="25" />
              <rect x="15" y="15" width="15" height="15" fill="#fff" />
              <rect x="18" y="18" width="9" height="9" />

              <rect x="65" y="10" width="25" height="25" />
              <rect x="70" y="15" width="15" height="15" fill="#fff" />
              <rect x="73" y="73" width="9" height="9" />

              <rect x="10" y="65" width="25" height="25" />
              <rect x="15" y="70" width="15" height="15" fill="#fff" />
              <rect x="18" y="73" width="9" height="9" />

              <rect x="45" y="15" width="10" height="20" />
              <rect x="40" y="45" width="20" height="15" />
              <rect x="65" y="65" width="25" height="25" />
              <circle cx="50" cy="50" r="4" fill="#d97706" />
            </svg>
            <span className="text-[9px] font-mono font-bold text-neutral-700 mt-1">
              {selectedTag.id}
            </span>
          </div>
        </div>

        {/* Selected Location Selector */}
        <div className="space-y-1.5 text-left text-xs">
          <span className="text-[11px] font-semibold text-neutral-500 block">
            Select physical street sign to simulate:
          </span>
          {physicalTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-colors ${
                selectedTag.id === tag.id
                  ? 'border-neutral-950 bg-neutral-100 font-bold'
                  : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <div className="truncate">
                <span className="font-mono text-neutral-900 block">{tag.name}</span>
                <span className="text-[10px] text-neutral-500">{tag.address}</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                {tag.lat.toFixed(2)}, {tag.lng.toFixed(2)}
              </span>
            </button>
          ))}
        </div>

        {/* Action Button: Opens the report page with location locked */}
        <button
          type="button"
          onClick={() => {
            onOpenReportAtLocation({
              address: selectedTag.address,
              latitude: selectedTag.lat,
              longitude: selectedTag.lng,
            });
            onClose();
          }}
          className="w-full min-h-[44px] py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <span>Open Report from QR Code</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
