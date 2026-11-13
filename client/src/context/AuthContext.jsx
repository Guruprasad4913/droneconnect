import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const DICTIONARY = {
  en: {
    hero_tagline: "More Flights. Less Idle Time. Higher Farm Profitability.",
    hero_sub: "Decentralized demand aggregation, 3–5 km farm clustering, smart battery logistics, predictive maintenance and off-season revenue diversification for SHGs, Custom Hiring Centres, and farmers.",
    create_cluster_btn: "Create Smart Farm Cluster (Interactive Demo)",
    solo_vs_cluster: "Solo vs Clustered Economics",
    farmer_portal: "Farmer Portal",
    operator_portal: "Operator Command Center",
    admin_portal: "National Hub Directorate",
    switch_role: "Switch Demo Role",
    logout: "Sign Out",
    dgca_badge: "DGCA Status: GREEN ZONE (Permission Exempt < 400ft AGL)"
  },
  hi: {
    hero_tagline: "अधिक उड़ानें। कम खाली समय। अधिक कृषि लाभ।",
    hero_sub: "स्वयं सहायता समूहों (SHGs), कस्टम हायरिंग केंद्रों (CHCs) और किसानों के लिए मांग एकत्रीकरण, 3–5 किमी खेत क्लस्टरिंग, स्मार्ट बैटरी लॉजिस्टिक्स, भविष्यसूचक रखरखाव और ऑफ-सीजन राजस्व विविधीकरण।",
    create_cluster_btn: "स्मार्ट फार्म क्लस्टर बनाएं (इंटरैक्टिव डेमो)",
    solo_vs_cluster: "एकल बनाम क्लस्टर्ड अर्थशास्त्र",
    farmer_portal: "किसान पोर्टल",
    operator_portal: "ऑपरेटर कमांड सेंटर",
    admin_portal: "राष्ट्रीय हब निदेशालय",
    switch_role: "डेमो भूमिका बदलें",
    logout: "लॉगआउट",
    dgca_badge: "DGCA स्थिति: ग्रीन ज़ोन (400 फीट तक अनुमति-मुक्त)"
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agridrone_token') || null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');

  // Load user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          }
        } catch (err) {
          console.warn('Session expired or offline. Initializing default demo operator role.');
          // Auto-init as operator for rich view
          switchDemoRole('operator');
        }
      } else {
        // By default, set demo operator for impressive initial load
        switchDemoRole('operator');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.auth.login(credentials);
    if (res.success) {
      localStorage.setItem('agridrone_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success) {
      localStorage.setItem('agridrone_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('agridrone_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role) => {
    try {
      const res = await api.auth.demoLogin(role);
      if (res.success) {
        localStorage.setItem('agridrone_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err) {
      // Offline fallback profile
      const fallbackProfiles = {
        farmer: { id: 'demo-farmer', name: 'Balwant Singh', role: 'farmer', village: 'Rampur Kalan', organization: 'Balwant Krishi Farm' },
        operator: { id: 'demo-operator', name: 'Smt. Kavita Sharma (Drone Didi)', role: 'operator', village: 'Rampur Hub Base', organization: 'Prerna Drone Didi SHG' },
        panchayat: { id: 'demo-panchayat', name: 'Shri Rajeshwar Nath (Gram Pradhan)', role: 'panchayat', village: 'Rampur Kalan', organization: 'Rampur Kalan Gram Panchayat & CSC Hub' },
        admin: { id: 'demo-admin', name: 'Dr. Rajiv Menon', role: 'admin', village: 'State Directorate', organization: 'National CHC Federation' }
      };
      setUser(fallbackProfiles[role] || fallbackProfiles.panchayat);
    }
  };

  const t = (key) => {
    return DICTIONARY[lang]?.[key] || DICTIONARY.en[key] || key;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'operator',
        loading,
        lang,
        setLang,
        t,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
