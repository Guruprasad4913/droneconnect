import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plane, ShieldCheck, Wind, Globe, User, LogOut, CheckCircle2, ChevronDown, CloudSun } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { WeatherWidget, getFallbackWeatherData } from './WeatherWidget';

export const Navbar = ({ activeView, setActiveView, onOpenClusterDemo, onOpenDemoFlow }) => {
  const { user, role, switchDemoRole, lang, setLang, t, logout } = useAuth();
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [weather, setWeather] = useState(getFallbackWeatherData);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const portalMenuRef = useRef(null);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setWeather(data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (portalMenuRef.current && !portalMenuRef.current.contains(e.target)) {
        setShowPortalMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      
      {/* Top DGCA Compliance & Micro-Climate Spray Advisory Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1 text-[11px] flex flex-wrap items-center justify-between text-slate-400 gap-2">
        <div className="flex items-center space-x-3 overflow-x-auto">
          <span className="flex items-center text-emerald-400 font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
            {t('dgca_badge')}
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <button
            onClick={() => setShowWeatherModal(true)}
            className="hidden sm:flex items-center text-slate-300 hover:text-white transition cursor-pointer bg-slate-900/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-800"
            title="Click to view Today & Tomorrow's Spray Forecast"
          >
            <Wind className="w-3.5 h-3.5 text-sky-400 mr-1" />
            {weather ? (
              <span className="flex items-center space-x-1.5">
                <span>Today: <strong className="text-white font-mono">{weather.today?.windSpeed || weather.current?.windSpeed} km/h</strong> · {weather.today?.currentTemp || weather.current?.temperature}°C · {weather.today?.droneAdvisory?.label || 'Optimal'}</span>
                <span className="text-sky-400 font-semibold underline underline-offset-2 ml-1">Today &amp; Tomorrow Forecast ↗</span>
              </span>
            ) : (
              <span>Weather Forecast (Today &amp; Tomorrow) ↗</span>
            )}
          </button>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-400 font-mono">
            RTK GPS Accuracy: &lt; 2.5 cm · RTK Base Lock Active
          </span>
        </div>

        <div className="flex items-center space-x-3 ml-auto">
          {/* 1-Click Demo Role Switcher (Crucial for Evaluator Pitching!) */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <span className="text-[10px] text-slate-500 uppercase px-1 hidden lg:inline">Demo Persona:</span>
            
            <button
              onClick={() => { switchDemoRole('farmer'); setActiveView('farmer'); }}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${role === 'farmer' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              👨‍🌾 Farmer
            </button>

            <button
              onClick={() => { switchDemoRole('operator'); setActiveView('operator'); }}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${role === 'operator' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              🛰️ Operator
            </button>

            <button
              onClick={() => { switchDemoRole('panchayat'); setActiveView('panchayat'); }}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${role === 'panchayat' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              🏛️ Panchayat Kiosk
            </button>

            <button
              onClick={() => { switchDemoRole('admin'); setActiveView('admin'); }}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${role === 'admin' ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              🛡️ Admin
            </button>
          </div>

          {/* Bilingual Switcher EN / HI */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${lang === 'en' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${lang === 'hi' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('home')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-tech-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Plane className="w-6 h-6 text-slate-950 transform -rotate-45 animate-flight-bob" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">AgriDrone Hub</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">Production AI Platform</span>
              </div>
              <p className="text-xs text-emerald-400/90 font-medium">“More Flights. Less Idle Time. Higher Farm Profitability.”</p>
            </div>
          </div>

          {/* Central Navigation Links - Context-Aware: Only displays what is required for the current view */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            {/* Overview / Home button */}
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeView === 'home'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Overview
            </button>

            {/* When on Home / Overview: Show clean portal navigation links */}
            {activeView === 'home' && (
              <>
                <button
                  onClick={() => setActiveView('farmer')}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  Farmer Portal
                </button>

                <button
                  onClick={() => setActiveView('operator')}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  Operator Command
                </button>

                <button
                  onClick={() => setActiveView('panchayat')}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  🏛️ Panchayat Kiosk
                </button>

                <button
                  onClick={() => setActiveView('admin')}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  🛡️ Admin Console
                </button>
              </>
            )}

            {/* When on Farmer Dashboard: Only show Farmer Dashboard item */}
            {activeView === 'farmer' && (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center space-x-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>👨‍🌾 Farmer Dashboard</span>
              </span>
            )}

            {/* When on Operator Command: Only show Operator Command item */}
            {activeView === 'operator' && (
              <span className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold flex items-center space-x-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                <span>🛰️ Operator Command Center</span>
              </span>
            )}

            {/* When on Panchayat Kiosk: Only show Panchayat Kiosk item */}
            {activeView === 'panchayat' && (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center space-x-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>🏛️ Village Panchayat Kiosk</span>
              </span>
            )}

            {/* When on Admin Directorate: Only show Admin Directorate item */}
            {activeView === 'admin' && (
              <span className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold flex items-center space-x-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                <span>🛡️ National Directorate (Admin)</span>
              </span>
            )}

            {/* When on Auth Portal: Only show Auth Portal */}
            {activeView === 'auth' && (
              <span className="px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/40 font-semibold">
                Sign In / Registration
              </span>
            )}

            {/* Compact Switcher Dropdown (Only when inside a dashboard, to allow quick switching) */}
            {activeView !== 'home' && activeView !== 'auth' && (
              <div className="relative" ref={portalMenuRef}>
                <button
                  onClick={() => setShowPortalMenu(!showPortalMenu)}
                  className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer flex items-center space-x-1 text-xs border border-slate-800"
                >
                  <span>Switch Portal</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showPortalMenu && (
                  <div className="absolute left-0 mt-1 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 z-50 animate-scaleUp">
                    {activeView !== 'farmer' && (
                      <button
                        onClick={() => { setActiveView('farmer'); setShowPortalMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <span>👨‍🌾 Farmer Dashboard</span>
                      </button>
                    )}
                    {activeView !== 'operator' && (
                      <button
                        onClick={() => { setActiveView('operator'); setShowPortalMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-indigo-300 hover:bg-slate-800 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <span>🛰️ Operator Command</span>
                      </button>
                    )}
                    {activeView !== 'panchayat' && (
                      <button
                        onClick={() => { setActiveView('panchayat'); setShowPortalMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <span>🏛️ Panchayat Kiosk</span>
                      </button>
                    )}
                    {activeView !== 'admin' && (
                      <button
                        onClick={() => { setActiveView('admin'); setShowPortalMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-sky-300 hover:bg-slate-800 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <span>🛡️ Admin Directorate</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Notification Bell & User Profile Pill */}
          <div className="flex items-center space-x-2">
            {/* Notification of incoming bookings & status: Drone Operator Radar */}
            {(role === 'operator' || activeView === 'operator') && (
              <NotificationDropdown onNavigateToOperator={() => setActiveView('operator')} />
            )}

            <button
              onClick={() => setActiveView('auth')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'auth'
                  ? 'bg-brand-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span>Sign In / Sign Up</span>
            </button>

            {user && (
              <div className="hidden lg:flex items-center space-x-2 pl-1 border-l border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-[140px]">{user.name}</span>
                  <span className="text-[10px] text-emerald-400 uppercase font-mono">{user.role}</span>
                </div>
                <button
                  onClick={() => { logout(); setActiveView('auth'); }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {showWeatherModal && (
        <WeatherWidget isModal={true} onClose={() => setShowWeatherModal(false)} />
      )}
    </header>
  );
};
