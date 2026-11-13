import React, { useState } from 'react';
import { ClusterVisualizerMap } from './ClusterVisualizerMap';
import { api } from '../services/api';
import { Sparkles, CheckCircle2, ArrowRight, Zap, BatteryCharging, TrendingDown, DollarSign, MapPin, Layers } from 'lucide-react';

export const ClusterDemoSection = () => {
  const [farms, setFarms] = useState([
    { id: 1, name: 'Farm A (Ramesh Patel)', village: 'Rampur Kalan', acres: 2.0, crop: 'Paddy' },
    { id: 2, name: 'Farm B (Sunita Devi)', village: 'Malapur', acres: 3.0, crop: 'Paddy' },
    { id: 3, name: 'Farm C (Balwant Singh)', village: 'Khed', acres: 4.0, crop: 'Wheat' },
    { id: 4, name: 'Farm D (Kishan Verma)', village: 'Rampur Khurd', acres: 3.0, crop: 'Cotton' }
  ]);

  const [clusterResult, setClusterResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const runClustering = async () => {
    setLoading(true);
    try {
      const res = await api.clusters.autoCluster(farms);
      if (res.success) {
        setClusterResult(res.clusterDemo);
        setIsSimulated(true);
      }
    } catch (e) {
      // Fallback calculation
      const totalAcres = farms.reduce((s, f) => s + f.acres, 0);
      setClusterResult({
        title: `Smart Spatial Cluster: ${totalAcres} Acres (4 Farms Combined)`,
        hubZone: 'Zone North (3–5 km Radius Hub)',
        farmerCount: farms.length,
        totalAcreage: totalAcres,
        optimizedRoute: {
          sequence: [
            'Hub Base (Launch Point)',
            'Farm A (Ramesh - 2 ac)',
            'Farm B (Sunita - 3 ac)',
            'Mobile Solar Van (Battery Swap #1)',
            'Farm C (Balwant - 4 ac)',
            'Farm D (Kishan - 3 ac)',
            'Hub Base (Safe Return)'
          ],
          totalDistanceKm: 14.2,
          individualDistanceKm: 38.6,
          travelSavingsKm: 24.4,
          fuelSavedLiters: 5.8,
          estimatedFlightTimeMin: 68
        },
        batteryRequirements: {
          packsNeeded: 2,
          swapStopsCount: 1,
          estimatedDischargePct: 78,
          recommendation: 'Mobile Solar Van stationed at Waypoint 3 for rapid 2-minute battery exchange.'
        },
        pricing: {
          soloRateTotal: totalAcres * 400,
          clusteredRateTotal: totalAcres * 300,
          farmerSavingsTotal: totalAcres * 100,
          operatorRevenue: totalAcres * 300,
          operatorCost: Math.round(totalAcres * 55),
          estimatedProfit: (totalAcres * 300) - Math.round(totalAcres * 55),
          discountPercentage: '25% Cost Reduction for Farmers'
        }
      });
      setIsSimulated(true);
    } finally {
      setLoading(false);
    }
  };

  const totalAcres = farms.reduce((s, f) => s + f.acres, 0);

  return (
    <section id="cluster-demo-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Flagship Feature</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
          Create Smart Farm Cluster Demo
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          See how our spatial aggregation algorithm automatically combines fragmented plots (e.g. <strong className="text-white">2, 3, 4, and 3 acres</strong>) into an optimized <strong className="text-emerald-400">12-Acre Cluster</strong>, saving <strong className="text-emerald-400">₹1,200 for farmers</strong> and eliminating <strong className="text-amber-400">24.4 km of deadhead transit</strong>.
        </p>
      </div>

      {/* Main Demo Grid: Farms Input (Left 5 cols) & Optimized Cluster Results (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Sample Fragmented Farms List */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-display font-semibold text-lg text-white">4 Fragmented Smallholder Plots</h3>
              <p className="text-xs text-slate-400">Pre-loaded candidate plots within 3–5 km hub</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-emerald-400 font-bold text-xs">
              Total: {totalAcres} Acres
            </span>
          </div>

          {/* Farm Cards List */}
          <div className="space-y-3">
            {farms.map((f, idx) => (
              <div key={f.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-sm text-white block">{f.name}</strong>
                    <span className="text-xs text-slate-400">{f.village} · Crop: <span className="text-slate-300">{f.crop}</span></span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-400">{f.acres} Acres</span>
                  <div className="text-[10px] text-slate-500 line-through">₹{f.acres * 400} solo</div>
                </div>
              </div>
            ))}
          </div>

          {/* Run Clustering Action Button */}
          <button
            onClick={runClustering}
            disabled={loading}
            className="w-full py-4 px-5 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 shadow-xl shadow-brand-500/25 active:scale-[0.99] transition duration-150 flex items-center justify-center space-x-2 text-base cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2"></span>
                <span>Executing Nearest Neighbor Optimization...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Run Spatial Clustering Algorithm</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </>
            )}
          </button>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <span className="text-slate-300 font-bold block">💡 The Economics:</span>
            <p>
              In solo spraying, pilots spend up to 45% of battery power traveling between individual farms. Clustering 12 acres drops travel distance from 38.6 km down to 14.2 km.
            </p>
          </div>
        </div>

        {/* RIGHT: Interactive Optimized Cluster Results & Leaflet Map */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Route Visualizer Map */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-semibold text-white text-base">Contiguous 12-Acre Autopilot Route</h4>
                <p className="text-xs text-slate-400">Drone Base ➔ Farm A ➔ Farm B ➔ Solar Swap ➔ Farm C ➔ Farm D ➔ Base</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {clusterResult ? 'Optimized' : 'Ready to Run'}
              </span>
            </div>

            {/* Leaflet Map Container */}
            <div className="h-72 w-full">
              <ClusterVisualizerMap
                center={[26.8467, 80.9462]}
                zoom={13}
                hubRadiusKm={3.8}
              />
            </div>
          </div>

          {/* Optimization Metrics Breakdown Card */}
          {clusterResult ? (
            <div className="glass-card rounded-2xl p-6 border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-950/40 to-slate-900 shadow-2xl space-y-5 animate-scaleUp">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-500/30 pb-3 gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 uppercase tracking-wider">
                    🎉 Cluster Formed: 12.0 Acres
                  </span>
                  <h3 className="font-display font-bold text-xl text-white mt-1">
                    Price Dropped: ₹400/ac ➔ ₹300/acre
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Farmer Savings</span>
                  <strong className="text-2xl font-display font-bold text-emerald-400 font-mono">
                    ₹{clusterResult.pricing.farmerSavingsTotal} Saved
                  </strong>
                </div>
              </div>

              {/* 4-Stat Comparison Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Travel Distance</span>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    {clusterResult.optimizedRoute.totalDistanceKm} km
                  </div>
                  <span className="text-[10px] text-slate-400 line-through">Solo: {clusterResult.optimizedRoute.individualDistanceKm} km</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Travel Saved</span>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    ↓ {clusterResult.optimizedRoute.travelSavingsKm} km
                  </div>
                  <span className="text-[10px] text-emerald-300 font-semibold">{clusterResult.optimizedRoute.fuelSavedLiters} L Fuel Saved</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Flight Time</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {clusterResult.optimizedRoute.estimatedFlightTimeMin} Mins
                  </div>
                  <span className="text-[10px] text-slate-400">10-L High Speed Raster</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Battery Packs</span>
                  <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                    {clusterResult.batteryRequirements.packsNeeded} LiPo Packs
                  </div>
                  <span className="text-[10px] text-slate-400">1 Mobile Solar Swap</span>
                </div>

              </div>

              {/* Financial Surplus Card */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block font-sans">Operator Net Earnings on this 12-Acre Mission:</span>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">
                    ₹{clusterResult.pricing.estimatedProfit} Net Profit
                  </div>
                  <span className="text-slate-400 font-sans text-[11px]">Gross Revenue: ₹{clusterResult.pricing.operatorRevenue} · OpEx: ₹{clusterResult.pricing.operatorCost}</span>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-sans font-bold">
                    82% Operating Profit Margin
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 text-center space-y-2 text-slate-400 py-10">
              <Layers className="w-10 h-10 text-emerald-500/40 mx-auto animate-pulse" />
              <h4 className="text-white font-semibold">Algorithm Ready to Execute</h4>
              <p className="text-xs max-w-md mx-auto">
                Click "Run Spatial Clustering Algorithm" above to watch the 4 fragmented farms combine into an optimized 12-acre flight plan with dynamic per-acre discounts.
              </p>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
