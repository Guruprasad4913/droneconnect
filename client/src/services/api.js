const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('agridrone_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const api = {
  // Auth
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    demoLogin: async (role) => {
      const res = await fetch(`${BASE_URL}/auth/demo-login/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return handleResponse(res);
    }
  },

  // Bookings
  bookings: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/bookings`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    getMy: async () => {
      const res = await fetch(`${BASE_URL}/bookings/my`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    create: async (bookingData) => {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });
      return handleResponse(res);
    },
    getNearby: async (zone) => {
      const res = await fetch(`${BASE_URL}/bookings/nearby?zone=${encodeURIComponent(zone || '')}`);
      return handleResponse(res);
    },
    panchayatAssist: async (bookingData) => {
      const res = await fetch(`${BASE_URL}/bookings/panchayat-assist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });
      return handleResponse(res);
    },
    getPanchayatVillage: async (village) => {
      const res = await fetch(`${BASE_URL}/bookings/panchayat/village?village=${encodeURIComponent(village || '')}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    accept: async (id, data = {}) => {
      const res = await fetch(`${BASE_URL}/bookings/${id}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Clusters
  clusters: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/clusters`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/clusters/${id}`);
      return handleResponse(res);
    },
    autoCluster: async (farms) => {
      const res = await fetch(`${BASE_URL}/clusters/auto-cluster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farms })
      });
      return handleResponse(res);
    },
    accept: async (id) => {
      const res = await fetch(`${BASE_URL}/clusters/${id}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    dispatch: async (id) => {
      const res = await fetch(`${BASE_URL}/clusters/${id}/dispatch`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    complete: async (id) => {
      const res = await fetch(`${BASE_URL}/clusters/${id}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Drones
  drones: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/drones`);
      return handleResponse(res);
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${BASE_URL}/drones/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    },
    create: async (droneData) => {
      const res = await fetch(`${BASE_URL}/drones`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(droneData)
      });
      return handleResponse(res);
    }
  },

  // Batteries
  batteries: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/batteries`);
      return handleResponse(res);
    },
    getRecommendations: async () => {
      const res = await fetch(`${BASE_URL}/batteries/recommendations`);
      return handleResponse(res);
    },
    updateStatus: async (id, data) => {
      const res = await fetch(`${BASE_URL}/batteries/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Maintenance
  maintenance: {
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/maintenance`);
      return handleResponse(res);
    },
    resolveAlert: async (id) => {
      const res = await fetch(`${BASE_URL}/maintenance/alerts/${id}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Off-Season
  offSeason: {
    getContracts: async () => {
      const res = await fetch(`${BASE_URL}/off-season/contracts`);
      return handleResponse(res);
    },
    calculateRevenue: async (payload) => {
      const res = await fetch(`${BASE_URL}/off-season/calculate-revenue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    acceptMission: async (contractId) => {
      const res = await fetch(`${BASE_URL}/off-season/accept-mission`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ contractId })
      });
      return handleResponse(res);
    }
  },

  // Analytics
  analytics: {
    getPlatformKpis: async () => {
      const res = await fetch(`${BASE_URL}/analytics/platform-kpis`);
      return handleResponse(res);
    },
    calculateProfitability: async (params) => {
      const res = await fetch(`${BASE_URL}/analytics/profitability-calculator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return handleResponse(res);
    }
  },

  // Notifications
  notifications: {
    getAll: async (role = 'operator') => {
      const res = await fetch(`${BASE_URL}/notifications?role=${encodeURIComponent(role)}`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    markRead: async (id) => {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    accept: async (id, payload = {}) => {
      const res = await fetch(`${BASE_URL}/notifications/${id}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    markAllRead: async () => {
      const res = await fetch(`${BASE_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  }
};
