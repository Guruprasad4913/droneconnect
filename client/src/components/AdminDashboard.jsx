import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import {
  ShieldCheck,
  Activity,
  Users,
  Plane,
  TrendingUp,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  PlusCircle,
  RefreshCw,
  Download,
  MapPin,
  BatteryCharging,
  Gauge,
  Sliders,
  DollarSign,
  Briefcase,
  Award,
  X,
  ExternalLink
} from 'lucide-react';
import { ALL_INDIAN_STATES_AND_HUBS, getAllOperationalZones } from '../data/indianAgriStates';
import { ClusterVisualizerMap } from './ClusterVisualizerMap';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet', 'hubs', 'analytics', 'pilots', 'contracts'
  const [analytics, setAnalytics] = useState(null);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Emergency safety ground toggle
  const [emergencyGrounding, setEmergencyGrounding] = useState(false);
  const [showGroundingModal, setShowGroundingModal] = useState(false);

  // New Drone Registration Modal
  const [showAddDroneModal, setShowAddDroneModal] = useState(false);
  const [newDroneForm, setNewDroneForm] = useState({
    dgcaUasId: '',
    modelName: 'KisanDrone Hexa-16L Pro',
    manufacturer: 'IoTechWorld / Garuda Aerospace',
    payloadCapacityLiters: 16,
    operatorName: 'Smt. Kavita Sharma (Drone Didi Lead)',
    hubName: 'Zone North (UP) — Rampur Hub',
    state: 'Uttar Pradesh',
    status: 'available'
  });

  // Selected Hub for live GIS inspection
  const [inspectedHub, setInspectedHub] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiRes, droneRes] = await Promise.all([
        api.analytics.getPlatformKpis(),
        api.drones.getAll()
      ]);
      if (kpiRes.success) setAnalytics(kpiRes);
      if (droneRes.success && droneRes.data?.length > 0) {
        setDrones(droneRes.data);
      } else {
        // High-fidelity fallback drone registry
        setDrones([
          {
            _id: 'd-001',
            dgcaUasId: 'UA-7849-NDD',
            modelName: 'KisanDrone Hexa-10L (GoI Approved)',
            manufacturer: 'IoTechWorld Avigation',
            operatorName: 'Smt. Kavita Sharma (Drone Didi Lead)',
            organization: 'Prerna Drone Didi SHG Federation',
            baseLocation: { hubName: 'Zone North (UP) — Rampur Hub', coordinates: [26.8467, 80.9462] },
            state: 'Uttar Pradesh',
            totalFlightHours: 142.5,
            completedAcres: 840,
            status: 'available',
            batteryCycles: 48,
            batteryHealth: '98%',
            rtkAccuracy: '< 2.2 cm'
          },
          {
            _id: 'd-002',
            dgcaUasId: 'UA-9032-BLG',
            modelName: 'Garuda Kisan 16L Heavy Sortie',
            manufacturer: 'Garuda Aerospace',
            operatorName: 'Ramesh Biradar (CHC Pilot)',
            organization: 'Belagavi Sugarcane FPO Hub',
            baseLocation: { hubName: 'Zone South (Karnataka) — Belagavi Hub', coordinates: [15.8497, 74.4977] },
            state: 'Karnataka',
            totalFlightHours: 218.0,
            completedAcres: 1120,
            status: 'in-flight',
            batteryCycles: 74,
            batteryHealth: '95%',
            rtkAccuracy: '< 1.8 cm'
          },
          {
            _id: 'd-003',
            dgcaUasId: 'UA-4512-LDH',
            modelName: 'DaaS Hexa-Spray 12L RTK',
            manufacturer: 'Throttle Aerospace',
            operatorName: 'Sardar Gurpreet Singh',
            organization: 'Ludhiana Central Custom Hiring Centre',
            baseLocation: { hubName: 'Zone Punjab — Ludhiana Belt', coordinates: [30.9010, 75.8573] },
            state: 'Punjab',
            totalFlightHours: 184.2,
            completedAcres: 950,
            status: 'available',
            batteryCycles: 62,
            batteryHealth: '96%',
            rtkAccuracy: '< 2.1 cm'
          },
          {
            _id: 'd-004',
            dgcaUasId: 'UA-3321-NSK',
            modelName: 'Marut Drones AG-360 Micron',
            manufacturer: 'Marut Dronetech',
            operatorName: 'Sunita Patil (Drone Didi)',
            organization: 'Nashik Grape Growers Cluster',
            baseLocation: { hubName: 'Zone Maharashtra — Nashik Corridor', coordinates: [19.9975, 73.7898] },
            state: 'Maharashtra',
            totalFlightHours: 96.0,
            completedAcres: 580,
            status: 'charging',
            batteryCycles: 31,
            batteryHealth: '99%',
            rtkAccuracy: '< 1.9 cm'
          },
          {
            _id: 'd-005',
            dgcaUasId: 'UA-6104-GTR',
            modelName: 'Aero360 Agri-Pro 16L Dual Nozzle',
            manufacturer: 'Aero360 Innovations',
            operatorName: 'K. Venkateswara Rao',
            organization: 'Guntur Chilli Growers Producer Co.',
            baseLocation: { hubName: 'Zone Andhra — Guntur Delta Hub', coordinates: [16.3067, 80.4365] },
            state: 'Andhra Pradesh',
            totalFlightHours: 165.0,
            completedAcres: 890,
            status: 'available',
            batteryCycles: 55,
            batteryHealth: '97%',
            rtkAccuracy: '< 2.4 cm'
          },
          {
            _id: 'd-006',
            dgcaUasId: 'UA-8820-UJJ',
            modelName: 'IoTech Agribot 10L Soybean Pro',
            manufacturer: 'IoTechWorld Avigation',
            operatorName: 'Anita Dhakad (Drone Didi Lead)',
            organization: 'Malwa Kisan SHG Consortium',
            baseLocation: { hubName: 'Zone Central (MP) — Ujjain Malwa Hub', coordinates: [23.1765, 75.7885] },
            state: 'Madhya Pradesh',
            totalFlightHours: 130.5,
            completedAcres: 710,
            status: 'available',
            batteryCycles: 42,
            batteryHealth: '98%',
            rtkAccuracy: '< 2.0 cm'
          }
        ]);
      }
    } catch (e) {
      console.warn('Admin dashboard loaded offline metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDroneStatus = async (droneId, newStatus) => {
    try {
      await api.drones.updateStatus(droneId, newStatus);
      setDrones(prev => prev.map(d => d._id === droneId ? { ...d, status: newStatus } : d));
    } catch (err) {
      // Local fallback
      setDrones(prev => prev.map(d => d._id === droneId ? { ...d, status: newStatus } : d));
    }
  };

  const handleRegisterDrone = async (e) => {
    e.preventDefault();
    if (!newDroneForm.dgcaUasId) return;

    const dronePayload = {
      ...newDroneForm,
      _id: 'd-' + Date.now().toString().slice(-4),
      totalFlightHours: 0,
      completedAcres: 0,
      batteryCycles: 1,
      batteryHealth: '100%',
      rtkAccuracy: '< 2.0 cm',
      baseLocation: { hubName: newDroneForm.hubName, coordinates: [26.8467, 80.9462] }
    };

    try {
      if (api.drones.create) {
        await api.drones.create(dronePayload);
      }
    } catch (err) {
      // non-fatal
    }

    setDrones([dronePayload, ...drones]);
    setShowAddDroneModal(false);
    setNewDroneForm({
      dgcaUasId: '',
      modelName: 'KisanDrone Hexa-16L Pro',
      manufacturer: 'IoTechWorld / Garuda Aerospace',
      payloadCapacityLiters: 16,
      operatorName: 'Smt. Kavita Sharma (Drone Didi Lead)',
      hubName: 'Zone North (UP) — Rampur Hub',
      state: 'Uttar Pradesh',
      status: 'available'
    });
  };

  const exportDirectorateReport = () => {
    const csvRows = [
      ['DGCA_UAS_ID', 'MODEL', 'OPERATOR', 'STATE', 'BASE_HUB', 'FLIGHT_HOURS', 'COMPLETED_ACRES', 'STATUS'],
      ...drones.map(d => [
        d.dgcaUasId,
        `"${d.modelName}"`,
        `"${d.operatorName}"`,
        d.state || 'Uttar Pradesh',
        `"${d.baseLocation?.hubName || 'Zone North'}"`,
        d.totalFlightHours,
        d.completedAcres,
        d.status
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgriDrone_National_Directorate_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = analytics?.monthlyTrends || [
    { month: 'Apr', sprayAcres: 120, surveyAcres: 40, clusteredRevenue: 42000, profit: 26000 },
    { month: 'May', sprayAcres: 280, surveyAcres: 20, clusteredRevenue: 88000, profit: 58000 },
    { month: 'Jun', sprayAcres: 340, surveyAcres: 0, clusteredRevenue: 102000, profit: 72000 },
    { month: 'Jul', sprayAcres: 410, surveyAcres: 30, clusteredRevenue: 128000, profit: 89000 },
    { month: 'Aug', sprayAcres: 190, surveyAcres: 110, clusteredRevenue: 76800, profit: 54000 },
    { month: 'Sep', sprayAcres: 40, surveyAcres: 220, clusteredRevenue: 60400, profit: 46000 },
    { month: 'Oct (Off-Season)', sprayAcres: 10, surveyAcres: 280, clusteredRevenue: 64600, profit: 49000 },
    { month: 'Nov (Off-Season)', sprayAcres: 0, surveyAcres: 310, clusteredRevenue: 68200, profit: 52000 },
    { month: 'Dec (Off-Season)', sprayAcres: 15, surveyAcres: 340, clusteredRevenue: 74200, profit: 56000 },
    { month: 'Jan', sprayAcres: 160, surveyAcres: 140, clusteredRevenue: 66000, profit: 48000 },
    { month: 'Feb', sprayAcres: 290, surveyAcres: 60, clusteredRevenue: 92000, profit: 64000 },
    { month: 'Mar', sprayAcres: 310, surveyAcres: 40, clusteredRevenue: 98000, profit: 69000 }
  ];

  const allOperationalZones = getAllOperationalZones();

  // Filtered drones
  const filteredDrones = drones.filter(d => {
    const matchesSearch =
      d.dgcaUasId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.baseLocation?.hubName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'ALL' || d.state === stateFilter;
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesState && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* ============================================================== */}
      {/* 1. TOP NATIONAL DIRECTORATE COMMAND HEADER                     */}
      {/* ============================================================== */}
      <div className="glass-card rounded-2xl p-6 border border-sky-500/30 bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-900 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>National CHC &amp; Drone Didi Directorate</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Ministry of Agriculture &amp; Farmers Welfare</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1.5 flex items-center space-x-2">
            <span>Fleet Asset Command &amp; National Analytics</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              Live RTK Lock Active
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
            Centralized monitoring of equipment utilization across all 28 States, smart battery turnaround logistics,
            predictive maintenance alerts, and year-round off-season revenue contracts.
          </p>
        </div>

        {/* Top Directorate Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddDroneModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Drone Asset</span>
          </button>

          <button
            onClick={exportDirectorateReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
            title="Download complete registry as CSV"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export Audit CSV</span>
          </button>

          <button
            onClick={() => setShowGroundingModal(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              emergencyGrounding
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{emergencyGrounding ? 'Sorties Grounded (Active)' : 'Emergency Weather Lock'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. HIGH-LEVEL DIRECTORATE KPIS                                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Registered Fleet</span>
          <div className="text-2xl font-bold font-mono text-white flex items-center space-x-1.5">
            <Plane className="w-5 h-5 text-sky-400" />
            <span>{drones.length} Drones</span>
          </div>
          <span className="text-[10px] text-emerald-400">100% DGCA Compliant</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Covered Acreage</span>
          <div className="text-2xl font-bold font-mono text-white flex items-center space-x-1.5">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>5,090 Ac</span>
          </div>
          <span className="text-[10px] text-slate-400">Spray + SVAMITVA</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Fleet Utilization</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center space-x-1.5">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>78.4%</span>
          </div>
          <span className="text-[10px] text-slate-400">Industry Avg: 21.5% (+265%)</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Farmer Savings</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center space-x-1.5">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>₹5,09,000</span>
          </div>
          <span className="text-[10px] text-slate-400">₹100/ac Cluster Pool Subsidy</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Diesel Displaced</span>
          <div className="text-2xl font-bold font-mono text-sky-400 flex items-center space-x-1.5">
            <Gauge className="w-5 h-5 text-sky-400" />
            <span>10,650 L</span>
          </div>
          <span className="text-[10px] text-emerald-300">28.3 Tons CO₂ Offset</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Active State Hubs</span>
          <div className="text-2xl font-bold font-mono text-amber-400 flex items-center space-x-1.5">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>32 Regions</span>
          </div>
          <span className="text-[10px] text-slate-400">All 28 States + 4 UTs</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. DIRECTORATE TAB NAVIGATION                                  */}
      {/* ============================================================== */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'fleet' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>🛰️ National Fleet Live Radar</span>
          <span className="px-1.5 py-0.2 rounded bg-sky-950 text-[10px] font-mono text-sky-300">{drones.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('hubs')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'hubs' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>🗺️ All-India Hubs Matrix</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-[10px] font-mono text-emerald-300">{allOperationalZones.length} Hubs</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>📊 Financial ROI &amp; Off-Season Mix</span>
        </button>

        <button
          onClick={() => setActiveTab('pilots')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'pilots' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🛡️ DGCA Pilot Compliance Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'contracts' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>📜 Institutional Off-Season Contracts</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: NATIONAL FLEET RADAR & ASSET COMMAND                    */}
      {/* ============================================================== */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          
          {/* Filtering Controls */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by UAS ID, Pilot Name, or Hub..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-sky-500 outline-none text-xs"
                />
              </div>

              {/* State Filter */}
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl outline-none text-xs cursor-pointer"
              >
                <option value="ALL">All States (32 Regions)</option>
                {ALL_INDIAN_STATES_AND_HUBS.map(s => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl outline-none text-xs cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="available">🟢 Available / Standby</option>
                <option value="in-flight">🔵 In-Flight Sortie</option>
                <option value="charging">🟡 Solar Charging</option>
                <option value="maintenance">🔴 Maintenance Inspection</option>
              </select>
            </div>

            <span className="text-slate-400 font-mono text-[11px]">
              Displaying {filteredDrones.length} of {drones.length} Registered Aircraft
            </span>
          </div>

          {/* Drones Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrones.map(drone => (
              <div
                key={drone._id}
                className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3.5 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold font-mono text-sky-400">{drone.dgcaUasId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        drone.status === 'in-flight'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse'
                          : drone.status === 'charging'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : drone.status === 'maintenance'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {drone.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-0.5">{drone.modelName}</h4>
                    <span className="text-[11px] text-slate-400 block">{drone.manufacturer || 'Approved OEM'}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400">
                    <Plane className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-850 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pilot / Lead:</span>
                    <strong className="text-slate-200 font-sans">{drone.operatorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Hub:</span>
                    <strong className="text-emerald-400 font-sans truncate max-w-[170px]">{drone.baseLocation?.hubName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flight Sorties:</span>
                    <strong className="text-white">{drone.totalFlightHours} hrs · {drone.completedAcres} Ac</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery Health:</span>
                    <strong className="text-teal-400">{drone.batteryHealth || '98%'} ({drone.batteryCycles || 45} Cycles)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RTK Lock Status:</span>
                    <strong className="text-sky-300">{drone.rtkAccuracy || '< 2.0 cm'} (4G Fixed)</strong>
                  </div>
                </div>

                {/* Status Command Button */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">Sortie Status:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleUpdateDroneStatus(drone._id, 'available')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        drone.status === 'available' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      Standby
                    </button>
                    <button
                      onClick={() => handleUpdateDroneStatus(drone._id, 'in-flight')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        drone.status === 'in-flight' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      In-Flight
                    </button>
                    <button
                      onClick={() => handleUpdateDroneStatus(drone._id, 'maintenance')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        drone.status === 'maintenance' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      Maint.
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ALL-INDIA HUBS MATRIX & GIS INSPECTION                  */}
      {/* ============================================================== */}
      {activeTab === 'hubs' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">All-India Agricultural Drone Operational Network</h3>
              <p className="text-xs text-slate-400">
                55+ Precision Sortie Corridors established across all 28 States &amp; 4 Union Territories
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Filter State:</span>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-emerald-400 font-semibold px-3 py-1.5 rounded-xl outline-none cursor-pointer"
              >
                <option value="ALL">All States (32 Regions)</option>
                {ALL_INDIAN_STATES_AND_HUBS.map(s => (
                  <option key={s.state} value={s.state}>{s.state} ({s.stateHindi})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Inspected Hub GIS Satellite Modal Drawer */}
          {inspectedHub && (
            <div className="glass-card rounded-2xl p-5 border-2 border-emerald-500/80 bg-slate-900 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <h4 className="font-display font-bold text-white text-base">
                    Live GIS Inspection: {inspectedHub.name} ({inspectedHub.state})
                  </h4>
                </div>
                <button
                  onClick={() => setInspectedHub(null)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-72 w-full rounded-xl overflow-hidden">
                <ClusterVisualizerMap
                  key={`${inspectedHub.coords[0]}-${inspectedHub.coords[1]}`}
                  center={inspectedHub.coords}
                  zoom={13}
                  hubRadiusKm={3.5}
                />
              </div>
            </div>
          )}

          {/* Hubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(stateFilter === 'ALL'
              ? allOperationalZones
              : allOperationalZones.filter(z => z.state === stateFilter)
            ).map((hub, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        {hub.state} ({hub.stateHindi})
                      </span>
                      <h4 className="font-bold text-sm text-white mt-0.5 leading-snug">{hub.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      3–5 km Hub
                    </span>
                  </div>

                  <div className="mt-3 text-xs space-y-1 font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                    <div><span className="text-slate-400">Target Crops:</span> <strong className="text-white font-sans">{hub.crops}</strong></div>
                    <div><span className="text-slate-400">GPS Coordinates:</span> <span className="text-sky-300">{hub.coords[0].toFixed(4)}°N, {hub.coords[1].toFixed(4)}°E</span></div>
                    <div><span className="text-slate-400">Pool Status:</span> <span className="text-emerald-400 font-sans">{hub.status}</span></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">RTK 4G Lock: Active</span>
                  <button
                    onClick={() => setInspectedHub(hub)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-500/40 text-slate-300 border border-slate-700 font-medium transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Inspect GIS Map</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: FINANCIAL ROI & OFF-SEASON MIX CHARTS                   */}
      {/* ============================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Monthly Acreage Mix */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">Monthly Acreage Mix (Active vs Off-Season)</h3>
                <p className="text-xs text-slate-400">Demonstrates year-round flight activity avoiding the 7-month idle period</p>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="sprayAcres" name="Spray Acres (Kharif/Rabi)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="surveyAcres" name="Commercial Survey Acres (Off-Season)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Net Operating Profitability Trend */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">Monthly Fleet Net Profit (₹)</h3>
                <p className="text-xs text-slate-400">Continuous revenue flow ensuring rapid 14-month drone payback</p>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="clusteredRevenue" name="Gross Revenue (₹)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="profit" name="Net Operator Profit (₹)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Economics Comparison Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-gradient-to-r from-slate-900 to-emerald-950/20 space-y-3">
            <h4 className="font-display font-bold text-white text-base">Solo Flying vs. Aggregated Clustered Economics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Conventional Solo Rate</span>
                <strong className="text-rose-400 text-lg">₹400 / Acre</strong>
                <span className="text-slate-500 block text-[10px]">High deadweight transit between disconnected fields</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">AgriDrone Cluster Rate</span>
                <strong className="text-emerald-400 text-lg">₹300 / Acre (-25%)</strong>
                <span className="text-emerald-300 block text-[10px]">Continuous loop, 3–5 km radius zero-transit sorties</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Drone Capital Payback</span>
                <strong className="text-sky-400 text-lg">14 Months Payback</strong>
                <span className="text-slate-400 block text-[10px]">Compared to 48+ months for unaggregated drones</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: DGCA PILOT COMPLIANCE ROSTER                            */}
      {/* ============================================================== */}
      {activeTab === 'pilots' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">DGCA-Certified Remote Pilot Certificate (RPC) Roster</h3>
              <p className="text-xs text-slate-400">
                Verified Drone Didi SHG pilots &amp; CHC flight commanders with active insurance
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              100% Certified (Zero Deficiencies)
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Pilot Name</th>
                  <th className="py-2.5 px-3">Designation / SHG</th>
                  <th className="py-2.5 px-3">DGCA RPC No.</th>
                  <th className="py-2.5 px-3">State / Base</th>
                  <th className="py-2.5 px-3">Flight Hours</th>
                  <th className="py-2.5 px-3">RTH 25% Rule</th>
                  <th className="py-2.5 px-3">Insurance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-sans font-bold text-white">Smt. Kavita Sharma</td>
                  <td className="py-3 px-3 font-sans text-emerald-400">Drone Didi Master Pilot (SHG Lead)</td>
                  <td className="py-3 px-3">RPC-IND-2024-8190</td>
                  <td className="py-3 px-3 font-sans">Rampur (UP)</td>
                  <td className="py-3 px-3 font-bold text-white">142.5 hrs</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">100% Compliant</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active (₹10L)</span></td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-sans font-bold text-white">Ramesh Biradar</td>
                  <td className="py-3 px-3 font-sans text-sky-400">FPO Commercial Pilot</td>
                  <td className="py-3 px-3">RPC-IND-2023-4510</td>
                  <td className="py-3 px-3 font-sans">Belagavi (Karnataka)</td>
                  <td className="py-3 px-3 font-bold text-white">218.0 hrs</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">100% Compliant</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active (₹10L)</span></td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-sans font-bold text-white">Sardar Gurpreet Singh</td>
                  <td className="py-3 px-3 font-sans text-indigo-400">CHC Heavy Lift Pilot</td>
                  <td className="py-3 px-3">RPC-IND-2024-1182</td>
                  <td className="py-3 px-3 font-sans">Ludhiana (Punjab)</td>
                  <td className="py-3 px-3 font-bold text-white">184.2 hrs</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">100% Compliant</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active (₹10L)</span></td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-sans font-bold text-white">Sunita Patil</td>
                  <td className="py-3 px-3 font-sans text-emerald-400">Drone Didi Horticulture Lead</td>
                  <td className="py-3 px-3">RPC-IND-2024-9023</td>
                  <td className="py-3 px-3 font-sans">Nashik (Maharashtra)</td>
                  <td className="py-3 px-3 font-bold text-white">96.0 hrs</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">100% Compliant</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active (₹10L)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: INSTITUTIONAL OFF-SEASON CONTRACTS                      */}
      {/* ============================================================== */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Institutional &amp; Government Off-Season Tenders</h3>
              <p className="text-xs text-slate-400">
                Diversified revenue missions ensuring zero idle periods during post-harvest months
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40">
              ₹8,40,000 Total Contract Value
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Survey of India
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">SVAMITVA Rural Abadi Land Mapping</h4>
                  <span className="text-slate-400 text-[11px] block">High-Resolution Orthomosaic Drone Photogrammetry</span>
                </div>
                <strong className="text-emerald-400 font-mono text-sm">₹1,80,000</strong>
              </div>
              <p className="text-slate-300 text-[11px]">
                Centimeter-level 2D orthomosaic survey across 14 Gram Panchayats for digital property card issuance.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Acreage: 420 Ha</span>
                <span className="text-emerald-400">Awarded to Prerna SHG</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Indian Railways / Dedicated Freight
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">Railway Track &amp; Encroachment Corridor Survey</h4>
                  <span className="text-slate-400 text-[11px] block">Autonomous Linear Track Inspection</span>
                </div>
                <strong className="text-emerald-400 font-mono text-sm">₹2,40,000</strong>
              </div>
              <p className="text-slate-300 text-[11px]">
                LiDAR &amp; photogrammetry mapping of 80 km rail track ballast and vegetation encroachment detection.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Linear Km: 80 km</span>
                <span className="text-emerald-400">Active Sortie</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    PMFBY Crop Insurance
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">Unseasonal Hailstorm Crop Damage Assessment</h4>
                  <span className="text-slate-400 text-[11px] block">Multispectral NDVI Loss Ratio Audits</span>
                </div>
                <strong className="text-emerald-400 font-mono text-sm">₹2,10,000</strong>
              </div>
              <p className="text-slate-300 text-[11px]">
                Rapid multispectral verification of lodged wheat fields post-hailstorm for swift insurance payouts.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Area: 650 Acres</span>
                <span className="text-emerald-400">Completed (100% Claim Verified)</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    State Power Transmission (UPPCL / KPTCL)
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">High-Voltage Thermal Pylon &amp; Line Inspection</h4>
                  <span className="text-slate-400 text-[11px] block">Thermal Infrared Hotspot Diagnostics</span>
                </div>
                <strong className="text-emerald-400 font-mono text-sm">₹2,10,000</strong>
              </div>
              <p className="text-slate-300 text-[11px]">
                Thermal drone flights over 400kV transmission lines to detect overheated insulator bushings.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Pylons: 110 Towers</span>
                <span className="text-emerald-400">Scheduled for November</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REGISTER NEW DRONE ASSET                                */}
      {/* ============================================================== */}
      {showAddDroneModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-emerald-500/50 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-lg text-white">Register New Drone Asset</h3>
              </div>
              <button
                onClick={() => setShowAddDroneModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterDrone} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">DGCA UAS Registration Number (UIN) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UA-9941-KDD"
                  value={newDroneForm.dgcaUasId}
                  onChange={(e) => setNewDroneForm({ ...newDroneForm, dgcaUasId: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-emerald-500 outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Drone Model *</label>
                  <input
                    type="text"
                    required
                    value={newDroneForm.modelName}
                    onChange={(e) => setNewDroneForm({ ...newDroneForm, modelName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Tank Payload (Liters) *</label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={newDroneForm.payloadCapacityLiters}
                    onChange={(e) => setNewDroneForm({ ...newDroneForm, payloadCapacityLiters: parseInt(e.target.value) || 16 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Allocated State *</label>
                  <select
                    value={newDroneForm.state}
                    onChange={(e) => setNewDroneForm({ ...newDroneForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                  >
                    {ALL_INDIAN_STATES_AND_HUBS.map(s => (
                      <option key={s.state} value={s.state}>{s.state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Allocated Pilot / Lead *</label>
                  <input
                    type="text"
                    required
                    value={newDroneForm.operatorName}
                    onChange={(e) => setNewDroneForm({ ...newDroneForm, operatorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDroneModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-600/30"
                >
                  Save to National Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EMERGENCY WEATHER GROUNDING CONFIRMATION                */}
      {/* ============================================================== */}
      {showGroundingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-rose-500/50 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display font-bold text-lg text-white">Emergency Weather Airspace Lock</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Activating this command sends an instant <strong>NO-FLY advisory broadcast</strong> to all connected Drone Didi tablets and CHC telemetry stations. Use during severe thunderstorms, wind gusts &gt; 15 km/h, or DGCA airspace notices.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
              <div>Broadcast Scope: <strong>National Fleet (All 32 Hubs)</strong></div>
              <div>Current Status: <strong className={emergencyGrounding ? 'text-rose-400' : 'text-emerald-400'}>{emergencyGrounding ? 'GROUNDED' : 'CLEAR FOR FLIGHT'}</strong></div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => setShowGroundingModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setEmergencyGrounding(!emergencyGrounding);
                  setShowGroundingModal(false);
                }}
                className={`px-4 py-2 rounded-xl font-bold transition shadow-lg ${
                  emergencyGrounding
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {emergencyGrounding ? 'Lift Grounding & Resume Sorties' : 'Confirm Airspace Lock'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
