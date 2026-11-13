import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  MapPin,
  BatteryCharging,
  TrendingUp,
  DollarSign,
  Layers,
  Plane,
  Clock,
  X,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const DEMO_STEPS = [
  {
    step: 1,
    title: 'Farmer Requests Service',
    subtitle: 'Balwant Singh submits spray request for 4-Acre Paddy field in Rampur Kalan',
    roleTag: 'Farmer Persona',
    roleBadgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    icon: '👨‍🌾',
    stats: [
      { label: 'Plot Size', value: '4.0 Acres', highlight: false },
      { label: 'Service Input', value: 'IFFCO Nano Urea & DAP', highlight: false },
      { label: 'Solo Price Quote', value: '₹400 / Acre', highlight: false },
      { label: 'Solo Total Cost', value: '₹1,600', highlight: true, color: 'text-amber-400' }
    ],
    highlightBox: {
      type: 'warning',
      title: '⚠️ The Traditional Solo Dilemma',
      text: 'If sprayed as a solo 4-acre plot, the operator travels 7.2 km each way with battery deadhead loss, forcing high ₹400/ac pricing.'
    },
    actionLabel: 'View in Farmer Portal',
    targetView: 'farmer'
  },
  {
    step: 2,
    title: 'Nearby Requests Detected',
    subtitle: 'Spatial Aggregation Engine detects 3 waiting neighbor plots within 3.5 km radius',
    roleTag: 'Demand Aggregator',
    roleBadgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    icon: '📡',
    stats: [
      { label: 'Hub Center', value: 'Zone North Hub (3.5 km)', highlight: false },
      { label: 'Nearby Plots Found', value: '3 Smallholders', highlight: true, color: 'text-sky-400' },
      { label: 'Neighbor Acreage', value: '2 ac + 3 ac + 3 ac', highlight: false },
      { label: 'Combined Acreage', value: '12.0 Total Acres', highlight: true, color: 'text-emerald-400' }
    ],
    highlightBox: {
      type: 'info',
      title: '🌐 Automatic Spatial Aggregation',
      text: 'Neighboring farmers (Ramesh, Sunita, Kishan) requesting spraying within a 48-hour window are matched into a single geographical pool.'
    },
    actionLabel: 'Inspect Nearby Radar',
    targetView: 'farmer'
  },
  {
    step: 3,
    title: 'Farms Clustered into Hub',
    subtitle: 'Cluster HUB-ZN-101 formed · Volume discount drops price from ₹400 to ₹300/acre',
    roleTag: 'Clustering Engine',
    roleBadgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    icon: '🧩',
    stats: [
      { label: 'Cluster Code', value: 'HUB-ZN-101', highlight: false },
      { label: 'Total Cluster Size', value: '12.0 Acres', highlight: false },
      { label: 'Discounted Price', value: '₹300 / Acre', highlight: true, color: 'text-emerald-400' },
      { label: 'Farmer Direct Savings', value: '₹1,200 Total (₹400 for Balwant)', highlight: true, color: 'text-emerald-300' }
    ],
    highlightBox: {
      type: 'success',
      title: '🎉 25% Instant Farmer Subsidy',
      text: 'By aggregating 12 contiguous acres, per-acre pricing drops by ₹100/acre. Farmers get affordable spraying without government subsidy delays.'
    },
    actionLabel: 'Open 12-Acre Demo',
    targetView: 'home'
  },
  {
    step: 4,
    title: 'Route & Battery Optimized',
    subtitle: 'Contiguous flight corridor planned: Base ➔ A ➔ B ➔ Solar Swap ➔ C ➔ D ➔ Base',
    roleTag: 'Flight AI & Logistics',
    roleBadgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    icon: '🗺️',
    stats: [
      { label: 'Optimized Distance', value: '4.8 km Corridor', highlight: true, color: 'text-emerald-400' },
      { label: 'Solo Distance Avoided', value: '14.2 km (-66% Transit)', highlight: false },
      { label: 'LiPo Battery Packs', value: '3 Cycles Planned', highlight: false },
      { label: 'Charging Logistics', value: '1 Mobile Solar Van Swap', highlight: true, color: 'text-amber-400' }
    ],
    highlightBox: {
      type: 'info',
      title: '⚡ Zero Deadhead Energy Loss',
      text: 'Instead of flying back to base between every farm, the Mobile Solar Charging Van meets the drone at Waypoint 3 for an ultra-fast 2-minute battery swap.'
    },
    actionLabel: 'View Smart Route Planner',
    targetView: 'operator'
  },
  {
    step: 5,
    title: 'Operator Accepts Cluster',
    subtitle: 'Drone Didi Kavita Sharma receives 1-Click Autopilot dispatch for 12 acres',
    roleTag: 'Operator Command',
    roleBadgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    icon: '✅',
    stats: [
      { label: 'Pilot Assigned', value: 'Smt. Kavita (Prerna SHG)', highlight: false },
      { label: 'Aircraft Assigned', value: 'KisanDrone Hexa (UA-7849)', highlight: false },
      { label: 'Gross Revenue', value: '₹3,600 (12 Ac @ ₹300)', highlight: true, color: 'text-emerald-400' },
      { label: 'Net Operator Profit', value: '₹2,640 (73% Margin)', highlight: true, color: 'text-emerald-300' }
    ],
    highlightBox: {
      type: 'success',
      title: '📈 Operator Profitability Surges',
      text: 'Under the solo model, spraying 12 fragmented acres took 2 full days and yielded ₹1,400 net profit. Clustered execution completes in 3 hours with ₹2,640 net profit.'
    },
    actionLabel: 'Open Operator Dispatch',
    targetView: 'operator'
  },
  {
    step: 6,
    title: 'Jobs Completed & Utilisation Surges',
    subtitle: '12 acres sprayed in 68 minutes · Verified Digital Certificates issued with QR codes',
    roleTag: 'Execution & Telemetry',
    roleBadgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    icon: '🎯',
    stats: [
      { label: 'Flight Time Logged', value: '68 Mins (2.1 hrs)', highlight: false },
      { label: 'Fleet Utilisation', value: '78.4% (vs 21.5% Industry)', highlight: true, color: 'text-emerald-400' },
      { label: 'Daily Acre Throughput', value: '28–35 Acres / Day', highlight: true, color: 'text-sky-400' },
      { label: 'Digital Certificates', value: '4 Issued with GPS & QR', highlight: false }
    ],
    highlightBox: {
      type: 'success',
      title: '📜 Ministry & DGCA Compliant Audits',
      text: 'Every smallholder receives a digital spraying certificate with RTK coordinates, pilot certification number, and exact chemical dosage records.'
    },
    actionLabel: 'View Digital Certificate',
    targetView: 'farmer'
  },
  {
    step: 7,
    title: 'Off-Season Revenue Engine',
    subtitle: 'Spraying season ends · Drone pivots to SVAMITVA land mapping & PMFBY insurance surveys',
    roleTag: 'Year-Round Profitability',
    roleBadgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    icon: '🛰️',
    stats: [
      { label: 'Active Flying Days', value: '218 Days / Year', highlight: true, color: 'text-emerald-400' },
      { label: 'Idle Months Avoided', value: '7.5 Months Downtime Slashed', highlight: true, color: 'text-purple-400' },
      { label: 'Off-Season Contract', value: 'SVAMITVA 100 Ac (₹22,000)', highlight: false },
      { label: 'Drone Capital Payback', value: '14.2 Months (vs 54 Mo)', highlight: true, color: 'text-emerald-400' }
    ],
    highlightBox: {
      type: 'purple',
      title: '💡 The Core Thesis Solved',
      text: 'AgriDrone Hub ensures agricultural drones fly year-round, generating steady monthly cash flows for SHGs and cutting drone loan repayment from 4.5 years down to 14 months.'
    },
    actionLabel: 'Explore Off-Season Contracts',
    targetView: 'operator'
  },
  {
    step: 8,
    title: 'National Fleet Directorate Command',
    subtitle: 'Directorate monitors 28 states, tracks national asset ROI, enforces DGCA safety & emergency locks',
    roleTag: 'National Admin Directorate',
    roleBadgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    icon: '🛡️',
    stats: [
      { label: 'Active Fleet', value: '24 Registered Drones', highlight: true, color: 'text-sky-400' },
      { label: 'Total Acreage', value: '5,090+ Acres Treated', highlight: true, color: 'text-emerald-400' },
      { label: 'National Payback', value: '14.2 Months Payback', highlight: true, color: 'text-amber-400' },
      { label: 'DGCA Certified Didis', value: '100% Valid RPCs', highlight: false }
    ],
    highlightBox: {
      type: 'info',
      title: '🛡️ Directorate Oversight & Safety Protocols',
      text: 'Ministry and institutional executives monitor nationwide operational zone hubs across all 28 Indian states with real-time GIS radar, battery telemetry, and 1-click airspace emergency shutdown.'
    },
    actionLabel: 'Open Admin Directorate',
    targetView: 'admin'
  }
];

