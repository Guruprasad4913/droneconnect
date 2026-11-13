import React from 'react';
import { CheckCircle2, QrCode, Printer, X, ShieldCheck } from 'lucide-react';

export const DigitalSprayCertificateModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card max-w-xl w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">Digital Spraying Certificate & Invoice</h4>
              <p className="text-xs text-slate-400">DGCA & Ministry of Agriculture Aligned</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Card */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
          
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <strong className="text-white font-sans text-sm block">AGRIDRONE HUB CERTIFICATION</strong>
              <span className="text-[11px] text-emerald-400">UAS Registration: UA-7849-NDD</span>
              <div className="text-[10px] text-slate-400">Operator: Prerna Drone Didi SHG Federation</div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                STATUS: VERIFIED
              </span>
              <div className="text-[10px] text-slate-400 mt-1">Ref: {booking.invoiceNumber || 'INV-2026-003'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">Farmer / Beneficiary:</span>
              <strong className="text-white font-sans">{booking.farmerName || 'Balwant Singh'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Village & District:</span>
              <strong className="text-white font-sans">{booking.village || 'Rampur Kalan'}, Lucknow</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Crop & Acreage:</span>
              <strong className="text-white font-sans">{booking.crop || 'Paddy (Rice)'} · {booking.acreage} Acres</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Spray Input:</span>
              <strong className="text-white font-sans">{booking.chemicalType || 'IFFCO Nano Urea & DAP'}</strong>
            </div>
          </div>

          {/* Pricing & Subsidy Summary */}
          <div className="border-t border-slate-800 pt-3 space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-400">
              <span>Standard Solo Spray Rate:</span>
              <span>₹400 / Acre</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Radius Cluster Aggregation Discount:</span>
              <span>- ₹100 / Acre</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-1">
              <span>Total Payable to SHG ({booking.acreage} Ac @ ₹300):</span>
              <span className="text-emerald-400">₹{booking.acreage * 300}</span>
            </div>
          </div>

          {/* QR Code & Telemetry Verification */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            <div className="space-y-0.5">
              <span>Flight Altitude: 2.2m Above Crop Canopy</span><br />
              <span>RTK Coordinates: [26.8520° N, 80.9510° E]</span><br />
              <span>Pilot: Smt. Kavita Sharma (Certified Drone Didi)</span>
            </div>
            <div className="w-14 h-14 bg-slate-950 border border-slate-700 rounded-lg flex items-center justify-center p-1 text-slate-400">
              <QrCode className="w-full h-full text-emerald-400" />
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] text-slate-500">Official Drone Didi Subsidized Service</span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Certificate / PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
