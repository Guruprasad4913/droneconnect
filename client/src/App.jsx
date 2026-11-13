import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { OperatorDashboard } from './components/OperatorDashboard';
import { PanchayatDashboard } from './components/PanchayatDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { InteractiveDemoFlowModal } from './components/InteractiveDemoFlowModal';
import { AuthPage } from './components/AuthPage';
import { OperatorIncomingBookingAlert } from './components/OperatorIncomingBookingAlert';
import { Plane, Shield, Sparkles, Heart } from 'lucide-react';

const AppContent = () => {
  const { role, switchDemoRole } = useAuth();
  const [activeView, setActiveView] = useState('home'); // 'home', 'farmer', 'operator', 'panchayat', 'admin'
  const [showDemoFlowModal, setShowDemoFlowModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-slate-950">
      
      {/* Navbar with 1-Click Role Switcher, Tagline, & 7-Step Demo Flow trigger */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenClusterDemo={() => {
          setActiveView('home');
          setTimeout(() => {
            const el = document.getElementById('cluster-demo-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenDemoFlow={() => setShowDemoFlowModal(true)}
      />

      {/* Main Body Container: 3 Core Dashboards (Farmer, Operator, Village Panchayat) */}
      <main className="flex-1 w-full">
        {activeView === 'home' && (
          <Homepage
            setActiveView={setActiveView}
            onOpenClusterDemo={() => {
              const el = document.getElementById('cluster-demo-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenDemoFlow={() => setShowDemoFlowModal(true)}
          />
        )}

        {/* Dashboard 1: Farmers (Users booking for their own fields) */}
        {activeView === 'farmer' && <FarmerDashboard />}

        {/* Dashboard 2: Drone Operators (Pilots / Drone Didis with drones) */}
        {activeView === 'operator' && <OperatorDashboard />}

        {/* Dashboard 3: Village Panchayats (Assisted bookings for non-smartphone farmers) */}
        {activeView === 'panchayat' && <PanchayatDashboard />}

        {/* Authentication Page: Sign In & Sign Up for all 3 Options */}
        {activeView === 'auth' && (
          <AuthPage
            initialRole={role || 'farmer'}
            onAuthSuccess={(targetRole) => setActiveView(targetRole)}
            onCancel={() => setActiveView('home')}
          />
        )}

        {/* Optional Administrative Directorate Analytics */}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Real-time Operator Incoming Booking Alert Banner / Toast with Chime */}
      <OperatorIncomingBookingAlert
        currentRole={role}
        activeView={activeView}
        onNavigateToOperator={() => setActiveView('operator')}
      />

      {/* Interactive 7-Step Demo Flow Modal */}
      <InteractiveDemoFlowModal
        isOpen={showDemoFlowModal}
        onClose={() => setShowDemoFlowModal(false)}
        onNavigateView={(view) => {
          setActiveView(view);
          setShowDemoFlowModal(false);
        }}
      />


      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <strong className="text-white font-sans">AgriDrone Hub</strong>
            <span>— “More Flights. Less Idle Time. Higher Farm Profitability.”</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <span>3 Dedicated Dashboards: Farmers · Drone Operators · Village Panchayats</span>
            <span>·</span>
            <span>Ideathon Track 2 Solution</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
