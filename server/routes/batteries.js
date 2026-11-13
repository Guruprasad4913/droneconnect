const express = require('express');
const router = express.Router();
const Battery = require('../models/Battery');
const { protect } = require('../middleware/auth');

// @route   GET /api/batteries
router.get('/', async (req, res) => {
  try {
    const batteries = await Battery.find().sort({ label: 1 });
    
    // Calculate aggregate fleet health
    const totalPacks = batteries.length;
    const avgHealth = totalPacks > 0
      ? Math.round(batteries.reduce((sum, b) => sum + b.healthPct, 0) / totalPacks)
      : 92;
    const readyPacks = batteries.filter(b => b.status === 'ready').length;

    res.json({
      success: true,
      count: totalPacks,
      summary: {
        totalPacks,
        readyPacks,
        avgHealth,
        chargingPacks: batteries.filter(b => b.status === 'charging').length
      },
      data: batteries
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/batteries/recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const batteries = await Battery.find();
    
    const recommendations = [
      {
        priority: 'high',
        target: 'Pack Gamma #03',
        action: 'Fast Charge in Progress',
        details: 'Currently at 74%. Reaches 100% capacity in 14 mins on rooftop Solar Chasing Van. Pre-align with Waypoint 3 of Cluster ZN-Alpha.'
      },
      {
        priority: 'medium',
        target: 'Pack Beta #02',
        action: 'Cell Balancing Cycle',
        details: 'Cycle count is 178. Cell 4 impedance has elevated by 0.3 mΩ. Perform overnight 0.5C balance storage charge.'
      },
      {
        priority: 'optimal',
        target: 'Pack Alpha #01 & Delta #04',
        action: 'Ready for Heavy Sortie',
        details: '100% balanced at 4.15V/cell. Low internal resistance. Recommended for high-acreage contiguous paddy cluster.'
      }
    ];

    res.json({ success: true, count: recommendations.length, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/batteries/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, chargePct } = req.body;
    const update = {};
    if (status) update.status = status;
    if (chargePct !== undefined) update.chargePct = chargePct;

    const battery = await Battery.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: battery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
