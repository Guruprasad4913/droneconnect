import React, { useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  Plane,
  Clock,
  Sparkles,
  MapPin,
  X,
  ShieldCheck,
  BellRing
} from 'lucide-react';

export const MessageSentPopup = ({ isOpen, onClose, data, onViewStatus }) => {
  useEffect(() => {
    if (!isOpen) return;

    // Auto close after 8 seconds
    const timer = setTimeout(() => {
      onClose?.();
    }, 8000);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-950/50 p-6 space-y-5 animate-scaleUp overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label="Close message sent notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with animated Send / Check Icon */}
        <div className="flex items-start space-x-3.5">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
              <Send className="w-6 h-6 transform -rotate-12 translate-x-0.5 -translate-y-0.5" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 font-bold" />
              </span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider font-mono">
                Pop-Up Notification
              </span>
              <span className="text-[11px] text-slate-400">Just Now</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white tracking-tight mt-0.5">
              Message Sent!
            </h3>
            <p className="text-xs text-emerald-300 font-medium">
              Drone spray booking request successfully sent to Hub Operator.
            </p>
          </div>
        </div>

        {/* Transmission & Dispatch Status Pipeline */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center space-x-1.5">
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>Operator Notification Status</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1"></span>
              Awaiting Pilot Acceptance
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] font-mono">
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block uppercase text-[9px]">Farmer</span>
              <strong className="text-white truncate block">{data.farmerName || 'Balwant Singh'}</strong>
            </div>

            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block uppercase text-[9px]">Field Size</span>
              <strong className="text-emerald-400 block">{data.acreage || 3.0} Acres</strong>
            </div>

            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block uppercase text-[9px]">Crop</span>
              <strong className="text-slate-300 truncate block">{data.crop || 'Paddy (Rice)'}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-300 border-t border-slate-800/80">
            <span className="text-slate-400 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-sky-400 inline" />
              <span>Target Hub:</span>
            </span>
            <span className="font-semibold text-white">
              {data.village || 'Rampur Kalan'} ({data.zone || 'Zone North'})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="text-slate-400 flex items-center space-x-1">
              <Plane className="w-3 h-3 text-emerald-400 inline" />
              <span>Assigned Unit:</span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              KisanDrone Hexacopter (UA-7849-NDD)
            </span>
          </div>
        </div>

        {/* Reassurance note */}
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start space-x-2.5 text-xs text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Operator Notified in Real-Time:</strong> Smt. Kavita Sharma (Drone Didi Lead) has received your request on the operator console. Once accepted, your flight corridor and spraying time window will lock in automatically.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-2 pt-1">
          {onViewStatus && (
            <button
              onClick={() => {
                onClose();
                onViewStatus();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition cursor-pointer border border-slate-700"
            >
              View Booking History
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition cursor-pointer active:scale-95"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
