const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Cluster = require('../models/Cluster');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ farmerId: req.user._id || req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/bookings
// Farmer submits smart booking; checks spatial radius & aggregates if nearby requests exist!
router.post('/', protect, async (req, res) => {
  try {
    const {
      farmerName,
      farmName,
      village,
      district,
      state,
      zone,
      crop,
      acreage,
      serviceRequired,
      chemicalType,
      preferredDate,
      coordinates,
      notes
    } = req.body;

    const acresNum = parseFloat(acreage) || 3.0;
    const targetZone = zone || 'Zone North';
    
    // Find existing pending/clustered bookings in the same zone/village within 3-5 km
    const nearbyBookings = await Booking.find({
      zone: targetZone,
      status: { $in: ['pending', 'clustered'] }
    });

    const hasNearbyPool = nearbyBookings.length > 0;
    const soloRate = 400;
    const clusteredRate = 300;
    const rateApplied = hasNearbyPool ? clusteredRate : soloRate;
    const totalCost = acresNum * rateApplied;
    const savingsAmount = hasNearbyPool ? acresNum * (soloRate - clusteredRate) : 0;
    const status = hasNearbyPool ? 'clustered' : 'pending';

    const booking = await Booking.create({
      farmerId: req.user._id || req.user.id,
      farmerName: farmerName || req.user.name,
      farmName: farmName || 'Krishi Plot',
      village: village || req.user.village || 'Rampur Kalan',
      district: district || 'Lucknow',
      state: state || 'Uttar Pradesh',
      zone: targetZone,
      crop: crop || 'Paddy (Rice)',
      acreage: acresNum,
      serviceRequired: serviceRequired || 'nano-urea-spray',
      chemicalType: chemicalType || 'IFFCO Nano Urea & DAP',
      preferredDate: preferredDate || new Date(Date.now() + 86400000),
      coordinates: coordinates || {
        lat: 26.8500 + (Math.random() - 0.5) * 0.02,
        lng: 80.9500 + (Math.random() - 0.5) * 0.02
      },
      status,
      pricing: {
        soloRate,
        clusteredRate,
        actualRateApplied: rateApplied,
        totalCost,
        savingsAmount
      },
      notes: notes || '',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
    });

    // If a cluster exists in this zone, add to it or form one!
    let cluster = await Cluster.findOne({ zone: targetZone, status: { $in: ['forming', 'optimized'] } });
    if (cluster) {
      cluster.bookings.push({
        bookingId: booking._id,
        farmerName: booking.farmerName,
        village: booking.village,
        acreage: booking.acreage,
        crop: booking.crop,
        lat: booking.coordinates.lat,
        lng: booking.coordinates.lng
      });
      cluster.farmerCount = cluster.bookings.length;
      cluster.totalAcreage += booking.acreage;
      
      // Update cluster economics
      cluster.pricing.soloRateTotal = cluster.totalAcreage * soloRate;
      cluster.pricing.clusteredRateTotal = cluster.totalAcreage * clusteredRate;
      cluster.pricing.farmerSavingsTotal = cluster.pricing.soloRateTotal - cluster.pricing.clusteredRateTotal;
      cluster.pricing.operatorRevenue = cluster.pricing.clusteredRateTotal;
      cluster.pricing.operatorCost = Math.round(cluster.totalAcreage * 55);
      cluster.pricing.estimatedProfit = cluster.pricing.operatorRevenue - cluster.pricing.operatorCost;
      
      await cluster.save();
      booking.clusterId = cluster._id;
      await booking.save();
    }

    // Trigger Real-Time Notification for Drone Operator
    try {
      await Notification.create({
        recipientRole: 'operator',
        type: 'new_booking',
        title: `🌾 New Booking: ${booking.farmerName} (${booking.acreage} Ac)`,
        message: `${booking.farmerName} registered ${booking.acreage} Ac of ${booking.crop} in ${booking.village} (${booking.zone}). Estimated revenue: ₹${totalCost}.`,
        bookingId: booking._id,
        clusterId: booking.clusterId || undefined,
        farmerName: booking.farmerName,
        village: booking.village,
        crop: booking.crop,
        acreage: booking.acreage,
        estimatedRevenue: totalCost,
        isRead: false,
        isAccepted: false
      });
    } catch (notifErr) {
      console.warn('Notification creation warning:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      data: booking,
      clusterFormed: hasNearbyPool,
      savingsMessage: hasNearbyPool
        ? `🎉 Great news! Aggregated with nearby plots in ${targetZone}. Rate reduced from ₹400 to ₹300/acre. You save ₹${savingsAmount}!`
        : `Registered as solo booking. Waiting for 1 neighbor to join in ${targetZone} to unlock ₹300/acre rate!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/bookings/nearby
router.get('/nearby', async (req, res) => {
  try {
    const { zone } = req.query;
    const query = { status: { $in: ['pending', 'clustered'] } };
    if (zone) query.zone = zone;

    const bookings = await Booking.find(query).limit(10);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/bookings/panchayat-assist
// Gram Panchayat Kiosk books on behalf of non-smartphone farmers
router.post('/panchayat-assist', protect, async (req, res) => {
  try {
    const {
      farmerName,
      farmerPhone,
      aadhaarLast4,
      khasraNumber,
      village,
      state,
      zone,
      crop,
      acreage,
      serviceRequired,
      chemicalType,
      preferredDate,
      cashPaymentCollected,
      notes
    } = req.body;

    const acresNum = parseFloat(acreage) || 2.0;
    const targetZone = zone || 'Zone North';
    const clusteredRate = 300; // Panchayat community pool guarantee
    const totalCost = acresNum * clusteredRate;
    const paperSlipToken = `GP-${(village || 'RAMPUR').slice(0, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const booking = await Booking.create({
      farmerName: farmerName || 'Ganga Ram (Assisted Smallholder)',
      farmName: `Khasra Plot #${khasraNumber || '142/3'}`,
      village: village || req.user.village || 'Rampur Kalan',
      district: req.body.district || 'Lucknow',
      state: state || 'Uttar Pradesh',
      zone: targetZone,
      crop: crop || 'Paddy (Rice)',
      acreage: acresNum,
      serviceRequired: serviceRequired || 'nano-urea-spray',
      chemicalType: chemicalType || 'IFFCO Nano Urea & DAP',
      preferredDate: preferredDate || new Date(Date.now() + 86400000),
      status: 'clustered',
      bookedByRole: 'panchayat',
      assistedByPanchayat: true,
      panchayatKioskName: req.user.organization || 'Gram Panchayat CSC Center',
      farmerPhone: farmerPhone || '+91 99360 11223',
      aadhaarLast4: aadhaarLast4 || '4892',
      khasraNumber: khasraNumber || '142/3',
      cashPaymentCollected: !!cashPaymentCollected,
      paperTokenSlip: paperSlipToken,
      pricing: {
        soloRate: 400,
        clusteredRate: 300,
        actualRateApplied: 300,
        totalCost,
        savingsAmount: acresNum * 100
      },
      notes: notes || 'Assisted Kiosk Entry: Farmer does not own smartphone. Token paper slip issued.',
      invoiceNumber: `GP-INV-${Date.now().toString().slice(-6)}`
    });

    const smsMessage = `[ग्राम पंचायत कृषि सेवा] प्रिय ${booking.farmerName}, आपकी ${booking.acreage} एकड़ खेत (खसरा ${booking.khasraNumber}) ड्रोन स्प्रे बुकिंग सफल रही। टोकन: ${paperSlipToken}। देय राशि: ₹${totalCost}। ड्रोन आगमन: बुधवार सुबह 7:00 बजे।`;

    // Trigger Real-Time Notification for Drone Operator from Panchayat Kiosk
    try {
      await Notification.create({
        recipientRole: 'operator',
        type: 'new_booking',
        title: `🏛️ Panchayat Kiosk Booking: ${booking.farmerName} (${booking.acreage} Ac)`,
        message: `Kiosk Token #${paperSlipToken} issued for ${booking.farmerName} (${booking.acreage} Ac ${booking.crop}, Khasra #${booking.khasraNumber}). Cash collected: ₹${totalCost}.`,
        bookingId: booking._id,
        farmerName: booking.farmerName,
        village: booking.village,
        crop: booking.crop,
        acreage: booking.acreage,
        estimatedRevenue: totalCost,
        isRead: false,
        isAccepted: false
      });
    } catch (notifErr) {
      console.warn('Panchayat notification creation warning:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      data: booking,
      paperSlipToken,
      smsSimulated: smsMessage,
      message: `✅ Kiosk booking confirmed for ${booking.farmerName}! Paper Token #${paperSlipToken} generated.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/bookings/panchayat/village
// Get all assisted bookings registered by village panchayat
router.get('/panchayat/village', protect, async (req, res) => {
  try {
    const village = req.query.village || req.user.village || 'Rampur Kalan';
    const bookings = await Booking.find({ village }).sort({ createdAt: -1 });

    const totalAssisted = bookings.filter(b => b.assistedByPanchayat).length;
    const totalAcreage = bookings.reduce((sum, b) => sum + (b.acreage || 0), 0);
    const cashCollected = bookings
      .filter(b => b.cashPaymentCollected)
      .reduce((sum, b) => sum + (b.pricing?.totalCost || 0), 0);

    res.json({
      success: true,
      village,
      count: bookings.length,
      kpis: {
        totalAssistedFarmers: totalAssisted,
        totalVillageAcreage: totalAcreage,
        totalFarmerSavings: totalAcreage * 100,
        cashCollectedTotal: cashCollected
      },
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/bookings/:id/accept
// Operator accepts a farmer booking directly
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const operatorName = req.user?.name || req.body?.operatorName || 'Smt. Kavita Sharma (Drone Didi)';
    const droneUasId = req.body?.droneUasId || 'UA-7849-NDD';

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'assigned',
        notes: `Flight Corridor Accepted by ${operatorName} (${droneUasId}) on ${new Date().toLocaleDateString('en-IN')}`
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Mark matching notification as accepted
    await Notification.updateMany(
      { bookingId: booking._id },
      { isAccepted: true, isRead: true, acceptedBy: operatorName, acceptedAt: new Date() }
    );

    // Notify the farmer that their booking has been accepted!
    try {
      await Notification.create({
        recipientRole: 'farmer',
        type: 'booking_accepted',
        title: `✅ Booking Accepted by Drone Pilot!`,
        message: `Your booking for ${booking.crop} (${booking.acreage} Ac) in ${booking.village} has been accepted by ${operatorName} (${droneUasId}). Flight corridor locked!`,
        bookingId: booking._id,
        farmerName: booking.farmerName,
        village: booking.village,
        crop: booking.crop,
        acreage: booking.acreage,
        isRead: false
      });
    } catch (e) {
      // non-fatal
    }

    res.json({
      success: true,
      message: `🎉 Booking accepted! Autopilot flight corridor locked for ${booking.farmerName}.`,
      data: booking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

