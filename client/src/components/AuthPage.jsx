import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Plane,
  ShieldCheck,
  User,
  Lock,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

export const AuthPage = ({ initialRole = 'farmer', onAuthSuccess, onCancel }) => {
  const { login, register, switchDemoRole } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'farmer', 'operator', 'panchayat'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    village: 'Rampur Kalan',
    district: 'Lucknow',
    organization: '',
    // Farmer specific
    farmName: 'Krishi Farm',
    primaryCrop: 'Paddy (Rice)',
    // Operator specific
    droneModel: 'KisanDrone Hexa-10L',
    dgcaUasId: 'UA-7849-NDD',
    // Panchayat specific
    kioskCenterId: 'CSC-LKO-4821',
    panchayatName: 'Rampur Kalan Gram Panchayat'
  });

  const rolesConfig = {
    farmer: {
      title: 'Farmer (Direct User)',
      badge: 'Individual Field Booking',
      icon: '👨‍🌾',
      color: 'emerald',
      borderColor: 'border-emerald-500',
      bgGlow: 'from-emerald-950/40',
      activeTab: 'bg-emerald-500 text-slate-950 font-bold',
      demoEmail: 'farmer@agridrone.in',
      description: 'Book drone spraying directly for your own agricultural fields and unlock clustered volume discounts.'
    },
    operator: {
      title: 'Drone Operator / Pilot',
      badge: 'Drone Owners & Drone Didis',
      icon: '🛰️',
      color: 'indigo',
      borderColor: 'border-indigo-500',
      bgGlow: 'from-indigo-950/40',
      activeTab: 'bg-indigo-600 text-white font-bold',
      demoEmail: 'operator@agridrone.in',
      description: 'For SHG federations, CHCs and pilots with drones to manage flight corridors, battery swaps and off-season revenues.'
    },
    panchayat: {
      title: 'Village Panchayat (Kiosk)',
      badge: 'Assisted Non-Smartphone Desk',
      icon: '🏛️',
      color: 'amber',
      borderColor: 'border-amber-500',
      bgGlow: 'from-amber-950/40',
      activeTab: 'bg-amber-500 text-slate-950 font-bold',
      demoEmail: 'panchayat@agridrone.in',
      description: 'For Gram Panchayat Sachivs and CSC VLEs booking on behalf of marginal farmers who do not own smartphones.'
    },
    admin: {
      title: 'National Admin Directorate',
      badge: 'Directorate & Fleet Command',
      icon: '🛡️',
      color: 'sky',
      borderColor: 'border-sky-500',
      bgGlow: 'from-sky-950/40',
      activeTab: 'bg-sky-500 text-slate-950 font-bold',
      demoEmail: 'admin@agridrone.in',
      description: 'Centralized command for fleet monitoring across all 28 states, DGCA pilot compliance, and institutional tenders.'
    }
  };

  const currentRoleConfig = rolesConfig[selectedRole];

  const handle1ClickDemoLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await switchDemoRole(selectedRole);
      setSuccessMessage(`Authenticated successfully as ${currentRoleConfig.title}!`);
      setTimeout(() => {
        onAuthSuccess?.(selectedRole);
      }, 400);
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const email = formData.email || currentRoleConfig.demoEmail;
        const password = formData.password || 'password123';
        const res = await login({ email, password });
        if (res.success) {
          setSuccessMessage(`Welcome back, ${res.user?.name || currentRoleConfig.title}!`);
          setTimeout(() => {
            onAuthSuccess?.(res.user?.role || selectedRole);
          }, 400);
        }
      } else {
        // Sign up
        if (formData.password && formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const org =
          selectedRole === 'farmer'
            ? formData.farmName
            : selectedRole === 'operator'
            ? formData.organization || 'Prerna Drone Didi SHG'
            : formData.panchayatName || 'Gram Panchayat Office';

        const signupPayload = {
          name: formData.name || (selectedRole === 'farmer' ? 'Balwant Singh' : selectedRole === 'operator' ? 'Kavita Sharma' : 'Rajeshwar Nath'),
          email: formData.email,
          password: formData.password || 'password123',
          role: selectedRole,
          phone: formData.phone || '+91 98765 43210',
          village: formData.village,
          district: formData.district,
          organization: org
        };

        const res = await register(signupPayload);
        if (res.success) {
          setSuccessMessage(`Account created! Redirecting to ${currentRoleConfig.title} dashboard...`);
          setTimeout(() => {
            onAuthSuccess?.(selectedRole);
          }, 400);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 space-y-6">
        
        {/* Cancel / Close button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 text-slate-950 font-bold shadow-lg shadow-brand-500/20 mb-1">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            AgriDrone Hub Access
          </h2>
          <p className="text-xs sm:text-sm text-emerald-400 font-medium">
            “More Flights. Less Idle Time. Higher Farm Profitability.”
          </p>
        </div>

        {/* STEP 1: SELECT YOUR ROLE (All 4 Options) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
            Select Your Account Persona (All 4 Options)
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(rolesConfig).map((rKey) => {
              const r = rolesConfig[rKey];
              const isSelected = selectedRole === rKey;

              return (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => {
                    setSelectedRole(rKey);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                    isSelected
                      ? `${r.activeTab} border-brand-400 shadow-lg`
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-xs font-bold font-sans block truncate w-full">
                    {rKey === 'farmer' ? '1. Farmer' : rKey === 'operator' ? '2. Operator' : rKey === 'panchayat' ? '3. Panchayat' : '4. Admin'}
                  </span>
                  <span className={`text-[9px] truncate max-w-full hidden sm:block ${isSelected ? 'opacity-90' : 'text-slate-500'}`}>
                    {r.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center px-2 pt-1">
            {currentRoleConfig.description}
          </p>
        </div>

        {/* SIGN IN vs SIGN UP TAB TOGGLE */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${mode === 'login' ? 'bg-slate-800 text-white font-bold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In (लॉग इन)
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${mode === 'signup' ? 'bg-slate-800 text-white font-bold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Create New Account (साइन अप)
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2 animate-scaleUp">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2 animate-scaleUp">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1-CLICK DEMO AUTO-LOGIN (FOR EVALUATOR PITCHING) */}
        {mode === 'login' && (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-brand-500/30 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                Instant Ideathon Demo Access
              </span>
              <strong className="text-xs text-white">
                1-Click Demo Login as {currentRoleConfig.title}
              </strong>
            </div>

            <button
              type="button"
              onClick={handle1ClickDemoLogin}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shrink-0 shadow cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Demo Login</span>
            </button>
          </div>
        )}

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SIGN UP ADDITIONAL FIELDS */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name (पूरा नाम) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'farmer' ? 'e.g. Balwant Singh' : selectedRole === 'operator' ? 'e.g. Smt. Kavita Sharma' : 'e.g. Rajeshwar Nath'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number (फोन नंबर) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Village & District (गांव / जिला) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rampur Kalan, Lucknow"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Role-Specific Field */}
              {selectedRole === 'farmer' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Farm Name & Primary Crop
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Balwant Krishi Farm · Paddy (Rice)"
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              )}

              {selectedRole === 'operator' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SHG Federation / CHC Name & Drone ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prerna Drone Didi SHG · UAS UA-7849-NDD"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              )}

              {selectedRole === 'panchayat' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gram Panchayat Office & CSC Center ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rampur Kalan Gram Panchayat · CSC-LKO-4821"
                    value={formData.panchayatName}
                    onChange={(e) => setFormData({ ...formData, panchayatName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              )}
            </>
          )}

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address (ईमेल) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder={currentRoleConfig.demoEmail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none font-mono"
              />
            </div>
            {mode === 'login' && !formData.email && (
              <span className="text-[10px] text-slate-500 mt-1 block">
                Leave blank to auto-use demo credential: <strong className="text-slate-400 font-mono">{currentRoleConfig.demoEmail}</strong>
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Password (पासवर्ड) *
              </label>
              {mode === 'login' && (
                <span className="text-[10px] text-slate-500">
                  Default demo: <strong className="text-slate-400 font-mono">password123</strong>
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required={mode === 'signup'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD (SIGNUP ONLY) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password (पासवर्ड दोबारा लिखें) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-brand-500 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 hover:from-brand-300 shadow-xl shadow-brand-500/25 active:scale-[0.99] transition flex items-center justify-center space-x-2 text-sm cursor-pointer mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? `Sign In to ${currentRoleConfig.title}` : `Create ${currentRoleConfig.title} Account`}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>

        </form>

        {/* Rural Inclusion Guarantee Footer */}
        <div className="border-t border-slate-800 pt-3 text-center text-xs text-slate-500">
          <span>Non-smartphone smallholders can always book via their local </span>
          <button
            type="button"
            onClick={() => { setSelectedRole('panchayat'); setMode('login'); }}
            className="text-amber-400 font-semibold hover:underline inline-flex items-center cursor-pointer ml-1"
          >
            <span>Village Panchayat Kiosk</span>
          </button>
        </div>

      </div>
    </div>
  );
};
