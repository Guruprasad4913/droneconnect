# 🌱 AgriDrone Hub

> **"More Flights. Less Idle Time. Higher Farm Profitability."**

An enterprise-grade, full-stack AgriTech web platform engineered for **Women Self-Help Groups (Namo Drone Didis)**, **Farmer Producer Organisations (FPOs)**, **Custom Hiring Centres (CHCs)**, and **Independent Drone Pilots** to eliminate under-utilisation and make agricultural drone operations sustainably profitable.

---

## 🎯 The Core Problem Solved

Agricultural spraying drones typically suffer from severe economic roadblocks:
1. **7–8 Months of Off-Season Idle Downtime**: Drones fly only 40–50 days a year during peak Kharif and Rabi spraying windows, leaving high-capital equipment sitting dormant.
2. **Plot Fragmentation & Transit Battery Losses**: Transporting drones to spray a single 1–2 acre farm expends significant travel time and battery energy on transit rather than active spraying.
3. **High Unit Costs for Smallholder Farmers**: Solo spray rates (₹400–₹500/acre) are costly for smallholders, while operators struggle to cover battery depreciation and fuel costs.

### 💡 AgriDrone Hub's Core Innovation:

AgriDrone Hub solves these challenges by transforming drones into **year-round revenue-generating assets**:
- **Spatial Radius Cluster Aggregation (3–5 km)**: Automatically aggregates neighboring smallholder plots (e.g. 2 + 3 + 4 + 3 = 12 Acres) into a single continuous flight corridor, reducing farmer costs to **₹300/acre** and cutting operator deadhead transit by **68%**.
- **Off-Season Revenue Engine**: Unlocks year-round institutional contracts (SVAMITVA rural land titling, PMFBY crop insurance damage assessments, NDVI multispectral health analysis, and irrigation canal topography).
- **Intelligent Fleet Operations**: Integrated Smart Route Planning, Real-time LiPo Battery Management, Predictive Maintenance analytics, and an interactive Operator Profitability Calculator.

---

## 🚀 Key Modules & Capabilities

### 1. 🌾 Interactive 12-Acre Demo Cluster (`ClusterDemoSection`)
- Prominent interactive demonstration combining sample farms:
  - **Farm A (2.0 Ac - Rice)** · **Farm B (3.0 Ac - Sugarcane)** · **Farm C (4.0 Ac - Cotton)** · **Farm D (3.0 Ac - Maize)**
- Toggles between fragmented solo bookings and an aggregated **12-Acre Cluster**:
  - **Flight Corridor**: 4 fragmented trips (14.2 km transit) consolidated into **1 optimized 4.8 km route** (66% transit reduction).
  - **Battery Cycles**: Reduced from 8 fragmented cycles to **3 contiguous cycles**.
  - **Travel Time Saved**: 2.5 hours of transit saved; operator net profit surges from ₹1,400 to **₹2,640**.

### 2. 🗺️ Smart Route Planner (Leaflet Map)
- Interactive spatial map displaying:
  - **Drone Base Hub** (KisanDrone Hexa-10L / Garuda 16L).
  - **3 km Optimal Aggregation Hub Ring** (Zero transit energy loss zone).
  - **5 km Outer Geofence Limit**.
  - **Contiguous Waypoints**: `Base` ➔ `Farm A` ➔ `Farm B` ➔ `Mobile Solar Van (Battery Swap #1)` ➔ `Farm C` ➔ `Farm D` ➔ `Base`.
  - Waypoint metrics: Distance, altitude, battery reserves, and stop type.

### 3. 🔋 Battery Health & Charging Logistics (`/api/batteries`)
- Tracks 16,000mAh 6S/12S Smart LiPo batteries with real-time telemetry:
  - **SoC (%) & Cell Voltages**: Identifies cell voltage drift and temperature abnormalities.
  - **Cycle Count vs Max Lifetime** (e.g. Pack Alpha: 142/300 cycles, 91% Health).
  - **Smart Charging Logistics**: Recommends 1C field charging via Mobile Solar Van to prevent thermal stress and maximize cycle longevity.

### 4. 🛠️ Predictive Maintenance Dashboard (`/api/maintenance`)
- Real-time diagnostic scores for critical flight components:
  - **BLDC Motors (M1 to M6)**: Vibration and thermal monitoring (94% avg health).
  - **Dual Carbon Propellers**: Tip wear and balance inspection.
  - **Centrifugal Spray Pump & Flow Meter**: Pressure consistency and nozzle clogging prevention.
  - **Predictive Warning Triggers**: Proactive alerts before in-flight motor or telemetry failures.

### 5. 🛰️ Off-Season Institutional Revenue Engine (`/api/off-season`)
- Unlocks contracts that bridge the 7-month Kharif/Rabi downtime:
  - **SVAMITVA Scheme**: High-resolution photogrammetric land mapping (₹220/ac).
  - **PMFBY Crop Insurance Damage Scans**: Fast-track catastrophe loss assessment (₹180/ac).
  - **Multispectral NDVI Crop Health Analysis**: Nitrogen and water stress mapping (₹250/ac).
  - **State Irrigation Dept Canal Topography**: Canal bund integrity scanning (₹350/km).

