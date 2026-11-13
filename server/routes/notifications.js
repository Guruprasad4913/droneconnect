const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications
// Get all notifications for operator
router.get('/', async (req, res) => {
  try {
    const role = req.query.role || 'operator';
    const query = { recipientRole: role };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/notifications/:id/read
// Mark a notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ success: true, data: notif });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/notifications/:id/accept
// Operator accepts a farmer booking directly from the notification!
router.put('/:id/accept', async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const operatorName = req.body.operatorName || 'Smt. Kavita Sharma (Drone Didi)';
    const droneUasId = req.body.droneUasId || 'UA-7849-NDD';

    notif.isAccepted = true;
    notif.isRead = true;
    notif.acceptedBy = operatorName;
    notif.acceptedAt = new Date();
    await notif.save();

    // If linked to a booking, update the booking status to assigned!
    let updatedBooking = null;
    if (notif.bookingId) {
      updatedBooking = await Booking.findByIdAndUpdate(
        notif.bookingId,
        {
          status: 'assigned',
          notes: `Flight Corridor Accepted by ${operatorName} (${droneUasId}) on ${new Date().toLocaleDateString('en-IN')}`
        },
        { new: true }
      );
    }

    // Notify the farmer that their booking has been accepted!
    try {
      await Notification.create({
        recipientRole: 'farmer',
        type: 'booking_accepted',
        title: `🎉 Booking Accepted by Drone Pilot!`,
        message: `Great news! Your booking for ${notif.crop || 'Field'} (${notif.acreage || 3.0} Ac) in ${notif.village || 'Rampur Kalan'} has been accepted by ${operatorName} (${droneUasId}). Autopilot flight corridor locked!`,
        bookingId: notif.bookingId || undefined,
        farmerName: notif.farmerName,
        village: notif.village,
        crop: notif.crop,
        acreage: notif.acreage,
        acceptedBy: operatorName,
        acceptedAt: new Date(),
        isRead: false,
        isAccepted: true
      });
    } catch (notifErr) {
      console.warn('Farmer notification error:', notifErr.message);
    }

    res.json({
      success: true,
      message: `🎉 Booking accepted! Autopilot flight corridor locked for ${notif.farmerName} (${notif.acreage} Ac).`,
      notification: notif,
      booking: updatedBooking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/notifications/mark-all-read
router.post('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany({ recipientRole: 'operator', isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
