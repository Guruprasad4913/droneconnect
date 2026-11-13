import React, { useEffect } from 'react';
import {
  Plane,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  MapPin,
  Calendar,
  X,
  FileText,
  Radio
} from 'lucide-react';

export const BookingAcceptedPopup = ({ isOpen, onClose, data, onViewCertificate }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/30 p-6 sm:p-7 space-y-5 animate-scaleUp overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient effects */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Drone & Celebration Sparkles */}
        <div className="flex items-start space-x-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-sky-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30">
              <Plane className="w-8 h-8 transform -rotate-45 animate-flight-bob text-slate-950" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 items-center justify-center shadow">
                <CheckCircle2 className="w-4 h-4 text-slate-950 font-bold" />
              </span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 uppercase tracking-wider font-mono">
                Pilot Confirmed
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Corridor Locked</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight mt-1">
              🎉 Booking Accepted!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-300 font-medium mt-0.5">
              Your drone spray request has been accepted by the drone operator.
            </p>
          </div>
        </div>

        {/* Pilot & Aircraft Specification Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Assigned Pilot</span>
              <strong className="text-sm font-semibold text-white">
                {data.acceptedBy || 'Smt. Kavita Sharma (Drone Didi Lead)'}
              </strong>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              DGCA Certified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Aircraft / UAS ID</span>
              <strong className="text-emerald-400 font-mono">
                {data.droneUasId || 'KisanDrone (UA-7849-NDD)'}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Spray Operation</span>
              <strong className="text-slate-200">
                {data.crop || 'Paddy (Rice)'} · {data.acreage || 3.0} Acres
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Location Hub</span>
              <strong className="text-slate-200 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-sky-400 inline" />
                <span>{data.village || 'Rampur Kalan'}</span>
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Precision RTK GPS</span>
              <strong className="text-sky-400 font-mono flex items-center space-x-1">
                <Radio className="w-3 h-3 text-sky-400 inline animate-pulse" />
                <span>&lt; 2.5 cm Accuracy</span>
              </strong>
            </div>
          </div>
        </div>

        {/* Live Reassurance Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex items-start space-x-3 text-xs text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Flight Corridor Locked:</strong> The operator has loaded your field coordinates into the autonomous mission flight controller. The drone will arrive during your scheduled window.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
          {onViewCertificate && (
            <button
              onClick={() => {
                onClose();
                onViewCertificate();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Spray Certificate</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transition cursor-pointer active:scale-95 text-center"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
