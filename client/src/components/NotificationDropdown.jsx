import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { emitRealtimeEvent, subscribeToRealtimeEvents } from '../services/realtimeEvents';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  MapPin,
  X
} from 'lucide-react';

export const NotificationDropdown = ({ onNavigateToOperator }) => {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [recentAcceptMessage, setRecentAcceptMessage] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.notifications.getAll('operator');
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (e) {
      console.warn('Notifications fetch fallback');
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Fast 5-second polling for real-time alerts
    const interval = setInterval(fetchNotifications, 5000);

    // Subscribe to cross-tab and local booking events
    const unsubscribe = subscribeToRealtimeEvents({
      agridrone_booking_created: () => {
        fetchNotifications();
      },
      agridrone_notification_updated: () => {
        fetchNotifications();
      },
      agridrone_booking_accepted: () => {
        fetchNotifications();
      }
    });

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      // optimistic update
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleAcceptBooking = async (notif, e) => {
    e?.stopPropagation();
    setLoadingActionId(notif._id);
    try {
      const operatorName = user?.name || 'Smt. Kavita Sharma (Drone Didi)';
      const droneUasId = 'UA-7849-NDD';

      const res = await api.notifications.accept(notif._id, {
        operatorName,
        droneUasId
      });

      if (res.success) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notif._id
              ? { ...n, isAccepted: true, isRead: true, acceptedBy: operatorName, acceptedAt: new Date() }
              : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        setRecentAcceptMessage(`Corridor Locked for ${notif.farmerName || 'Farmer'}! (${notif.acreage} Ac)`);

        // Notify other components (FarmerDashboard, OperatorDashboard, cross-tab)
        emitRealtimeEvent('agridrone_booking_accepted', {
          bookingId: notif.bookingId,
          notifId: notif._id,
          farmerName: notif.farmerName,
          crop: notif.crop,
          acreage: notif.acreage,
          village: notif.village,
          acceptedBy: operatorName,
          droneUasId
        });

        setTimeout(() => setRecentAcceptMessage(null), 5000);
      }
    } catch (err) {
      // Fallback optimistic
      setNotifications(prev =>
        prev.map(n =>
          n._id === notif._id
            ? { ...n, isAccepted: true, isRead: true, acceptedBy: 'Smt. Kavita Sharma (Drone Didi)', acceptedAt: new Date() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      emitRealtimeEvent('agridrone_booking_accepted', {
        bookingId: notif.bookingId,
        notifId: notif._id,
        farmerName: notif.farmerName,
        crop: notif.crop,
        acreage: notif.acreage,
        village: notif.village,
        acceptedBy: 'Smt. Kavita Sharma (Drone Didi)',
        droneUasId: 'UA-7849-NDD'
      });
      setRecentAcceptMessage(`Corridor Locked for ${notif.farmerName || 'Farmer'}!`);
      setTimeout(() => setRecentAcceptMessage(null), 5000);
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer flex items-center justify-center shadow-sm"
        title="Drone Operator Notifications & Booking Requests"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-amber-400 animate-wiggle" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-4 min-w-4 px-1 bg-rose-600 text-[10px] font-bold text-white font-mono shadow-md">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notifications Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-scaleUp">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h4 className="font-display font-bold text-sm text-white">Operator Dispatch Radar</h4>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Toast on Acceptance */}
          {recentAcceptMessage && (
            <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-3.5 py-2 flex items-center space-x-2 text-xs text-emerald-300 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{recentAcceptMessage}</span>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
                <p className="text-xs">All drone flight corridors cleared.</p>
                <span className="text-[10px] text-slate-500 block">No pending farmer bookings</span>
              </div>
            ) : (
              notifications.map((notif) => {
                const isNewBooking = notif.type === 'new_booking';
                return (
                  <div
                    key={notif._id}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                    className={`p-3.5 transition flex flex-col space-y-2 cursor-pointer ${
                      !notif.isRead
                        ? 'bg-slate-800/40 hover:bg-slate-800/60 border-l-2 border-brand-500'
                        : 'hover:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isNewBooking ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        }`}>
                          {isNewBooking ? <Plane className="w-4 h-4 transform -rotate-45" /> : <Sparkles className="w-4 h-4" />}
                        </span>
                        <div>
                          <h5 className="font-semibold text-xs text-white leading-snug">
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500 inline mr-0.5" />
                            {new Date(notif.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            {notif.village && <span> · {notif.village}</span>}
                          </span>
                        </div>
                      </div>

                      {notif.estimatedRevenue && (
                        <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          +₹{notif.estimatedRevenue}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 pl-9">
                      {notif.message}
                    </p>

                    {/* Booking Acceptance Action Box */}
                    {isNewBooking && (
                      <div className="pl-9 pt-1 flex items-center justify-between gap-2">
                        {notif.isAccepted ? (
                          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Corridor Locked ({notif.acceptedBy || 'Pilot Assigned'})</span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleAcceptBooking(notif, e)}
                            disabled={loadingActionId === notif._id}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                            <span>{loadingActionId === notif._id ? 'Locking Corridor...' : '⚡ Accept Booking'}</span>
                          </button>
                        )}

                        <span className="text-[10px] text-slate-500 font-mono">
                          {notif.acreage ? `${notif.acreage} Ac · 300/ac` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Drone Dispatch Fleet: Active</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToOperator?.();
              }}
              className="text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1 cursor-pointer transition"
            >
              <span>Operator Command</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
