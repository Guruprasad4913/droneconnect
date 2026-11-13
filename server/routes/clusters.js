const express = require('express');
const router = express.Router();
const Cluster = require('../models/Cluster');
const Booking = require('../models/Booking');
const Drone = require('../models/Drone');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/clusters
router.get('/', async (req, res) => {
  try {
    const clusters = await Cluster.find().sort({ createdAt: -1 });
    res.json({ success: true, count: clusters.length, data: clusters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/clusters/:id
router.get('/:id', async (req, res) => {
  try {
    const cluster = await Cluster.findById(req.params.id);
    if (!cluster) {
      return res.status(404).json({ success: false, message: 'Cluster not found' });
    }
    res.json({ success: true, data: cluster });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/clusters/auto-cluster
// Spatial clustering demonstration algorithm (e.g., 2, 3, 4, 3 acres -> 12-acre cluster)
router.post('/auto-cluster', async (req, res) => {
  try {
    const { farms } = req.body;
    
    // Default 4 sample farms if none passed
    const farmList = farms && farms.length > 0 ? farms : [
      { name: 'Farm A (Ramesh Patel)', village: 'Rampur Kalan', acres: 2.0, crop: 'Paddy' },
      { name: 'Farm B (Sunita Devi)', village: 'Malapur', acres: 3.0, crop: 'Paddy' },
      { name: 'Farm C (Balwant Singh)', village: 'Khed', acres: 4.0, crop: 'Wheat' },
      { name: 'Farm D (Kishan Verma)', village: 'Rampur Khurd', acres: 3.0, crop: 'Cotton' }
    ];

    const totalAcreage = farmList.reduce((sum, f) => sum + (parseFloat(f.acres) || 0), 0);
    const farmerCount = farmList.length;

    // Route calculation metrics
    const soloTransitPerPlotKm = 8.5; // Average deadhead roundtrip per solo plot
    const individualDistanceKm = parseFloat((farmerCount * soloTransitPerPlotKm + totalAcreage * 0.4).toFixed(1));
    const totalDistanceKm = parseFloat((7.0 + totalAcreage * 0.6).toFixed(1)); // Contiguous loop
    const travelSavingsKm = parseFloat((individualDistanceKm - totalDistanceKm).toFixed(1));
    const fuelSavedLiters = parseFloat((travelSavingsKm * 0.24).toFixed(1)); // Generator fuel saved
    const estimatedFlightTimeMin = Math.round(totalAcreage * 5.2 + 6); // Spray time + transit
    
    // Battery calculation: 16,000mAh pack flies ~7 acres under optimal cluster conditions
    const packsNeeded = Math.ceil(totalAcreage / 6.5);
    const swapStopsCount = Math.max(0, packsNeeded - 1);
    const estimatedDischargePct = Math.min(100, Math.round((totalAcreage / (packsNeeded * 7)) * 85));

    // Pricing economics
    const soloRateTotal = totalAcreage * 400;
    const clusteredRateTotal = totalAcreage * 300;
    const farmerSavingsTotal = soloRateTotal - clusteredRateTotal;
    const operatorRevenue = clusteredRateTotal;
    const operatorCost = Math.round(totalAcreage * 54.5); // battery degradation + pilot fee
    const estimatedProfit = operatorRevenue - operatorCost;

    const sequence = [
      'Hub Base (Launch Point)',
      ...farmList.map(f => `${f.name} - ${f.acres} ac (${f.village})`),
      'Hub Base (Safe Return)'
    ];

    // If battery swap is needed, inject into sequence
    if (swapStopsCount > 0) {
      sequence.splice(3, 0, 'Mobile Solar Van (Quick Battery Swap)');
    }

    const waypoints = [
      { id: 'WP-0', name: 'Hub Center Base', type: 'base', lat: 26.8467, lng: 80.9462, acres: 0 },
      { id: 'WP-1', name: farmList[0].name, type: 'farm', lat: 26.8510, lng: 80.9525, acres: farmList[0].acres },
      { id: 'WP-2', name: farmList[1].name, type: 'farm', lat: 26.8580, lng: 80.9605, acres: farmList[1].acres },
      { id: 'WP-3', name: 'Mobile Solar Van', type: 'charging-stop', lat: 26.8590, lng: 80.9510, acres: 0 },
      { id: 'WP-4', name: farmList[2].name, type: 'farm', lat: 26.8625, lng: 80.9410, acres: farmList[2].acres },
      { id: 'WP-5', name: farmList[3] ? farmList[3].name : 'Farm End', type: 'farm', lat: 26.8430, lng: 80.9590, acres: farmList[3] ? farmList[3].acres : 0 },
      { id: 'WP-6', name: 'Hub Base (Safe Return)', type: 'base', lat: 26.8467, lng: 80.9462, acres: 0 }
    ];

    res.json({
      success: true,
      clusterDemo: {
        title: `Smart Spatial Cluster: ${totalAcreage} Acres (${farmerCount} Farms Combined)`,
        hubZone: 'Zone North (3–5 km Radius Hub)',
        farmerCount,
        totalAcreage,
        optimizedRoute: {
          sequence,
          totalDistanceKm,
          individualDistanceKm,
          travelSavingsKm,
          fuelSavedLiters,
          estimatedFlightTimeMin
        },
        batteryRequirements: {
          packsNeeded,
          swapStopsCount,
          estimatedDischargePct,
          recommendation: 'Mobile Solar Van dispatched to Waypoint 3 for seamless 2-minute battery exchange.'
        },
        pricing: {
          soloRateTotal,
          clusteredRateTotal,
          farmerSavingsTotal,
          operatorRevenue,
          operatorCost,
          estimatedProfit,
          discountPercentage: '25% Cost Reduction for Farmers'
        },
        waypoints
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/clusters/:id/accept
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const cluster = await Cluster.findById(req.params.id);
    if (!cluster) {
      return res.status(404).json({ success: false, message: 'Cluster not found' });
    }

    cluster.status = 'accepted';
    cluster.operatorId = req.user._id || req.user.id;
    cluster.operatorName = req.user.name;
    await cluster.save();

    await Booking.updateMany(
      { clusterId: cluster._id },
      { status: 'assigned' }
    );

    res.json({
      success: true,
      message: `Cluster ${cluster.hubCode} successfully accepted by ${req.user.name}. Ready for autopilot dispatch!`,
      data: cluster
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/clusters/:id/dispatch
router.put('/:id/dispatch', protect, async (req, res) => {
  try {
    const cluster = await Cluster.findById(req.params.id);
    if (!cluster) {
      return res.status(404).json({ success: false, message: 'Cluster not found' });
    }

    cluster.status = 'dispatched';
    await cluster.save();

    await Booking.updateMany(
      { clusterId: cluster._id },
      { status: 'in-progress' }
    );

    res.json({
      success: true,
      message: `Autopilot flight plan loaded for Cluster ${cluster.hubCode}. Coordinates synced with 4G RTK base station. Flight in progress!`,
      data: cluster
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/clusters/:id/complete
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const cluster = await Cluster.findById(req.params.id);
    if (!cluster) {
      return res.status(404).json({ success: false, message: 'Cluster not found' });
    }

    cluster.status = 'completed';
    await cluster.save();

    await Booking.updateMany(
      { clusterId: cluster._id },
      { status: 'completed' }
    );

    // Update Drone stats
    if (cluster.droneId) {
      await Drone.findByIdAndUpdate(cluster.droneId, {
        $inc: {
          totalFlightHours: (cluster.optimizedRoute.estimatedFlightTimeMin / 60),
          completedAcres: cluster.totalAcreage
        },
        status: 'available'
      });
    }

    res.json({
      success: true,
      message: `Mission completed for ${cluster.totalAcreage} acres! Revenue of ₹${cluster.pricing.operatorRevenue} credited to operator account. Off-season survey jobs recommended.`,
      data: cluster
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
