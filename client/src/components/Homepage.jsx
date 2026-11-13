import React from 'react';
import { ClusterDemoSection } from './ClusterDemoSection';
import { useAuth } from '../context/AuthContext';
import {
  Plane,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Calendar,
  DollarSign,
  ChevronRight,
  Wind,
  MapPin,
  BatteryCharging,
  Maximize2
} from 'lucide-react';

export const Homepage = ({ onOpenClusterDemo, onOpenDemoFlow, setActiveView }) => {
  const { t, switchDemoRole } = useAuth();

  return (
    <div className="space-y-16 py-8">
      
      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[300px] bg-tech-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto pt-4 sm:pt-10">
          
          {/* Tag & DGCA Compliance Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Ideathon Track 2 Solution: Making Agri-Drone Services Profitable</span>
          </div>

          {/* Main Flagship Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
            “More Flights. Less Idle Time. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-emerald-400 to-tech-400 bg-clip-text text-transparent">
              Higher Farm Profitability.”
            </span>
          </h1>

          {/* Subtitle / Value Statement */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('hero_sub')}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            
            <button
              onClick={onOpenDemoFlow}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 hover:from-brand-300 shadow-xl shadow-brand-500/25 active:scale-[0.99] transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>⚡ Watch 7-Step Profitability Demo</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <a
              href="#cluster-demo-section"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-display font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-600/40 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{t('create_cluster_btn')}</span>
            </a>

            <button
              onClick={() => { switchDemoRole('farmer'); setActiveView('farmer'); }}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-display font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-600/40 transition flex items-center justify-center space-x-1.5 text-xs sm:text-sm cursor-pointer"
            >
              <span>👨‍🌾 1. Farmer Portal</span>
            </button>

            <button
              onClick={() => { switchDemoRole('operator'); setActiveView('operator'); }}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-display font-semibold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-600/40 transition flex items-center justify-center space-x-1.5 text-xs sm:text-sm cursor-pointer"
            >
              <span>🛰️ 2. Drone Operator</span>
            </button>

            <button
              onClick={() => { switchDemoRole('panchayat'); setActiveView('panchayat'); }}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-display font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/40 transition flex items-center justify-center space-x-1.5 text-xs sm:text-sm cursor-pointer"
            >
              <span>🏛️ 3. Panchayat Kiosk (Offline)</span>
            </button>

            <button
              onClick={() => { switchDemoRole('admin'); setActiveView('admin'); }}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-display font-semibold text-sky-300 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-600/40 transition flex items-center justify-center space-x-1.5 text-xs sm:text-sm cursor-pointer"
            >
              <span>🛡️ 4. Directorate Admin</span>
            </button>

          </div>

          {/* Live Network Performance Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 font-mono text-center">
            
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-sans block">Operational Hubs</span>
              <strong className="text-white text-base">4 Hubs (18 Villages)</strong>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-sans block">Fleet Utilization</span>
              <strong className="text-emerald-400 text-base">78.4% (218 Days/Yr)</strong>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-sans block">Farmer Savings</span>
              <strong className="text-white text-base">₹1,84,000 (25% Off)</strong>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-sans block">Capital Payback</span>
              <strong className="text-emerald-400 text-base">14.2 Months</strong>
            </div>

          </div>

        </div>
      </section>

      {/* 4 DEDICATED PLATFORM DASHBOARDS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
            Full Rural Ecosystem Coverage
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Four Tailored Dashboards for Complete Rural Adoption &amp; Fleet Command
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Engineered so that every stakeholder has their own dedicated environment—from marginal smallholders to state directorate commanders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Dashboard 1: Farmers (Users) */}
          <div
            onClick={() => { switchDemoRole('farmer'); setActiveView('farmer'); }}
            className="glass-card-hover rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/90 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                👨‍🌾
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">Dashboard 1</span>
                <h4 className="text-lg font-display font-bold text-white mt-0.5 group-hover:text-emerald-300 transition">
                  Farmers (Users)
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  For farmers booking spraying with instant radius cluster detection and subsidized ₹300/ac pricing.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800 pt-3">
                <li className="flex items-center"><span className="text-emerald-400 mr-2">✓</span> Smart Plot Booking</li>
                <li className="flex items-center"><span className="text-emerald-400 mr-2">✓</span> Save ₹100/ac Cluster Radar</li>
                <li className="flex items-center"><span className="text-emerald-400 mr-2">✓</span> Digital QR Spray Certificate</li>
              </ul>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition">
              <span>Open Farmer Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </div>

          {/* Dashboard 2: Drone Operators */}
          <div
            onClick={() => { switchDemoRole('operator'); setActiveView('operator'); }}
            className="glass-card-hover rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-slate-900/90 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                🛰️
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 tracking-wider">Dashboard 2</span>
                <h4 className="text-lg font-display font-bold text-white mt-0.5 group-hover:text-indigo-300 transition">
                  Drone Operators (Pilots)
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  For Drone Didis, CHCs and independent pilots. Route planning, 16,000mAh battery management, and motor diagnostics.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800 pt-3">
                <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Smart Route Planner</li>
                <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Battery Health &amp; Solar Van</li>
                <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> SVAMITVA Off-Season Tenders</li>
              </ul>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition">
              <span>Open Operator Command</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </div>

          {/* Dashboard 3: Village Panchayats */}
          <div
            onClick={() => { switchDemoRole('panchayat'); setActiveView('panchayat'); }}
            className="glass-card-hover rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900/90 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                🏛️
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-wider">Dashboard 3</span>
                <h4 className="text-lg font-display font-bold text-white mt-0.5 group-hover:text-amber-300 transition">
                  Panchayat (Offline Kiosk)
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  For Gram Panchayats &amp; CSCs assisting non-smartphone farmers with paper token slips and cash collection.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800 pt-3">
                <li className="flex items-center"><span className="text-amber-400 mr-2">✓</span> Assisted Kiosk Booking</li>
                <li className="flex items-center"><span className="text-amber-400 mr-2">✓</span> Printable Paper Spray Slips</li>
                <li className="flex items-center"><span className="text-amber-400 mr-2">✓</span> Village Pooling (₹300/ac)</li>
              </ul>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition">
              <span>Open Panchayat Kiosk</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </div>

          {/* Dashboard 4: National Admin Directorate */}
          <div
            onClick={() => { switchDemoRole('admin'); setActiveView('admin'); }}
            className="glass-card-hover rounded-2xl p-5 border border-sky-500/30 bg-gradient-to-b from-sky-950/20 to-slate-900/90 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                🛡️
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-sky-400 tracking-wider">Dashboard 4</span>
                <h4 className="text-lg font-display font-bold text-white mt-0.5 group-hover:text-sky-300 transition">
                  National Directorate (Admin)
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Central command for fleet asset registration, DGCA compliance roster, 28 states live GIS, and ROI tracking.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800 pt-3">
                <li className="flex items-center"><span className="text-sky-400 mr-2">✓</span> All 28 States &amp; UTs Live Radar</li>
                <li className="flex items-center"><span className="text-sky-400 mr-2">✓</span> DGCA Drone &amp; Pilot Registry</li>
                <li className="flex items-center"><span className="text-sky-400 mr-2">✓</span> Emergency Weather Airspace Lock</li>
              </ul>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-sky-400 group-hover:translate-x-1 transition">
              <span>Open Admin Directorate</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </div>

        </div>
      </section>

      {/* CORE 7-STEP DEMO FLOW PIPELINE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Flagship 7-Phase Flywheel</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                The 7-Step AgriDrone Hub Profitability Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Demonstrating that the platform makes existing agricultural drones fly more often and earn more rather than simply selling drones.
              </p>
            </div>

            <button
              onClick={onOpenDemoFlow}
              className="px-4 py-2.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 hover:bg-brand-500/30 text-xs font-bold transition flex items-center space-x-2 self-start md:self-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Launch Interactive Walkthrough</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 7 Interactive Flow Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
            
            {/* Step 1 */}
            <div
              onClick={onOpenDemoFlow}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-xs">👨‍🌾</span>
              </div>
              <strong className="text-white font-display text-xs block group-hover:text-emerald-400 transition">
                Farmer Requests Service
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Balwant logs 4 ac Paddy field. Solo estimate: ₹400/ac (₹1,600).
              </p>
            </div>

            {/* Step 2 */}
            <div
              onClick={onOpenDemoFlow}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-xs">📡</span>
              </div>
              <strong className="text-white font-display text-xs block group-hover:text-sky-400 transition">
                Nearby Requests Detected
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Spatial radar scans 3.5 km hub: finds Ramesh (2ac), Sunita (3ac), Kishan (3ac).
              </p>
            </div>

            {/* Step 3 */}
            <div
              onClick={onOpenDemoFlow}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">3</span>
                <span className="text-xs">🧩</span>
              </div>
              <strong className="text-white font-display text-xs block group-hover:text-emerald-400 transition">
                Farms Clustered into Hub
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                12-Ac Cluster HUB-ZN-101 formed. Price drops to ₹300/ac (-25% savings).
              </p>
            </div>

            {/* Step 4 */}
            <div
              onClick={onOpenDemoFlow}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">4</span>
                <span className="text-xs">🗺️</span>
              </div>
              <strong className="text-white font-display text-xs block group-hover:text-amber-400 transition">
                Route & Battery Optimized
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                4.8 km flight corridor (-66% transit). 1 Mobile Solar Van swap scheduled.
              </p>
            </div>

            {/* Step 5 */}
            <div
              onClick={onOpenDemoFlow}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">5</span>
                <span className="text-xs">✅</span>
              </div>
              <strong className="text-white font-display text-xs block group-hover:text-indigo-400 transition">
                Operator Accepts Cluster
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Drone Didi Kavita accepts dispatch. Revenue: ₹3,600, Net Profit: ₹2,640.
              </p>
            </div>

            {/* Step 6 */}
            <div
              onClick={onOpenDemoFlow}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">6</span>
                <span className="text-xs">🎯</span>
              </div>
              <strong className="text-white font-display text-xs block group-hover:text-emerald-400 transition">
                Jobs Completed & Telemetry
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                12 acres sprayed in 68 min. Utilisation hits 78.4%. Digital certificates issued.
              </p>
            </div>

            {/* Step 7 */}
            <div
              onClick={onOpenDemoFlow}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">7</span>
                <span className="text-xs">🛰️</span>
              </div>
              <strong className="text-white font-display text-xs block group-hover:text-purple-400 transition">
                Off-Season Jobs Unlocked
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                SVAMITVA land mapping (₹22,000 / 100 ac) bridges 7-month idle downtime.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PROMINENT INTERACTIVE 12-ACRE CLUSTER DEMO SECTION */}
      <ClusterDemoSection />

      {/* PROBLEM VS SOLUTION COMPARISON */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">The Ideathon Track 2 Opportunity</span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">Why Traditional Agri-Drones Struggle vs Our Solution</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-4">
            <span className="font-display font-bold text-rose-300 text-base flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 mr-2"></span>
              Current Traditional Broken Model
            </span>
            <ul className="space-y-2.5 text-slate-300 list-disc list-inside">
              <li><strong>Plot Fragmentation:</strong> Solo 1–2 acre bookings mean high road travel time and battery energy wasted in transit.</li>
              <li><strong>Price Resistance:</strong> Solo rate of ₹400–₹500/acre is too steep for marginal farmers.</li>
              <li><strong>7–8 Month Idle Time:</strong> Drones sit gathering dust after short 40-day spraying seasons.</li>
              <li><strong>Payback Period:</strong> 4.5 to 7.9 years to recover ₹8.5 Lakh drone capex.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-4">
            <span className="font-display font-bold text-emerald-300 text-base flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2"></span>
              AgriDrone Hub Platform Solution
            </span>
            <ul className="space-y-2.5 text-slate-300 list-disc list-inside">
              <li><strong>3–5 km Radius Hubs:</strong> Automatically pools neighboring plots into a contiguous corridor with 62% less transit.</li>
              <li><strong>Volume Discount:</strong> Price drops to ₹300/acre while daily pilot gross revenue surges 300%.</li>
              <li><strong>Off-Season Revenue Engine:</strong> Drones perform SVAMITVA land mapping & PMFBY crop loss audits at ₹150–₹220/ac.</li>
              <li><strong>Accelerated Payback:</strong> High utilization (218 days/yr) recoups investment in <strong>14.2 months</strong>.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* BENEFITS FOR FARMERS VS OPERATORS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="font-display font-bold text-lg text-white">Benefits for Smallholder Farmers</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> <strong>25% Lower Costs:</strong> Pay ₹300/acre instead of ₹400 solo rate when pooling with neighbors.</li>
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> <strong>Zero Chemical Exposure:</strong> Drone Didi pilot handles micro-droplet atomization without skin contact.</li>
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> <strong>90% Water Savings:</strong> Uses only 10 Liters/acre compared to 150–200 Liters with manual spray.</li>
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> <strong>Official Certification:</strong> Digital spray certificate with GPS geofence and QR code invoice.</li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-sky-400">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="font-display font-bold text-lg text-white">Benefits for SHGs & Drone Operators</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start"><span className="text-sky-400 mr-2">✓</span> <strong>3x Daily Acreage:</strong> Spray 28–35 acres/day through contiguous hub dispatch vs 8–10 solo acres.</li>
              <li className="flex items-start"><span className="text-sky-400 mr-2">✓</span> <strong>218 Operating Days:</strong> Year-round revenue diversification into institutional surveying contracts.</li>
              <li className="flex items-start"><span className="text-sky-400 mr-2">✓</span> <strong>Predictive Battery Health:</strong> Smart LiPo cycle tracking and mobile solar van swap coordination.</li>
              <li className="flex items-start"><span className="text-sky-400 mr-2">✓</span> <strong>Dignified Income:</strong> Drone Didi pilots earn ₹22,000–₹25,000/month in sustainable wages.</li>
            </ul>
          </div>

        </div>
      </section>

    </div>
  );
};
