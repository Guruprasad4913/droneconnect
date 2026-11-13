import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Building2,
  Users,
  Printer,
  PhoneOff,
  PhoneCall,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  DollarSign,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Layers,
  MapPin,
  X
} from 'lucide-react';
import { MessageSentPopup } from './MessageSentPopup';
import { ALL_INDIAN_STATES_AND_HUBS as INDIAN_AGRI_STATES_AND_HUBS } from '../data/indianAgriStates';
import { emitRealtimeEvent, subscribeToRealtimeEvents } from '../services/realtimeEvents';

export const PanchayatDashboard = () => {
  const { user } = useAuth();

  const [assistedBookings, setAssistedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);
  const [selectedSlipBooking, setSelectedSlipBooking] = useState(null);
  const [showSentPopup, setShowSentPopup] = useState(false);
  const [sentPopupData, setSentPopupData] = useState(null);
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');

  // Form for offline non-smartphone farmer entry
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerPhone: '',
    aadhaarLast4: '',
    khasraNumber: '',
    village: user?.village || 'Rampur Kalan',
    state: 'Uttar Pradesh',
    zone: 'Zone North',
    crop: 'Paddy (Rice)',
    acreage: 2.0,
    serviceRequired: 'nano-urea-spray',
    chemicalType: 'IFFCO Nano Urea & DAP',
    cashPaymentCollected: true,
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  // Custom Crop & Custom Chemical states ("Others" option)
  const [isCustomCrop, setIsCustomCrop] = useState(false);
  const [customCrop, setCustomCrop] = useState('');
  const [isCustomChemical, setIsCustomChemical] = useState(false);
  const [customChemical, setCustomChemical] = useState('');

  useEffect(() => {
    loadVillageBookings();

    const unsubscribe = subscribeToRealtimeEvents({
      agridrone_booking_accepted: () => {
        loadVillageBookings();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadVillageBookings = async () => {
    try {
      const res = await api.bookings.getPanchayatVillage(user?.village || 'Rampur Kalan');
      if (res.success && res.data.length > 0) {
        setAssistedBookings(res.data);
      } else {
        // Fallback realistic assisted farmers
        setAssistedBookings([
          {
            _id: 'b-ast-01',
            paperTokenSlip: 'GP-RAMPUR-2026-089',
            farmerName: 'Ramdhani Yadav',
            farmerPhone: '+91 98390 12345',
            aadhaarLast4: '7104',
            khasraNumber: '142/3 (Purva Tola)',
            village: 'Rampur Kalan',
            crop: 'Paddy (Rice)',
            acreage: 2.0,
            pricing: { totalCost: 600, actualRateApplied: 300, savingsAmount: 200 },
            cashPaymentCollected: true,
            status: 'clustered',
            serviceRequired: 'nano-urea-spray',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            _id: 'b-ast-02',
            paperTokenSlip: 'GP-RAMPUR-2026-090',
            farmerName: 'Smt. Shanti Devi (Widow Farmer)',
            farmerPhone: '+91 97920 67891',
            aadhaarLast4: '3819',
            khasraNumber: '98/1 (Nadi Kinare)',
            village: 'Rampur Kalan',
            crop: 'Paddy (Rice)',
            acreage: 1.5,
            pricing: { totalCost: 450, actualRateApplied: 300, savingsAmount: 150 },
            cashPaymentCollected: true,
            status: 'clustered',
            serviceRequired: 'bio-fungicide',
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
          },
          {
            _id: 'b-ast-03',
            paperTokenSlip: 'GP-RAMPUR-2026-091',
            farmerName: 'Chhote Lal Maurya',
            farmerPhone: '+91 94155 33441',
            aadhaarLast4: '5562',
            khasraNumber: '210/4 (Dakshin Bhag)',
            village: 'Rampur Kalan',
            crop: 'Paddy (Rice)',
            acreage: 3.0,
            pricing: { totalCost: 900, actualRateApplied: 300, savingsAmount: 300 },
            cashPaymentCollected: true,
            status: 'clustered',
            serviceRequired: 'nano-urea-spray',
            createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
          }
        ]);
      }
    } catch (err) {
      console.warn('Panchayat offline mode fallback loaded');
    }
  };

  const handleAssistedSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farmerName || !formData.khasraNumber) {
      alert('Please enter Farmer Name and Khasra/Land record number.');
      return;
    }

    setLoading(true);
    const finalCrop = isCustomCrop && customCrop.trim() ? customCrop.trim() : formData.crop;
    const finalChemical = isCustomChemical && customChemical.trim() ? customChemical.trim() : formData.chemicalType;
    const payload = {
      ...formData,
      crop: finalCrop,
      chemicalType: finalChemical,
      serviceRequired: finalChemical
    };

    try {
      const res = await api.bookings.panchayatAssist(payload);
      if (res.success) {
        setSuccessNotice(res);
        setSelectedSlipBooking(res.data);
        loadVillageBookings();
        emitRealtimeEvent('agridrone_booking_created', res.data);

        // Pop-up notification: Message Sent!
        setSentPopupData({
          farmerName: payload.farmerName,
          acreage: payload.acreage,
          crop: payload.crop,
          village: payload.village || 'Rampur Kalan',
          zone: payload.zone || 'Zone North',
          recipientOperator: 'Smt. Kavita Sharma (Drone Didi Lead)',
          totalCost: res.data?.pricing?.totalCost || (payload.acreage * 300)
        });
        setShowSentPopup(true);

        // Reset form
        setFormData({
          ...formData,
          farmerName: '',
          farmerPhone: '',
          aadhaarLast4: '',
          khasraNumber: '',
          acreage: 2.0
        });
      }
    } catch (err) {
      // Local fallback creation
      const token = `GP-RAMPUR-${Date.now().toString().slice(-4)}`;
      const cost = payload.acreage * 300;
      const newBooking = {
        _id: 'b-local-' + Date.now(),
        paperTokenSlip: token,
        farmerName: payload.farmerName,
        farmerPhone: payload.farmerPhone || '+91 98765 00000',
        aadhaarLast4: payload.aadhaarLast4 || '0000',
        khasraNumber: payload.khasraNumber,
        village: payload.village,
        crop: payload.crop,
        acreage: payload.acreage,
        pricing: { totalCost: cost, actualRateApplied: 300, savingsAmount: payload.acreage * 100 },
        cashPaymentCollected: payload.cashPaymentCollected,
        status: 'clustered',
        serviceRequired: payload.serviceRequired,
        createdAt: new Date().toISOString()
      };

      const smsSimulated = `[ग्राम पंचायत कृषि सेवा] प्रिय ${payload.farmerName}, आपकी ${payload.acreage} एकड़ खेत (खसरा ${payload.khasraNumber}) ड्रोन स्प्रे बुकिंग सफल रही। टोकन: ${token}। देय राशि: ₹${cost}। ड्रोन आगमन: बुधवार सुबह 7:00 बजे।`;

      setAssistedBookings([newBooking, ...assistedBookings]);
      setSuccessNotice({
        message: `✅ Kiosk booking confirmed for ${payload.farmerName}! Paper Token #${token} generated.`,
        paperSlipToken: token,
        smsSimulated
      });
      setSelectedSlipBooking(newBooking);

      // Emit real-time event so operator receives notification even in fallback mode!
      emitRealtimeEvent('agridrone_booking_created', newBooking);

      // Pop-up notification: Message Sent! (Fallback mode)
      setSentPopupData({
        farmerName: payload.farmerName,
        acreage: payload.acreage,
        crop: payload.crop,
        village: payload.village || 'Rampur Kalan',
        zone: payload.zone || 'Zone North',
        recipientOperator: 'Smt. Kavita Sharma (Drone Didi Lead)',
        totalCost: cost
      });
      setShowSentPopup(true);

      setFormData({
        ...formData,
        farmerName: '',
        farmerPhone: '',
        aadhaarLast4: '',
        khasraNumber: '',
        acreage: 2.0
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAssistedAcreage = assistedBookings.reduce((sum, b) => sum + (b.acreage || 0), 0);
  const totalCashCollected = assistedBookings
    .filter(b => b.cashPaymentCollected)
    .reduce((sum, b) => sum + (b.pricing?.totalCost || 0), 0);
  const totalSavingsDelivered = assistedBookings.reduce((sum, b) => sum + (b.pricing?.savingsAmount || b.acreage * 100 || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Panchayat Kiosk Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 mr-1" />
              Gram Panchayat Digital Agri-Kiosk Desk
            </span>
            <span className="text-xs text-slate-400 font-mono">Assisted Booking for Non-Smartphone Farmers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1">
            {user?.organization || 'Rampur Kalan Gram Panchayat & CSC Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Nodal Officer: <strong>{user?.name || 'Shri Rajeshwar Nath (Gram Pradhan / Panchayat Sachiv)'}</strong> · District: <strong>Lucknow</strong>
          </p>
        </div>

        <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Community Cluster Rate</span>
          <strong className="text-emerald-400 font-mono text-2xl font-bold">₹300 / Acre</strong>
          <span className="text-[10px] text-slate-400 block font-sans">Guaranteed Pooled Subsidy Rate</span>
        </div>
      </div>

      {/* KPI Cards: Inclusion & Offline Impact */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Non-Smartphone Farmers</span>
            <PhoneOff className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white mt-1">{assistedBookings.length} Assisted</div>
          <span className="text-[10px] text-emerald-300 font-mono">Paper Slips & SMS Dispatched</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Panchayat Land Pooled</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-bold text-emerald-400 mt-1">{totalAssistedAcreage.toFixed(1)} Acres</div>
          <span className="text-[10px] text-slate-400 font-sans">Aggregated for Contiguous Drone Sortie</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Village Direct Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-bold text-emerald-400 mt-1">₹{totalSavingsDelivered}</div>
          <span className="text-[10px] text-slate-400 font-sans">₹100/ac Less than Solo Rate</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cash Collection Reconciled</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-display font-bold text-sky-400 mt-1">₹{totalCashCollected}</div>
          <span className="text-[10px] text-slate-400 font-mono">Gram Panchayat Deposit Ledger</span>
        </div>

      </div>

      {/* Main 2-Column Work Desk: Assisted Booking Form (Left) & Upcoming Village Spray Schedule (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT (7 cols): Assisted Farmer Booking Form */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
                <span>📝 New Assisted Farmer Booking (Kiosk Entry)</span>
              </h3>
              <p className="text-xs text-slate-400">
                For smallholders without smartphones. Generates paper token slip and vernacular SMS alert.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              Kiosk Active
            </span>
          </div>

          {/* Success Notice if submitted */}
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 animate-scaleUp">
              <div className="flex items-center justify-between">
                <strong className="text-emerald-300 font-semibold text-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {successNotice.message}
                </strong>
                <button
                  onClick={() => setSuccessNotice(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              {successNotice.smsSimulated && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">📱 Simulated Vernacular Feature Phone SMS:</span>
                  <p className="mt-0.5">{successNotice.smsSimulated}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedSlipBooking(assistedBookings[0])}
                className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-950" />
                <span>Print Physical Paper Token Slip</span>
              </button>
            </div>
          )}

          <form onSubmit={handleAssistedSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Farmer Full Name (किसान का नाम) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramdhani Yadav"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Farmer Mobile Number (साधारण फोन) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 98390 12345"
                  value={formData.farmerPhone}
                  onChange={(e) => setFormData({ ...formData, farmerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none font-mono"
                />
                <span className="text-[10px] text-slate-500">Feature phone receives Hindi confirmation SMS & IVR call</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Khasra / Khatauni Plot No. (खसरा / खतौनी) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khasra 142/3 (Purva Tola)"
                  value={formData.khasraNumber}
                  onChange={(e) => setFormData({ ...formData, khasraNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Aadhaar Card (Last 4 Digits)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 7104"
                  value={formData.aadhaarLast4}
                  onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-500 outline-none font-mono"
                />
                <span className="text-[10px] text-slate-500">For PM-Kisan and State Subsidy verification</span>
              </div>
            </div>

            {/* Indian State & Operational Zone Hub Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  State (राज्य) *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setSelectedState(newState);
                    const stateObj = INDIAN_AGRI_STATES_AND_HUBS.find(s => s.state === newState);
                    if (stateObj && stateObj.zones.length > 0) {
                      setFormData(prev => ({ ...prev, state: newState, zone: stateObj.zones[0].id }));
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none cursor-pointer"
                >
                  {INDIAN_AGRI_STATES_AND_HUBS.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state} ({s.stateHindi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operational Zone Hub *
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => {
                    const newZoneId = e.target.value;
                    let foundState = selectedState;
                    for (const s of INDIAN_AGRI_STATES_AND_HUBS) {
                      const match = s.zones.find(z => z.id === newZoneId);
                      if (match) {
                        foundState = s.state;
                        break;
                      }
                    }
                    setSelectedState(foundState);
                    setFormData(prev => ({ ...prev, state: foundState, zone: newZoneId }));
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none cursor-pointer"
                >
                  {INDIAN_AGRI_STATES_AND_HUBS.map((stateGroup) => (
                    <optgroup
                      key={stateGroup.state}
                      label={`📍 ${stateGroup.state} (${stateGroup.stateHindi})`}
                      className="bg-slate-900 font-bold text-emerald-400"
                    >
                      {stateGroup.zones.map((zone) => (
                        <option
                          key={zone.id}
                          value={zone.id}
                          className="text-white bg-slate-900 font-normal"
                        >
                          {zone.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Crop Type (फसल)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCrop(!isCustomCrop);
                      if (!isCustomCrop && !customCrop) setCustomCrop('');
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                      isCustomCrop
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Click to enter a custom crop"
                  >
                    <span>{isCustomCrop ? '← List' : '+ Others / अन्य'}</span>
                  </button>
                </div>

                {!isCustomCrop ? (
                  <select
                    value={formData.crop}
                    onChange={(e) => {
                      if (e.target.value === '__OTHER__') {
                        setIsCustomCrop(true);
                      } else {
                        setFormData({ ...formData, crop: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="Paddy (Rice)">Paddy / धान</option>
                    <option value="Wheat">Wheat / गेहूं</option>
                    <option value="Sugarcane">Sugarcane / गन्ना</option>
                    <option value="Mustard">Mustard / सरसों</option>
                    <option value="Potato">Potato / आलू</option>
                    <option value="Maize">Maize / मक्का</option>
                    <option value="Soybean">Soybean / सोयाबीन</option>
                    <option value="Cotton">Cotton / कपास</option>
                    <option value="__OTHER__">+ Others / अन्य (Specify Crop)</option>
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Enter crop (e.g. Chili, Garlic, Onion)..."
                      value={customCrop}
                      onChange={(e) => {
                        setCustomCrop(e.target.value);
                        setFormData({ ...formData, crop: e.target.value });
                      }}
                      autoFocus
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500 text-white text-xs focus:border-emerald-400 outline-none"
                    />
                    <span className="text-[10px] text-emerald-400 block truncate">
                      Crop: <strong className="text-white">{customCrop || 'Enter name above'}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Acreage (एकड़ क्षेत्रफल): <strong className="text-emerald-400 font-mono">{formData.acreage} Ac</strong>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.5"
                  value={formData.acreage}
                  onChange={(e) => setFormData({ ...formData, acreage: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.5 Ac</span>
                  <span>5.0 Ac</span>
                  <span>10.0 Ac</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Chemical Input
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomChemical(!isCustomChemical);
                      if (!isCustomChemical && !customChemical) setCustomChemical('');
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                      isCustomChemical
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Click to enter a custom chemical formulation"
                  >
                    <span>{isCustomChemical ? '← List' : '+ Others / अन्य'}</span>
                  </button>
                </div>

                {!isCustomChemical ? (
                  <select
                    value={formData.chemicalType}
                    onChange={(e) => {
                      if (e.target.value === '__OTHER__') {
                        setIsCustomChemical(true);
                      } else {
                        setFormData({
                          ...formData,
                          chemicalType: e.target.value,
                          serviceRequired: e.target.value
                        });
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="IFFCO Nano Urea & DAP">IFFCO Nano Urea & DAP</option>
                    <option value="Bio-Fungicide & Micronutrient">Bio-Fungicide & Micronutrients</option>
                    <option value="Stem Borer Defense Spray">Stem Borer Defense</option>
                    <option value="Neem Oil Organic Pest Repellent">Neem Oil Organic Pest Repellent</option>
                    <option value="__OTHER__">+ Others / अन्य (Custom Input)</option>
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Enter custom input / chemical..."
                      value={customChemical}
                      onChange={(e) => {
                        setCustomChemical(e.target.value);
                        setFormData({
                          ...formData,
                          chemicalType: e.target.value,
                          serviceRequired: e.target.value
                        });
                      }}
                      autoFocus
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500 text-white text-xs focus:border-emerald-400 outline-none"
                    />
                    <span className="text-[10px] text-emerald-400 block truncate">
                      Input: <strong className="text-white">{customChemical || 'Enter formulation'}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Instant Pricing & Cash Collection Toggle */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block font-sans">Total Fee Payable to Panchayat:</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  ₹{formData.acreage * 300} <span className="text-xs font-sans text-slate-400 font-normal">({formData.acreage} Ac @ ₹300/ac)</span>
                </div>
                <span className="text-[11px] text-slate-400">Solo rate ₹400/ac discounted by ₹100 via Panchayat Village Pool!</span>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                <input
                  type="checkbox"
                  id="cash-collected"
                  checked={formData.cashPaymentCollected}
                  onChange={(e) => setFormData({ ...formData, cashPaymentCollected: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="cash-collected" className="text-xs text-white font-medium cursor-pointer">
                  💵 Cash Collected at Panchayat Desk
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 hover:from-brand-300 shadow-xl shadow-brand-500/25 active:scale-[0.99] transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              {loading ? (
                <span>Generating Token Slip & Dispatched SMS...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Confirm Assisted Booking & Generate Paper Token Slip</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* RIGHT (5 cols): Village Spray Schedule Board & Pilot Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Drone Arrival Notice Board */}
          <div className="glass-card rounded-2xl p-5 border border-sky-500/40 bg-gradient-to-br from-sky-950/30 to-slate-900 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider flex items-center space-x-1">
                <Calendar className="w-3 h-3 mr-1" />
                Village Spray Schedule Board
              </span>
              <span className="text-[10px] font-mono text-emerald-400 animate-pulse">● Pilot En Route</span>
            </div>

            <h4 className="text-xl font-display font-bold text-white">
              Next Village Flight Window: Wednesday 6:30 AM
            </h4>
            
            <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Station / Launch Depot:</span>
                <strong className="text-white">Primary School Field, Rampur</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certified Pilot (Drone Didi):</span>
                <strong className="text-sky-400">Smt. Kavita Sharma (Prerna SHG)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aircraft Model:</span>
                <strong className="text-white font-mono">KisanDrone 10L (UA-7849)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pooled Smallholders in this sortie:</span>
                <strong className="text-emerald-400 font-mono">{assistedBookings.length} Farmers ({totalAssistedAcreage.toFixed(1)} Ac)</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="text-emerald-400 font-bold block">📢 Panchayat Munadi Announcement:</span>
              <p>
                All farmers with paper token slips are advised to ensure crop plots are clear of cattle and livestock by 6:00 AM on Wednesday.
              </p>
            </div>
          </div>

          {/* Quick Info: Why Panchayat Kiosk is Vital */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="font-display font-bold text-white text-sm flex items-center space-x-2">
              <PhoneOff className="w-4 h-4 text-emerald-400" />
              <span>Digital Inclusion for 100% of Smallholders</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In typical rural villages, over 55% of marginal farmers operate with basic feature phones and cannot use mobile apps. 
              The <strong>AgriDrone Hub Panchayat Desk</strong> bridges this last-mile gap:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Panchayat Secretary pools plots so offline farmers get the full <strong>₹300/ac</strong> cluster discount.</li>
              <li>Farmer receives an official physical <strong>Paper Token Slip</strong> with Khasra number & barcode.</li>
              <li>Confirmation delivered via automated <strong>Hindi SMS & IVR audio call</strong>.</li>
              <li>Payment accepted in <strong>Cash or PM-Kisan DBT</strong> for transparent rural governance.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: Assisted Farmers Registry Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Village Assisted Smallholder Registry ({user?.village || 'Rampur Kalan'})
            </h3>
            <p className="text-xs text-slate-400">
              Complete record of all non-smartphone bookings, token slips, and cash reconciliation.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold self-start sm:self-auto">
            {assistedBookings.length} Offline Plots Registered
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Token Slip #</th>
                <th className="py-2.5 px-3">Farmer Name</th>
                <th className="py-2.5 px-3">Feature Phone</th>
                <th className="py-2.5 px-3">Khasra Plot #</th>
                <th className="py-2.5 px-3">Crop & Area</th>
                <th className="py-2.5 px-3">Fee Paid</th>
                <th className="py-2.5 px-3">Cash Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {assistedBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-bold text-emerald-400">{b.paperTokenSlip || 'GP-RAMPUR-089'}</td>
                  <td className="py-3 px-3 font-sans text-white font-medium">{b.farmerName}</td>
                  <td className="py-3 px-3">{b.farmerPhone || '+91 98390 00000'}</td>
                  <td className="py-3 px-3 font-sans text-slate-400">{b.khasraNumber || '142/3'}</td>
                  <td className="py-3 px-3 font-sans">{b.crop} · <strong className="text-white">{b.acreage} Ac</strong></td>
                  <td className="py-3 px-3 font-bold text-white">₹{b.pricing?.totalCost || b.acreage * 300}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      PAID CASH
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedSlipBooking(b)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Print Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE PHYSICAL PAPER SLIP MODAL */}
      {selectedSlipBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-display font-bold text-white text-base">Physical Spray Slip (ग्राम पंचायत पर्ची)</h4>
              </div>
              <button
                onClick={() => setSelectedSlipBooking(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The Printable Slip Body */}
            <div className="bg-white text-slate-900 rounded-xl p-5 border border-slate-300 font-mono text-xs space-y-3 shadow-inner">
              
              <div className="text-center border-b-2 border-slate-900 pb-2">
                <h4 className="text-sm font-sans block uppercase font-bold text-slate-900">
                  GRAM PANCHAYAT AGRICULTURAL DRONE SERVICE
                </h4>
                <div className="text-[11px] text-slate-700 font-sans font-semibold">
                  ग्राम पंचायत: रामपुर कलां (लखनऊ) · CSC Nodal Desk
                </div>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono font-bold mt-1 inline-block">
                  OFFICIAL FARMER TOKEN SLIP
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] border-b border-dashed border-slate-400 pb-2">
                <div>
                  <span className="text-slate-600 block">Token Number:</span>
                  <strong className="text-base text-slate-900">{selectedSlipBooking.paperTokenSlip || 'GP-RAMPUR-2026-089'}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-600 block">Date of Booking:</span>
                  <strong>{new Date(selectedSlipBooking.createdAt || Date.now()).toLocaleDateString('en-IN')}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-600 block">Beneficiary Farmer:</span>
                  <strong className="text-slate-900 text-xs font-sans">{selectedSlipBooking.farmerName}</strong>
                </div>
                <div>
                  <span className="text-slate-600 block">Khasra / Plot No:</span>
                  <strong className="text-slate-900">{selectedSlipBooking.khasraNumber || '142/3 (Purva Tola)'}</strong>
                </div>
                <div>
                  <span className="text-slate-600 block">Crop & Area:</span>
                  <strong className="text-slate-900 font-sans">{selectedSlipBooking.crop} · {selectedSlipBooking.acreage} Acres</strong>
                </div>
                <div>
                  <span className="text-slate-600 block">Contact Phone:</span>
                  <strong className="text-slate-900">{selectedSlipBooking.farmerPhone || '+91 98390 12345'}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex justify-between items-center text-xs">
                <div>
                  <span className="text-emerald-800 font-sans block">Total Fee Collected (Cash):</span>
                  <strong className="text-emerald-900 text-sm font-mono">₹{selectedSlipBooking.pricing?.totalCost || selectedSlipBooking.acreage * 300} Paid</strong>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]">
                  ✓ PAID CASH
                </span>
              </div>

              {/* Instructions for Field Day */}
              <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-700 space-y-1 font-sans">
                <strong>निर्देश (Farmer Instructions for Spray Day):</strong>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>कृपया यह पर्ची स्प्रे के दिन पायलट को दिखाएं।</li>
                  <li>ड्रोन आगमन: बुधवार सुबह 6:30 बजे (प्राथमिक विद्यालय प्रांगण)।</li>
                  <li>स्प्रे के दौरान खेत में पशु या बच्चे न जाने दें।</li>
                </ol>
              </div>

              {/* Pilot QR verification */}
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-400 text-[10px]">
                <div>
                  <span>Pilot: Smt. Kavita Sharma (Drone Didi)</span><br />
                  <span>UAS: UA-7849-NDD (KisanDrone 10L)</span>
                </div>
                <div className="w-12 h-12 bg-white border border-slate-400 p-0.5 rounded flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-800" />
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Assisted Smallholder Inclusion Program</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow transition"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Print Paper Token Slip</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pop-up Notification: Message Sent to Hub Operator */}
      <MessageSentPopup
        isOpen={showSentPopup}
        onClose={() => setShowSentPopup(false)}
        data={sentPopupData}
      />

    </div>
  );
};
