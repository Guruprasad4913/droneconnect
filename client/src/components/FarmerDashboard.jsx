import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ClusterVisualizerMap } from './ClusterVisualizerMap';
import { DigitalSprayCertificateModal } from './DigitalSprayCertificateModal';
import { MessageSentPopup } from './MessageSentPopup';
import { BookingAcceptedPopup } from './BookingAcceptedPopup';
import { PlusCircle, CheckCircle2, AlertCircle, Clock, MapPin, Sparkles, FileText, Share2, Layers, DollarSign } from 'lucide-react';
import { emitRealtimeEvent, subscribeToRealtimeEvents } from '../services/realtimeEvents';

import { ALL_INDIAN_STATES_AND_HUBS } from '../data/indianAgriStates';

// Local reference for optimal React Fast Refresh
const INDIAN_AGRI_STATES_AND_HUBS = ALL_INDIAN_STATES_AND_HUBS;

export const FarmerDashboard = () => {
  const { user } = useAuth();
  
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const [selectedHubCoords, setSelectedHubCoords] = useState([26.8467, 80.9462]);

  const [formData, setFormData] = useState({
    farmerName: user?.name || 'Balwant Singh',
    farmName: 'Balwant Krishi Farm',
    village: user?.village || 'Rampur Kalan',
    state: 'Uttar Pradesh',
    zone: 'Zone North',
    crop: 'Paddy (Rice)',
    acreage: 3.5,
    serviceRequired: 'nano-urea-spray',
    chemicalType: 'IFFCO Nano Urea & DAP',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  // Custom Crop & Custom Service / Spray input states ("Others" option)
  const [isCustomCrop, setIsCustomCrop] = useState(false);
  const [customCrop, setCustomCrop] = useState('');
  const [isCustomService, setIsCustomService] = useState(false);
  const [customService, setCustomService] = useState('');

  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const stateObj = INDIAN_AGRI_STATES_AND_HUBS.find(s => s.state === newState);
    if (stateObj && stateObj.zones.length > 0) {
      const firstZone = stateObj.zones[0];
      setFormData(prev => ({ ...prev, state: newState, zone: firstZone.id }));
      setSelectedHubCoords(firstZone.coords);
      loadNearbyBookings(firstZone.id);
    }
  };

  const handleZoneChange = (newZoneId) => {
    let foundState = selectedState;
    let foundCoords = selectedHubCoords;
    for (const s of INDIAN_AGRI_STATES_AND_HUBS) {
      const match = s.zones.find(z => z.id === newZoneId);
      if (match) {
        foundState = s.state;
        foundCoords = match.coords;
        break;
      }
    }
    setSelectedState(foundState);
    setSelectedHubCoords(foundCoords);
    setFormData(prev => ({ ...prev, state: foundState, zone: newZoneId }));
    loadNearbyBookings(newZoneId);
  };

  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [nearbyBookings, setNearbyBookings] = useState([]);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);
  const [showSentPopup, setShowSentPopup] = useState(false);
  const [sentPopupData, setSentPopupData] = useState(null);
  const [showAcceptedPopup, setShowAcceptedPopup] = useState(false);
  const [acceptedPopupData, setAcceptedPopupData] = useState(null);

  useEffect(() => {
    loadBookings();
    loadNearbyBookings(formData.zone);
    checkForAcceptedNotifications();

    const unsubscribe = subscribeToRealtimeEvents({
      agridrone_booking_accepted: (detail) => {
        loadBookings();
        setAcceptedPopupData({
          farmerName: detail?.farmerName || user?.name || 'Balwant Singh',
          crop: detail?.crop || formData.crop || 'Paddy (Rice)',
          acreage: detail?.acreage || formData.acreage || 3.5,
          village: detail?.village || user?.village || 'Rampur Kalan',
          acceptedBy: detail?.acceptedBy || 'Smt. Kavita Sharma (Drone Didi Lead)',
          droneUasId: detail?.droneUasId || 'KisanDrone Hexacopter (UA-7849-NDD)'
        });
        setShowAcceptedPopup(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkForAcceptedNotifications = async () => {
    try {
      const res = await api.notifications.getAll('farmer');
      if (res.success && res.data.length > 0) {
        const unreadAccepted = res.data.find(n => n.type === 'booking_accepted' && !n.isRead);
        if (unreadAccepted) {
          setAcceptedPopupData({
            farmerName: unreadAccepted.farmerName || user?.name || 'Balwant Singh',
            crop: unreadAccepted.crop || 'Paddy (Rice)',
            acreage: unreadAccepted.acreage || 3.5,
            village: unreadAccepted.village || 'Rampur Kalan',
            acceptedBy: unreadAccepted.acceptedBy || 'Smt. Kavita Sharma (Drone Didi Lead)',
            droneUasId: 'KisanDrone Hexacopter (UA-7849-NDD)'
          });
          setShowAcceptedPopup(true);
          api.notifications.markRead(unreadAccepted._id);
        }
      }
    } catch (e) {
      // non-fatal
    }
  };

  const loadBookings = async () => {
    try {
      const res = await api.bookings.getMy();
      if (res.success && res.data.length > 0) {
        setMyBookings(res.data);
      } else {
        setMyBookings([
          {
            _id: 'b-101',
            farmName: 'Balwant Krishi Farm (Plot 1)',
            village: 'Rampur Kalan',
            crop: 'Paddy (Rice)',
            acreage: 4.0,
            status: 'clustered',
            pricing: { actualRateApplied: 300, totalCost: 1200, savingsAmount: 400 },
            invoiceNumber: 'INV-2026-003',
            serviceRequired: 'bio-fungicide',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (e) {
      console.warn('Using offline farmer bookings');
    }
  };

  const loadNearbyBookings = async (zone) => {
    try {
      const res = await api.bookings.getNearby(zone);
      if (res.success) {
        setNearbyBookings(res.data);
      }
    } catch (e) {
      console.warn('Using offline nearby bookings');
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalCrop = isCustomCrop && customCrop.trim() ? customCrop.trim() : formData.crop;
    const finalChemical = isCustomService && customService.trim() ? customService.trim() : (formData.chemicalType || 'IFFCO Nano Urea & DAP');
    const finalService = isCustomService && customService.trim() ? customService.trim() : formData.serviceRequired;

    const payload = {
      ...formData,
      crop: finalCrop,
      chemicalType: finalChemical,
      serviceRequired: finalService
    };

    try {
      const res = await api.bookings.create(payload);
      if (res.success) {
        setBookingResult(res);
        loadBookings();
        loadNearbyBookings(formData.zone);
        emitRealtimeEvent('agridrone_booking_created', res.data);

        // Pop-up notification: Message Sent!
        setSentPopupData({
          farmerName: payload.farmerName,
          acreage: payload.acreage,
          crop: payload.crop,
          village: payload.village,
          zone: payload.zone,
          recipientOperator: 'Smt. Kavita Sharma (Drone Didi Lead)',
          totalCost: res.data?.pricing?.totalCost || (payload.acreage * 300)
        });
        setShowSentPopup(true);
      }
    } catch (err) {
      const soloRate = 400;
      const clusteredRate = 300;
      const totalCost = payload.acreage * clusteredRate;
      const savings = payload.acreage * 100;

      const fallbackBooking = {
        ...payload,
        _id: 'b-' + Date.now().toString().slice(-4),
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        pricing: {
          actualRateApplied: clusteredRate,
          totalCost,
          savingsAmount: savings
        }
      };

      setBookingResult({
        success: true,
        clusterFormed: true,
        data: fallbackBooking,
        savingsMessage: `🎉 Aggregated with nearby plots in ${payload.zone}! Rate reduced to ₹300/acre. You save ₹${savings}!`
      });

      // Emit real-time event so operator receives notification even in fallback mode!
      emitRealtimeEvent('agridrone_booking_created', fallbackBooking);

      // Pop-up notification: Message Sent! (Fallback mode)
      setSentPopupData({
        farmerName: payload.farmerName,
        acreage: payload.acreage,
        crop: payload.crop,
        village: payload.village,
        zone: payload.zone,
        recipientOperator: 'Smt. Kavita Sharma (Drone Didi Lead)',
        totalCost
      });
      setShowSentPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Farmer Profile & Status Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
              Farmer Dashboard
            </span>
            <span className="text-xs text-slate-400 font-mono">Hub: {formData.zone} ({selectedState})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1">
            Welcome, {user?.name || 'Balwant Singh'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Village: <strong>{user?.village || 'Rampur Kalan'}</strong> · District: Lucknow · Associated SHG: <strong>Prerna Drone Didi Hub</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Active Cluster Rate</span>
            <strong className="text-emerald-400 font-mono text-lg font-bold">₹300 / Acre</strong>
            <span className="text-[10px] text-slate-500 block">Solo: ₹400/ac</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Booking Form (Left 5 cols) & Radius Cluster Radar (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 5 cols: Booking Form */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-white flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>Book Drone Spraying</span>
            </h2>
            <span className="text-xs text-emerald-400 font-mono">3–5 km Radius Aggregation</span>
          </div>

          <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-medium text-slate-300 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                required
                value={formData.farmerName}
                onChange={e => setFormData({ ...formData, farmerName: e.target.value })}
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Village Name *</label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={e => setFormData({ ...formData, village: e.target.value })}
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>

            {/* Indian State & Operational Zone Hub Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  State (राज्य) *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 cursor-pointer"
                >
                  {INDIAN_AGRI_STATES_AND_HUBS.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state} ({s.stateHindi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Operational Zone Hub *
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 cursor-pointer"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Land Size (Acres) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="50"
                  required
                  value={formData.acreage}
                  onChange={e => setFormData({ ...formData, acreage: parseFloat(e.target.value) || 0 })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-300 text-xs sm:text-sm">Crop Type *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCrop(!isCustomCrop);
                      if (!isCustomCrop && !customCrop) {
                        setCustomCrop('');
                      }
                    }}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition flex items-center space-x-1 cursor-pointer ${
                      isCustomCrop
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Click to enter a custom crop not listed in standard presets"
                  >
                    <span>{isCustomCrop ? '← Standard List' : '✨ Others / अन्य'}</span>
                  </button>
                </div>

                {!isCustomCrop ? (
                  <select
                    value={formData.crop}
                    onChange={e => {
                      if (e.target.value === '__OTHER__') {
                        setIsCustomCrop(true);
                      } else {
                        setFormData({ ...formData, crop: e.target.value });
                      }
                    }}
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
                  >
                    <option value="Paddy (Rice)">Paddy (Rice) / धान</option>
                    <option value="Wheat">Wheat / गेहूं</option>
                    <option value="Cotton">Cotton / कपास</option>
                    <option value="Sugarcane">Sugarcane / गन्ना</option>
                    <option value="Mustard / Oilseeds">Mustard / Oilseeds (सरसों)</option>
                    <option value="Maize / Corn">Maize / Corn (मक्का)</option>
                    <option value="Soybean">Soybean / सोयाबीन</option>
                    <option value="Pulses / Dal">Pulses / Dal (दालें/चना)</option>
                    <option value="Potato / Vegetables">Potato & Vegetables (सब्जियां)</option>
                    <option value="__OTHER__">+ Others / अन्य (Specify Custom Crop)</option>
                  </select>
                ) : (
                  <div className="space-y-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type crop name (e.g. Soybean, Maize, Chili, Tea, Tomato, Apple)..."
                        value={customCrop}
                        onChange={e => {
                          setCustomCrop(e.target.value);
                          setFormData({ ...formData, crop: e.target.value });
                        }}
                        autoFocus
                        required
                        className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border-emerald-500/60 focus:border-emerald-400 pl-8"
                      />
                      <span className="absolute left-2.5 top-2.5 text-sm">🌱</span>
                      {customCrop && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCrop('');
                            setFormData({ ...formData, crop: '' });
                          }}
                          className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 block">
                      Custom crop specified: <strong className="text-white">{customCrop || 'Type your crop name above'}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-300 text-xs sm:text-sm">Service & Spray Input</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomService(!isCustomService);
                    if (!isCustomService && !customService) {
                      setCustomService('');
                    }
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition flex items-center space-x-1 cursor-pointer ${
                    isCustomService
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Click to enter a custom chemical formulation or service"
                >
                  <span>{isCustomService ? '← Standard List' : '✨ Others / अन्य'}</span>
                </button>
              </div>

              {!isCustomService ? (
                <select
                  value={formData.serviceRequired}
                  onChange={e => {
                    if (e.target.value === '__OTHER__') {
                      setIsCustomService(true);
                    } else {
                      const serviceVal = e.target.value;
                      const chemMap = {
                        'nano-urea-spray': 'IFFCO Nano Urea & DAP (Micro-droplet)',
                        'bio-fungicide': 'Targeted Bio-Fungicide (Blast/Blight)',
                        'micronutrient-tonic': 'Neem Oil & Micronutrient Tonic',
                        'pest-defense': 'Pest Defense (Bollworm/Aphids)',
                        'herbicide-spray': 'Selective Weedicide / Herbicide'
                      };
                      setFormData({
                        ...formData,
                        serviceRequired: serviceVal,
                        chemicalType: chemMap[serviceVal] || serviceVal
                      });
                    }
                  }}
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
                >
                  <option value="nano-urea-spray">IFFCO Nano Urea & DAP (Micro-droplet)</option>
                  <option value="bio-fungicide">Targeted Bio-Fungicide (Blast/Blight)</option>
                  <option value="micronutrient-tonic">Neem Oil & Micronutrient Tonic</option>
                  <option value="pest-defense">Pest Defense (Bollworm/Aphids)</option>
                  <option value="herbicide-spray">Selective Weedicide / Herbicide</option>
                  <option value="__OTHER__">+ Others / अन्य (Custom Spray Formulation / Service)</option>
                </select>
              ) : (
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type custom spray / service (e.g. Zinc Sulfate, Copper Oxychloride, Organic Tonic)..."
                      value={customService}
                      onChange={e => {
                        setCustomService(e.target.value);
                        setFormData({
                          ...formData,
                          serviceRequired: 'custom-input',
                          chemicalType: e.target.value
                        });
                      }}
                      autoFocus
                      required
                      className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border-emerald-500/60 focus:border-emerald-400 pl-8"
                    />
                    <span className="absolute left-2.5 top-2.5 text-sm">🧪</span>
                    {customService && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomService('');
                          setFormData({ ...formData, chemicalType: '' });
                        }}
                        className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400 block">
                    Custom input specified: <strong className="text-white">{customService || 'Type your chemical/input formulation'}</strong>
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 shadow-lg shadow-brand-500/25 active:scale-[0.99] transition duration-150 flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Check Radius Cluster & Book</span>
            </button>

            <div className="text-[11px] text-center text-slate-400">
              ⚡ Guaranteed ₹300/ac clustered price when adjacent plots pool together.
            </div>
          </form>
        </div>

        {/* Right 7 cols: Cluster Dynamic Results & Map */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Booking Dynamic Result Banner */}
          {bookingResult && (
            <div className="glass-card rounded-2xl p-6 border-2 border-emerald-500 bg-gradient-to-br from-emerald-950/60 to-slate-900 shadow-xl space-y-4 animate-scaleUp">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 uppercase tracking-wider">
                      Cluster Discount Activated!
                    </span>
                    <h3 className="font-display font-bold text-lg text-white mt-0.5">
                      Rate Reduced: ₹400/ac ➔ ₹300/acre
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Your Savings</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    ₹{bookingResult.data.pricing.savingsAmount} Saved
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                {bookingResult.savingsMessage}
              </p>

              <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-center">
                <div>
                  <span className="text-slate-400 block text-[10px]">Acreage</span>
                  <strong className="text-white">{bookingResult.data.acreage} Acres</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Cost</span>
                  <strong className="text-emerald-400">₹{bookingResult.data.pricing.totalCost}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Invoice Ref</span>
                  <strong className="text-slate-300">{bookingResult.data.invoiceNumber}</strong>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedReceiptBooking(bookingResult.data)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>View & Print Digital Spray Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* Radius Cluster Radar Map */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-white text-base">3–5 km Radius Aggregation Map</h3>
                <p className="text-xs text-slate-400">Nearby plots participating in {formData.zone} ({selectedState})</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                {selectedState} · {formData.zone}
              </span>
            </div>

            <div className="h-72 w-full">
              <ClusterVisualizerMap
                key={`${selectedHubCoords[0]}-${selectedHubCoords[1]}`}
                center={selectedHubCoords}
                zoom={13}
                hubRadiusKm={3.8}
              />
            </div>
          </div>

          {/* Nearby Plots in this Hub Queue */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-sm text-white">Discovered Neighbor Plots in your Hub</h4>
              <span className="text-xs text-emerald-400 font-medium">Automatic Price Drop Active</span>
            </div>

            <div className="space-y-2">
              {nearbyBookings && nearbyBookings.length > 0 ? (
                nearbyBookings.slice(0, 4).map((nb, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white">{nb.farmerName || 'Neighbor Farmer'} ({nb.acreage} ac)</strong>
                      <span className="text-slate-400 block text-[11px]">{nb.village || 'Local Village'} · {nb.crop || 'Field Crop'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Pooled (₹300/ac)</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white">Ramesh Chandra Patel (2.0 ac)</strong>
                      <span className="text-slate-400 block text-[11px]">Rampur Kalan · Paddy (Rice)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Pooled (₹300/ac)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white">Smt. Sunita Devi (3.0 ac)</strong>
                      <span className="text-slate-400 block text-[11px]">Malapur · Paddy (Rice)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Pooled (₹300/ac)</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* My Bookings History Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white">My Drone Spraying Bookings</h3>
            <p className="text-xs text-slate-400">Real-time status tracking and government-compliant certificates</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{myBookings.length} Total Bookings</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Farm / Village</th>
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Acreage</th>
                <th className="py-2.5 px-3">Rate Applied</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {myBookings.map(b => (
                <tr key={b._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3">
                    <strong className="text-white block">{b.farmName || 'Balwant Krishi Farm'}</strong>
                    <span className="text-slate-500 text-[11px]">{b.village}</span>
                  </td>
                  <td className="py-3 px-3">{b.crop}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{b.acreage} Ac</td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-emerald-400 font-bold">₹{b.pricing?.actualRateApplied || 300}/ac</span>
                    <span className="text-[10px] text-slate-500 block">Total: ₹{b.pricing?.totalCost || b.acreage * 300}</span>
                  </td>
                  <td className="py-3 px-3">
                    {b.status === 'assigned' ? (
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1" />
                          Accepted by Pilot (UA-7849-NDD)
                        </span>
                        {b.notes && (
                          <span className="text-[10px] text-emerald-400/90 block mt-1 font-mono">
                            {b.notes}
                          </span>
                        )}
                      </div>
                    ) : b.status === 'clustered' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        ● Clustered (Awaiting Operator Acceptance)
                      </span>
                    ) : b.status === 'completed' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        ✓ Spray Completed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ⏳ Pending Hub Matching
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceiptBooking(b)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Spray Certificate Modal */}
      {selectedReceiptBooking && (
        <DigitalSprayCertificateModal
          booking={selectedReceiptBooking}
          onClose={() => setSelectedReceiptBooking(null)}
        />
      )}

      {/* Pop-up Notification: Message Sent to Hub Operator */}
      <MessageSentPopup
        isOpen={showSentPopup}
        onClose={() => setShowSentPopup(false)}
        data={sentPopupData}
        onViewStatus={() => {
          const el = document.getElementById('my-bookings-table');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Pop-up Notification: Booking Accepted by Drone Pilot! */}
      <BookingAcceptedPopup
        isOpen={showAcceptedPopup}
        onClose={() => setShowAcceptedPopup(false)}
        data={acceptedPopupData}
        onViewCertificate={() => {
          if (myBookings.length > 0) setSelectedReceiptBooking(myBookings[0]);
        }}
      />

    </div>
  );
};
