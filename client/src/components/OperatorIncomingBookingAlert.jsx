import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Plane,
  Clock,
  Sparkles,
  MapPin,
  X,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight
} from 'lucide-react';
import { playNewBookingChime, playCorridorLockedChime } from '../utils/audioChime';
import { api } from '../services/api';
import { emitRealtimeEvent, subscribeToRealtimeEvents } from '../services/realtimeEvents';

export const OperatorIncomingBookingAlert = ({ currentRole, activeView, onNavigateToOperator }) => {
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Subscribe to cross-tab & local booking creation events
    const unsubscribe = subscribeToRealtimeEvents({
      agridrone_booking_created: (bookingData) => {
        if (!bookingData) return;

        // Populate incoming booking alert
        setCurrentAlert({
          id: bookingData._id || 'b-' + Date.now(),
          farmerName: bookingData.farmerName || 'Balwant Singh',
          crop: bookingData.crop || 'Paddy (Rice)',
          acreage: bookingData.acreage || 3.5,
          village: bookingData.village || 'Rampur Kalan',
          zone: bookingData.zone || 'Zone North',
          serviceRequired: bookingData.serviceRequired || 'Nano-Urea Spray',
          estimatedRevenue: bookingData.pricing?.totalCost || (bookingData.acreage ? bookingData.acreage * 300 : 1050),
          createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        });
        setIsAccepted(false);

        // Play alert chime
        if (soundEnabled) {
          playNewBookingChime();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [soundEnabled]);

  const handleAccept = async () => {
    if (!currentAlert) return;
    setIsAccepting(true);
    try {
      const operatorName = 'Smt. Kavita Sharma (Drone Didi Lead)';
      const droneUasId = 'UA-7849-NDD';

      // Accept booking in backend API if ID is valid
      if (currentAlert.id && !currentAlert.id.startsWith('b-')) {
        await api.bookings.accept(currentAlert.id, {
          operatorName,
          droneUasId
        });
      }

      setIsAccepted(true);
      if (soundEnabled) {
        playCorridorLockedChime();
      }

      // Broadcast acceptance to Farmer & Operator components
      emitRealtimeEvent('agridrone_booking_accepted', {
        bookingId: currentAlert.id,
        farmerName: currentAlert.farmerName,
        crop: currentAlert.crop,
        acreage: currentAlert.acreage,
        village: currentAlert.village,
        acceptedBy: operatorName,
        droneUasId
      });

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setCurrentAlert(null);
        setIsAccepted(false);
      }, 4000);
    } catch (err) {
      // Fallback
      setIsAccepted(true);
      emitRealtimeEvent('agridrone_booking_accepted', {
        bookingId: currentAlert.id,
        farmerName: currentAlert.farmerName,
        crop: currentAlert.crop,
        acreage: currentAlert.acreage,
        village: currentAlert.village,
        acceptedBy: 'Smt. Kavita Sharma (Drone Didi)',
        droneUasId: 'UA-7849-NDD'
      });
      setTimeout(() => {
        setCurrentAlert(null);
        setIsAccepted(false);
      }, 4000);
    } finally {
      setIsAccepting(false);
    }
  };

  if (!currentAlert) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-slideUp">
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/80 shadow-2xl shadow-amber-950/50 p-5 overflow-hidden backdrop-blur-xl">
        
        {/* Radar ambient glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              ⚡ Operator Dispatch Alert
            </span>
            <span className="text-[10px] text-slate-400">({currentAlert.createdAt})</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
            <button
              onClick={() => setCurrentAlert(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-3 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold block">
                🌾 New Farmer Booking Registered
              </span>
              <h4 className="text-base font-display font-bold text-white leading-tight mt-0.5">
                {currentAlert.farmerName}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-sky-400 inline shrink-0" />
                <span>{currentAlert.village} · {currentAlert.zone}</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block font-mono">Estimated Revenue</span>
              <span className="text-base font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +₹{currentAlert.estimatedRevenue}
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Plot Size</span>
              <strong className="text-white">{currentAlert.acreage} Acres</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Crop</span>
              <strong className="text-slate-200 truncate block">{currentAlert.crop}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Corridor Rate</span>
              <strong className="text-emerald-400">₹300/ac</strong>
            </div>
          </div>

          {/* Status / Action Footer */}
          {isAccepted ? (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center space-x-2 text-xs text-emerald-300 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <strong className="block text-white">Flight Corridor Locked!</strong>
                <span className="text-[11px] text-emerald-300">Autopilot telemetry synched to Hexacopter UA-7849-NDD.</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>{isAccepting ? 'Locking Corridor...' : '⚡ Accept Booking & Lock Corridor'}</span>
              </button>

              <button
                onClick={() => {
                  onNavigateToOperator?.();
                  setCurrentAlert(null);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition flex items-center space-x-1 cursor-pointer"
                title="Open Operator Command Center"
              >
                <span>Console</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
