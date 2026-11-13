const express = require('express');
const router = express.Router();
const Drone = require('../models/Drone');
const { protect } = require('../middleware/auth');

// @route   GET /api/drones
router.get('/', async (req, res) => {
  try {
    const drones = await Drone.find().sort({ createdAt: -1 });
    res.json({ success: true, count: drones.length, data: drones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/drones/:id
router.get('/:id', async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Drone not found' });
    }
    res.json({ success: true, data: drone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/drones/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const drone = await Drone.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: drone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/drones
router.post('/', protect, async (req, res) => {
  try {
    const drone = await Drone.create(req.body);
    res.status(201).json({ success: true, data: drone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