### 6. 📊 Operator Profitability Calculator & Analytics
- Dynamic financial simulator showing:
  - Fleet size, active spray days, and off-season survey days.
  - Gross revenue, direct chemical/battery expenses, and net profit per acre.
  - Projected monthly cash flows and a **14-month drone payback model** (vs. 48+ months for traditional solo models).

### 7. 👥 Role-Based Dashboards (JWT Protected + 1-Click Role Switcher)
- **Farmer Dashboard**: Plot registration, crop selection, acreage, chemical input, instant radius cluster detection, and booking history.
- **Operator Dashboard**: Hub dispatch, Smart Route Planner, Battery Management, Maintenance, Off-Season bids, and Profitability Simulator.
- **Admin Dashboard**: National SHG Directorate metrics, Recharts monthly utilization trends, and regional drone registry.
- **Digital Spraying Certificate & Invoice Modal**: DGCA & Ministry of Agriculture aligned receipt with QR code, GPS coordinates, pilot certification, and ₹100/ac cluster subsidy verification.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, Leaflet |
| **Backend** | Node.js, Express.js REST APIs, Mongoose, JWT, Morgan, CORS |
| **Database** | MongoDB (Native Windows service / local instance) |
| **Authentication** | JSON Web Tokens (JWT) + BCrypt + 1-Click Demo Auto-Login |

---

## 📁 Project Architecture

```
Drone service/
├── client/                           # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Tagline, DGCA ticker, weather advisory, role switcher
│   │   │   ├── Homepage.jsx          # Hero, problem/solution, 4-step pipeline, cluster demo
│   │   │   ├── ClusterDemoSection.jsx# 12-Acre interactive demo cluster
│   │   │   ├── ClusterVisualizerMap.jsx# Leaflet map with 3km/5km rings & flight corridor
│   │   │   ├── FarmerDashboard.jsx   # Booking form & spatial cluster detection
│   │   │   ├── OperatorDashboard.jsx # Route Planner, Batteries, Maintenance, Off-Season
│   │   │   ├── AdminDashboard.jsx    # Recharts analytics & national fleet table
│   │   │   └── DigitalSprayCertificateModal.jsx # Printable verified certificate with QR
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth provider & English/Hindi bilingual toggle
│   │   ├── services/
│   │   │   └── api.js                # Full Axios/Fetch API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                           # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                   # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js                   # Farmers, Operators, Admins
│   │   ├── Drone.js                  # Hexa-10L, Garuda 16L fleet specs
│   │   ├── Booking.js                # Spatial bookings & pricing tiers
│   │   ├── Cluster.js                # 12-acre cluster models & route waypoints
│   │   ├── Battery.js                # Smart LiPo packs & telemetry
│   │   └── Maintenance.js            # BLDC motors, pump, nozzles & predictive alerts
│   ├── routes/
│   │   ├── auth.js                   # Auth & instant demo login
│   │   ├── bookings.js               # Bookings & spatial radius detection
│   │   ├── clusters.js               # Auto-clustering & lifecycle
│   │   ├── drones.js                 # Fleet management
│   │   ├── batteries.js              # Battery telemetry & charging advice
│   │   ├── maintenance.js            # Component health diagnostics
│   │   ├── offSeason.js              # Institutional survey contracts
│   │   └── analytics.js              # Directorate KPIs & profit calculator
│   ├── seedData.js                   # Comprehensive realistic seed data
│   ├── index.js                      # Express server entry point
│   └── package.json
│
├── start_app.bat                     # 1-Click Windows Launcher
└── README.md
```

---

## ⚡ How to Run Locally

### Quick Start (Windows 1-Click)
Simply double click `start_app.bat` or run:
```cmd
start_app.bat
```

### Manual Start

#### 1. Backend Server & Database
```bash
cd server
# (Optional) Customize MongoDB URI in server/.env (defaults to 'drone_service_db')
node index.js
```
The server will connect to the dedicated database `drone_service_db` on `http://localhost:5000` and automatically seed it with realistic demo clusters, drones, batteries, and bookings.

To manually re-initialize or reset the database at any time:
```bash
npm run seed
```

#### 2. Frontend Client
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Credentials (Or Use 1-Click Role Switcher in Top Navigation)

| Role | Email | Password | Primary Feature Showcase |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@agridrone.in` | `password123` | Booking, Cluster Detection, ₹100/ac discount |
| **Operator** | `operator@agridrone.in` | `password123` | Smart Route Planner, Battery & Maintenance, Off-Season |
| **Admin** | `admin@agridrone.in` | `password123` | National SHG Fleet Analytics, Monthly Trends |

---

## 🏆 Ideathon & Track Alignment

**Track 2: Making Agri-Drone Services Profitable**
- **Proves Unit Economics**: Cuts per-acre spray rates for farmers while doubling operator daily throughput from 8 acres to 24+ acres.
- **Empowers Drone Didis**: Designed specifically around rural SHG federation workflows, mobile solar charging logistics, and standardized digital certificates.
- **Eliminates Seasonal Downtime**: Year-round institutional surveying contracts ensure consistent monthly income across all 12 calendar months.
