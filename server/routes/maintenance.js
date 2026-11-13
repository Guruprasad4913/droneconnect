const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const { protect } = require('../middleware/auth');

// @route   GET /api/maintenance
router.get('/', async (req, res) => {
  try {
    const records = await Maintenance.find().sort({ updatedAt: -1 });
    const profile = records.length > 0 ? records[0] : null;

    res.json({
      success: true,
      data: profile || {
        overallHealthScore: 92,
        totalFlightHours: 142.5,
        components: [
          { key: 'motor-1', name: 'Motor 1 (Front Left CW)', healthScore: 96, status: 'nominal', flightHours: 142.5, notes: 'Bearings smooth, vibration < 0.12g' },
          { key: 'motor-2', name: 'Motor 2 (Front Right CCW)', healthScore: 95, status: 'nominal', flightHours: 142.5, notes: 'Current draw 14.2A nominal' },
          { key: 'motor-3', name: 'Motor 3 (Side Right CW)', healthScore: 94, status: 'nominal', flightHours: 142.5, notes: 'Thermal delta +1.2°C nominal' },
          { key: 'motor-4', name: 'Motor 4 (Rear Right CCW)', healthScore: 89, status: 'warning', flightHours: 142.5, notes: 'Slight thermal variance +2.4°C under 10L full load' },
          { key: 'motor-5', name: 'Motor 5 (Rear Left CW)', healthScore: 97, status: 'nominal', flightHours: 142.5, notes: 'Nominal operating conditions' },
          { key: 'motor-6', name: 'Motor 6 (Side Left CCW)', healthScore: 94, status: 'nominal', flightHours: 142.5, notes: 'Nominal operating conditions' },
          { key: 'propellers', name: 'Carbon-Nylon Propellers (30x10.5)', healthScore: 93, status: 'nominal', flightHours: 142.5, notes: 'No micro-chips or leading edge erosion detected' },
          { key: 'spray-pump', name: '12V High-Pressure Diaphragm Pump', healthScore: 86, status: 'warning', flightHours: 142.5, notes: 'Delivery pressure 0.42 MPa (expected 0.45 MPa)' },
          { key: 'nozzles', name: 'Centrifugal Atomizing Nozzles (4x)', healthScore: 91, status: 'warning', flightHours: 142.5, notes: 'Nozzle 2 slight flow restriction detected' },
          { key: 'avionics-fc', name: 'Triple Redundant Autopilot & IMU', healthScore: 99, status: 'nominal', flightHours: 142.5, notes: 'Zero sensor drift, nominal telemetry' },
          { key: 'rtk-gps', name: 'Dual RTK High Precision Antennas', healthScore: 98, status: 'nominal', flightHours: 142.5, notes: 'Fixed RTK baseline accuracy: 1.8 cm' }
        ],
        alerts: [
          {
            id: 'ALT-101',
            component: 'Spray Nozzles',
            severity: 'medium',
            message: 'Nozzle 2 flow rate is 6% below average. Chemical residue build-up suspected.',
            actionRequired: 'Perform 5-minute ultrasonic wash with distilled water before next cluster dispatch.'
          },
          {
            id: 'ALT-102',
            component: 'Motor 4',
            severity: 'low',
            message: 'Motor 4 recorded +2.4°C higher temperature than adjacent motors during last 10L climb.',
            actionRequired: 'Inspect bell housing for dust accumulation and lubricate bearing at next 150h service.'
          }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/maintenance/alerts/:id/resolve
router.post('/alerts/:id/resolve', protect, async (req, res) => {
  try {
    const record = await Maintenance.findOne({ 'alerts.id': req.params.id });
    if (record) {
      const alert = record.alerts.find(a => a.id === req.params.id);
      if (alert) alert.isResolved = true;
      await record.save();
    }
    res.json({ success: true, message: `Alert ${req.params.id} marked as resolved.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
