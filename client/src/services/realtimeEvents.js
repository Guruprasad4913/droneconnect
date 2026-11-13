// Universal Real-Time Event Bus with Cross-Tab Broadcast & LocalStorage Fallback

const CHANNEL_NAME = 'agridrone_realtime_bus';
let broadcastChannel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  // Fallback to storage event
}

/**
 * Emits a real-time event across the current tab and all other open tabs/windows
 * @param {string} eventName - e.g. 'agridrone_booking_created', 'agridrone_booking_accepted'
 * @param {any} data - payload
 */
export function emitRealtimeEvent(eventName, data = {}) {
  const payload = {
    eventName,
    data,
    timestamp: Date.now()
  };

  // 1. Dispatch in current window
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  // 2. Broadcast across tabs via BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch (e) {}
  }

  // 3. Fallback broadcast across tabs via localStorage storage event
  try {
    localStorage.setItem('agridrone_last_event', JSON.stringify(payload));
  } catch (e) {}
}

/**
 * Subscribes to real-time events across both the current window and other tabs
 * @param {Object} handlers - Map of { eventName: (data) => void }
 * @returns {Function} unsubscribe function
 */
export function subscribeToRealtimeEvents(handlers = {}) {
  if (typeof window === 'undefined') return () => {};

  // Handler for window CustomEvents (same window)
  const windowListeners = [];
  Object.keys(handlers).forEach((eventName) => {
    const fn = (e) => {
      handlers[eventName]?.(e.detail);
    };
    window.addEventListener(eventName, fn);
    windowListeners.push({ eventName, fn });
  });

  // Handler for BroadcastChannel (other tabs)
  const handleBroadcastMessage = (event) => {
    const { eventName, data } = event.data || {};
    if (eventName && handlers[eventName]) {
      handlers[eventName](data);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  // Handler for localStorage event (storage across tabs fallback)
  const handleStorageChange = (e) => {
    if (e.key === 'agridrone_last_event' && e.newValue) {
      try {
        const { eventName, data } = JSON.parse(e.newValue);
        if (eventName && handlers[eventName]) {
          handlers[eventName](data);
        }
      } catch (err) {}
    }
  };
  window.addEventListener('storage', handleStorageChange);

  // Return unsubscribe
  return () => {
    windowListeners.forEach(({ eventName, fn }) => {
      window.removeEventListener(eventName, fn);
    });
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorageChange);
  };
}