export const InteractiveDemoFlowModal = ({ isOpen, onClose, onNavigateView }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const step = DEMO_STEPS[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalTime = 50; // ms
    const stepDuration = 5000; // 5s per step
    const stepIncrement = (intervalTime / stepDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStepIndex((idx) => (idx + 1) % DEMO_STEPS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentStepIndex]);

  if (!isOpen) return null;

  const handleSelectStep = (idx) => {
    setCurrentStepIndex(idx);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentStepIndex((idx) => (idx + 1) % DEMO_STEPS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentStepIndex((idx) => (idx - 1 + DEMO_STEPS.length) % DEMO_STEPS.length);
    setProgress(0);
  };

  const handleJumpToView = (view) => {
    onNavigateView?.(view);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-card max-w-4xl w-full rounded-3xl border border-brand-500/40 shadow-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-white text-lg">AgriDrone Hub Profitability Flywheel</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase font-mono">
                  Live Interactive Demo
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium">“More Flights. Less Idle Time. Higher Farm Profitability.”</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition cursor-pointer border border-slate-700"
              title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto-Play'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Pill Bar (Steps 1 to 7) */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-800/80 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {DEMO_STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={s.step}
                  onClick={() => handleSelectStep(idx)}
                  className={`flex-1 p-2 rounded-xl border text-left transition cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 border-brand-500 shadow-lg'
                      : isPast
                      ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-500'
                  }`}
                >
                  {/* Progress Indicator for current active step */}
                  {isActive && isPlaying && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-400 to-emerald-400 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm">{s.icon}</span>
                    <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-brand-400' : 'text-slate-400'}`}>
                      0{s.step}
                    </span>
                  </div>
                  <div className={`text-[11px] font-semibold truncate mt-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {s.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Step Detail Display */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Step Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider font-mono ${step.roleBadgeColor}`}>
                  Step {step.step} of 7 · {step.roleTag}
                </span>
                <span className="text-xs text-slate-500 font-mono">Phase: {step.title}</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white mt-1.5 flex items-center">
                <span className="mr-2 text-2xl">{step.icon}</span>
                <span>{step.title}</span>
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                {step.subtitle}
              </p>
            </div>

            <button
              onClick={() => handleJumpToView(step.targetView)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-2 transition self-start sm:self-auto cursor-pointer shadow"
            >
              <span>{step.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {step.stats.map((stat, i) => (
              <div key={i} className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold block truncate">
                  {stat.label}
                </span>
                <div className={`text-base font-bold font-mono truncate ${stat.color || 'text-white'}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Key Insight Highlight Box */}
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
              step.highlightBox.type === 'warning'
                ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                : step.highlightBox.type === 'purple'
                ? 'bg-purple-950/20 border-purple-800/50 text-purple-200'
                : 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
            }`}
          >
            <strong className="block font-sans font-semibold text-white">
              {step.highlightBox.title}
            </strong>
            <p className="text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
              {step.highlightBox.text}
            </p>
          </div>

          {/* Core Thesis Reminder Card */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-300 font-sans font-medium">Core Thesis:</span>
              <span>Making existing agricultural drones fly more often and earn more rather than simply selling drones.</span>
            </div>
          </div>

        </div>

        {/* Modal Footer with Stepper Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center space-x-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center space-x-1 font-mono text-xs text-slate-400">
            <span>Step {currentStepIndex + 1} of {DEMO_STEPS.length}</span>
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 text-slate-950 text-xs font-bold flex items-center space-x-2 transition cursor-pointer shadow-lg shadow-brand-500/20"
          >
            <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Restart Journey' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>
    </div>
  );
};
