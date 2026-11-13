const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Available commercial survey contract types
const SURVEY_CATALOG = [
  {
    type: 'Panchayat Cadastral & Land Records Mapping',
    scheme: 'SVAMITVA Scheme (Ministry of Panchayati Raj)',
    ratePerAcre: 220,
    sensorRequired: '4K High-Res RGB Orthomosaic Camera',
    altitudeAgl: '60m (GSD 2.1 cm/px)',
    clientCategory: 'Government (B2G)',
    typicalAcreage: 180,
    description: 'High-resolution drone mapping of inhabited village land parcels (Abadi areas) for issuance of property cards.'
  },
  {
    type: 'Flood & Storm Crop Damage Assessment',
    scheme: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    ratePerAcre: 180,
    sensorRequired: 'Multispectral 5-Band (NIR+RedEdge)',
    altitudeAgl: '90m (GSD 3.4 cm/px)',
    clientCategory: 'Insurance Companies (B2B)',
    typicalAcreage: 120,
    description: 'Post-disaster loss estimation and localized lodging/inundation verification for rapid claim settlement.'
  },
  {
    type: 'Crop Health & NDVI Vegetation Index Scan',
    scheme: 'Precision Agri-Corporate Contract Farming',
    ratePerAcre: 150,
    sensorRequired: 'Multispectral 5-Band Sensor',
    altitudeAgl: '75m (GSD 2.8 cm/px)',
    clientCategory: 'Agri-Business & FPOs (B2B)',
    typicalAcreage: 100,
    description: 'Chlorophyll reflectance mapping to detect early nitrogen deficiency, moisture stress, and pest infestations.'
  },
  {
    type: 'Irrigation Canal & Watershed Topography',
    scheme: 'State Water Resources & Command Area Development',
    ratePerAcre: 200,
    sensorRequired: 'LiDAR & High-Resolution RGB',
    altitudeAgl: '80m (GSD 2.5 cm/px)',
    clientCategory: 'State Irrigation Dept (B2G)',
    typicalAcreage: 140,
    description: 'Digital Elevation Model (DEM) and volumetric siltation survey of irrigation branch canals.'
  }
];

// Active mock contracts in queue
let activeContracts = [
  {
    id: 'CTR-SVAMITVA-801',
    title: 'SVAMITVA Cadastral Survey - Block Bakshi Ka Talab',
    client: 'District Magistrate Office, Lucknow',
    serviceType: 'Panchayat Cadastral & Land Records Mapping',
    acreage: 160,
    ratePerAcre: 220,
    grossRevenue: 35200,
    status: 'open',
    deadline: '2026-10-15',
    sensor: '4K High-Res RGB Orthomosaic Camera',
    location: 'Bakshi Ka Talab (3 Villages)'
  },
  {
    id: 'CTR-PMFBY-802',
    title: 'PMFBY Lodging Audit Post-Thunderstorm',
    client: 'AIC of India (Agriculture Insurance)',
    serviceType: 'Flood & Storm Crop Damage Assessment',
    acreage: 110,
    ratePerAcre: 180,
    grossRevenue: 19800,
    status: 'assigned',
    assignedTo: 'Prerna Drone Didi SHG',
    deadline: '2026-10-08',
    sensor: 'Multispectral 5-Band (NIR+RedEdge)',
    location: 'Malapur & Rampur Sub-district'
  },
  {
    id: 'CTR-NDVI-803',
    title: 'Sugarcane Vigor Scan for Mill Procurement',
    client: 'Kisan Sahkari Chini Mills Ltd',
    serviceType: 'Crop Health & NDVI Vegetation Index Scan',
    acreage: 95,
    ratePerAcre: 150,
    grossRevenue: 14250,
    status: 'open',
    deadline: '2026-10-22',
    sensor: 'Multispectral 5-Band Sensor',
    location: 'Sultanpur Cluster'
  }
];

// @route   GET /api/off-season/contracts
router.get('/contracts', async (req, res) => {
  res.json({
    success: true,
    catalog: SURVEY_CATALOG,
    contracts: activeContracts
  });
});

// @route   POST /api/off-season/calculate-revenue
router.post('/calculate-revenue', (req, res) => {
  const { serviceType, acreage, ratePerAcre } = req.body;
  const acres = parseFloat(acreage) || 100;
  
  let rate = parseFloat(ratePerAcre);
  if (!rate) {
    const item = SURVEY_CATALOG.find(s => s.type === serviceType);
    rate = item ? item.ratePerAcre : 180;
  }

  const grossRevenue = acres * rate;
  const batteryWearCost = Math.round(acres * 18); // ~₹18/ac battery depreciation
  const pilotIncentive = Math.round(acres * 40); // ₹40/ac to Drone Didi pilot
  const fuelAndTransport = Math.round(acres * 15);
  const netOperatorProfit = grossRevenue - batteryWearCost - pilotIncentive - fuelAndTransport;
  const marginPct = Math.round((netOperatorProfit / grossRevenue) * 100);

  // Flight autopilot metrics
  const waypointsCount = Math.round(acres * 0.8 + 24);
  const estimatedFlightMinutes = Math.round(acres * 0.45 + 12);
  const batterySwaps = Math.ceil(estimatedFlightMinutes / 22);

  res.json({
    success: true,
    data: {
      serviceType: serviceType || 'Off-Season Commercial Mapping',
      acreage: acres,
      ratePerAcre: rate,
      financials: {
        grossRevenue,
        batteryWearCost,
        pilotIncentive,
        fuelAndTransport,
        netOperatorProfit,
        marginPct: `${marginPct}%`
      },
      autopilotSpecs: {
        waypointsCount,
        estimatedFlightMinutes,
        batterySwaps,
        gsdCmPerPixel: 2.4,
        flightAltitudeMeters: 60,
        surveyPattern: 'Double Grid Orthomosaic (75% Forward / 70% Side Overlap)'
      }
    }
  });
});

// @route   POST /api/off-season/accept-mission
router.post('/accept-mission', protect, (req, res) => {
  const { contractId } = req.body;
  const contract = activeContracts.find(c => c.id === contractId);

  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  contract.status = 'assigned';
  contract.assignedTo = req.user.name;

  res.json({
    success: true,
    message: `Mission '${contract.title}' accepted by ${req.user.name}! Waypoints queued to operator dispatch dashboard.`,
    data: contract
  });
});

module.exports = router;
