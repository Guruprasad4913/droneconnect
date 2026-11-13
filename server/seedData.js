const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
const Drone = require('./models/Drone');
const Booking = require('./models/Booking');
const Cluster = require('./models/Cluster');
const Battery = require('./models/Battery');
const Maintenance = require('./models/Maintenance');
const Notification = require('./models/Notification');

const seedNotificationsIfMissing = async () => {
  try {
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      console.log('🔔 Seeding initial notifications for operator...');
      const sampleBooking = await Booking.findOne();
      await Notification.create([
        {
          recipientRole: 'operator',
          type: 'new_booking',
          title: '🌾 New Booking: Balwant Singh (4.0 Ac)',
          message: 'Balwant Singh requested targeted bio-fungicide spray for 4.0 Acres Wheat in Khed (Zone North). Total: ₹1,200.',
          bookingId: sampleBooking?._id || undefined,
          farmerName: 'Balwant Singh',
          village: 'Khed',
          crop: 'Wheat',
          acreage: 4.0,
          estimatedRevenue: 1200,
          isRead: false,
          isAccepted: false
        },
        {
          recipientRole: 'operator',
          type: 'new_booking',
          title: '🏛️ Panchayat Kiosk Booking: Ganga Ram (2.0 Ac)',
          message: 'Gram Panchayat Kiosk registered Ganga Ram (Assisted Smallholder) for 2.0 Acres Paddy in Rampur Kalan. Token #GP-RAMPUR-8491.',
          farmerName: 'Ganga Ram (Assisted Smallholder)',
          village: 'Rampur Kalan',
          crop: 'Paddy (Rice)',
          acreage: 2.0,
          estimatedRevenue: 600,
          isRead: false,
          isAccepted: false
        },
        {
          recipientRole: 'operator',
          type: 'weather_alert',
          title: '🌤️ Optimal Spray Window Active',
          message: 'Current wind 6.4 km/h, humidity 62%. Ideal conditions for Zone North cluster spray sorties until 11:30 AM.',
          village: 'Rampur Hub Base',
          isRead: true,
          isAccepted: true
        }
      ]);
      console.log('✅ Seeded 3 initial notifications for Drone Operator.');
    }

    // Ensure Panchayat demo user exists
    const panchayatUser = await User.findOne({ role: 'panchayat' });
    if (!panchayatUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        name: 'Shri Rajeshwar Nath (Gram Pradhan)',
        email: 'panchayat@agridrone.in',
        password: hashedPassword,
        role: 'panchayat',
        phone: '+91 94520 67890',
        organization: 'Rampur Kalan Gram Panchayat & CSC Hub',
        village: 'Rampur Kalan',
        district: 'Lucknow',
        state: 'Uttar Pradesh'
      });
      console.log('✅ Seeded Panchayat demo user.');
    }
  } catch (err) {
    console.warn('Notification/Panchayat seed check error:', err.message);
  }
};

const seedDatabase = async (force = false) => {
  try {
    if (force) {
      console.log('🧹 Clean re-seed requested. Clearing existing drone service collections...');
      await Promise.all([
        User.deleteMany({}),
        Farmer.deleteMany({}),
        Drone.deleteMany({}),
        Booking.deleteMany({}),
        Cluster.deleteMany({}),
        Battery.deleteMany({}),
        Maintenance.deleteMany({}),
        Notification.deleteMany({})
      ]);
      console.log('✨ Previous collections cleared successfully.');
    } else {
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log('ℹ️ Database already has data. Checking seed integrity...');
        await seedNotificationsIfMissing();
        return;
      }
    }

    console.log('🌱 Seeding initial AgriDrone Hub database with realistic demo data...');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const farmerUser = await User.create({
      name: 'Balwant Singh',
      email: 'farmer@agridrone.in',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 98765 43210',
      organization: 'Progressive Farmers Group',
      village: 'Rampur Kalan',
      district: 'Lucknow',
      state: 'Uttar Pradesh'
    });

    const operatorUser = await User.create({
      name: 'Smt. Kavita Sharma (Drone Didi)',
      email: 'operator@agridrone.in',
      password: hashedPassword,
      role: 'operator',
      phone: '+91 94150 12345',
      organization: 'Prerna Drone Didi SHG Federation',
      village: 'Rampur Hub Base',
      district: 'Lucknow',
      state: 'Uttar Pradesh'
    });

    const adminUser = await User.create({
      name: 'Dr. Rajiv Menon',
      email: 'admin@agridrone.in',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 98110 56789',
      organization: 'National CHC Agri-Drone Federation',
      village: 'Regional Directorate',
      district: 'Lucknow',
      state: 'Uttar Pradesh'
    });

    // 2. Create Farmer Profile
    await Farmer.create({
      userId: farmerUser._id,
      farmerName: 'Balwant Singh',
      farmName: 'Balwant Krishi Farm',
      village: 'Rampur Kalan',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      coordinates: { lat: 26.8520, lng: 80.9510 },
      totalAcreage: 4.0,
      primaryCrops: ['Paddy (Rice)', 'Wheat', 'Mustard']
    });

    // 3. Create Drones
    const drone1 = await Drone.create({
      modelName: 'KisanDrone Hexacopter 10L',
      dgcaUasId: 'UA-7849-NDD',
      operatorId: operatorUser._id,
      operatorName: 'Prerna Drone Didi SHG',
      payloadCapacityLiters: 10,
      status: 'available',
      totalFlightHours: 142.5,
      completedAcres: 890,
      batteryCount: 4,
      sprayWidthMeters: 4.5,
      baseLocation: {
        hubName: 'Zone North Central Hub',
        village: 'Rampur Kalan',
        lat: 26.8467,
        lng: 80.9462
      }
    });

    const drone2 = await Drone.create({
      modelName: 'Garuda Agri-16L Heavy Lifter',
      dgcaUasId: 'UA-9032-CHC',
      operatorId: operatorUser._id,
      operatorName: 'Prerna Drone Didi SHG',
      payloadCapacityLiters: 16,
      status: 'in-mission',
      totalFlightHours: 218.0,
      completedAcres: 1460,
      batteryCount: 6,
      sprayWidthMeters: 5.5,
      baseLocation: {
        hubName: 'Zone South Hub',
        village: 'Chandpur',
        lat: 26.8120,
        lng: 80.9210
      }
    });

    // 4. Create Batteries
    await Battery.create([
      {
        serialNumber: 'BATT-12S-ALPHA-01',
        label: 'Pack Alpha #01',
        droneId: drone1._id,
        droneUasId: drone1.dgcaUasId,
        operatorId: operatorUser._id,
        capacityMah: 16000,
        voltage: 49.8,
        chargePct: 98,
        healthPct: 94,
        cycleCount: 112,
        status: 'ready',
        temperatureC: 28.4,
        estimatedFlightTimeMins: 22,
        chargingLocation: 'mobile-solar-van',
        chargingRecommendation: 'Voltages balanced at 4.15V/cell. Ideal for high-acreage spray missions.'
      },
      {
        serialNumber: 'BATT-12S-BETA-02',
        label: 'Pack Beta #02',
        droneId: drone1._id,
        droneUasId: drone1.dgcaUasId,
        operatorId: operatorUser._id,
        capacityMah: 16000,
        voltage: 48.6,
        chargePct: 86,
        healthPct: 89,
        cycleCount: 178,
        status: 'ready',
        temperatureC: 29.1,
        estimatedFlightTimeMins: 19,
        chargingLocation: 'mobile-solar-van',
        chargingRecommendation: 'Nominal discharge curve. Suitable for medium payload or secondary sorties.'
      },
      {
        serialNumber: 'BATT-12S-GAMMA-03',
        label: 'Pack Gamma #03',
        droneId: drone1._id,
        droneUasId: drone1.dgcaUasId,
        operatorId: operatorUser._id,
        capacityMah: 16000,
        voltage: 47.2,
        chargePct: 74,
        healthPct: 92,
        cycleCount: 95,
        status: 'charging',
        temperatureC: 31.0,
        estimatedFlightTimeMins: 16,
        chargingLocation: 'mobile-solar-van',
        chargingRecommendation: 'Currently on 2C fast charge via rooftop solar van. Full charge in 14 mins.'
      },
      {
        serialNumber: 'BATT-12S-DELTA-04',
        label: 'Pack Delta #04',
        droneId: drone2._id,
        droneUasId: drone2.dgcaUasId,
        operatorId: operatorUser._id,
        capacityMah: 22000,
        voltage: 50.1,
        chargePct: 100,
        healthPct: 97,
        cycleCount: 42,
        status: 'ready',
        temperatureC: 26.8,
        estimatedFlightTimeMins: 26,
        chargingLocation: 'hub-depot',
        chargingRecommendation: 'Fresh pack, minimal internal resistance (1.1 mΩ/cell). Maximum endurance.'
      }
    ]);

    // 5. Create Bookings (4 sample farms totaling 12 acres: 2, 3, 4, 3 acres)
    const booking1 = await Booking.create({
      farmerId: farmerUser._id,
      farmerName: 'Ramesh Chandra Patel',
      farmName: 'Patel Krishi Plot A',
      village: 'Rampur Kalan',
      zone: 'Zone North',
      crop: 'Paddy (Rice)',
      acreage: 2.0,
      serviceRequired: 'nano-urea-spray',
      chemicalType: 'IFFCO Nano Urea & DAP',
      status: 'clustered',
      coordinates: { lat: 26.8510, lng: 80.9525 },
      pricing: {
        soloRate: 400,
        clusteredRate: 300,
        actualRateApplied: 300,
        totalCost: 600,
        savingsAmount: 200
      },
      invoiceNumber: 'INV-2026-001'
    });

    const booking2 = await Booking.create({
      farmerId: farmerUser._id,
      farmerName: 'Smt. Sunita Devi',
      farmName: 'Sunita Bio Farms',
      village: 'Malapur',
      zone: 'Zone North',
      crop: 'Paddy (Rice)',
      acreage: 3.0,
      serviceRequired: 'nano-urea-spray',
      chemicalType: 'IFFCO Nano Urea & DAP',
      status: 'clustered',
      coordinates: { lat: 26.8580, lng: 80.9605 },
      pricing: {
        soloRate: 400,
        clusteredRate: 300,
        actualRateApplied: 300,
        totalCost: 900,
        savingsAmount: 300
      },
      invoiceNumber: 'INV-2026-002'
    });

    const booking3 = await Booking.create({
      farmerId: farmerUser._id,
      farmerName: 'Balwant Singh',
      farmName: 'Balwant Krishi Farm',
      village: 'Khed',
      zone: 'Zone North',
      crop: 'Wheat',
      acreage: 4.0,
      serviceRequired: 'bio-fungicide',
      chemicalType: 'Targeted Bio-Fungicide (Blast/Blight)',
      status: 'clustered',
      coordinates: { lat: 26.8625, lng: 80.9410 },
      pricing: {
        soloRate: 400,
        clusteredRate: 300,
        actualRateApplied: 300,
        totalCost: 1200,
        savingsAmount: 400
      },
      invoiceNumber: 'INV-2026-003'
    });

    const booking4 = await Booking.create({
      farmerId: farmerUser._id,
      farmerName: 'Kishan Lal Verma',
      farmName: 'Verma Cotton Acres',
      village: 'Rampur Khurd',
      zone: 'Zone North',
      crop: 'Cotton',
      acreage: 3.0,
      serviceRequired: 'pest-defense',
      chemicalType: 'Targeted Bio-Stimulant',
      status: 'clustered',
      coordinates: { lat: 26.8430, lng: 80.9590 },
      pricing: {
        soloRate: 400,
        clusteredRate: 300,
        actualRateApplied: 300,
        totalCost: 900,
        savingsAmount: 300
      },
      invoiceNumber: 'INV-2026-004'
    });

    // 6. Create the 12-Acre Master Cluster
    const cluster = await Cluster.create({
      name: 'Cluster ZN-Alpha: 12-Acre Pooled Hub',
      hubCode: 'HUB-ZN-101',
      zone: 'Zone North',
      status: 'optimized',
      farmerCount: 4,
      totalAcreage: 12.0,
      centerCoordinates: { lat: 26.8467, lng: 80.9462 },
      bookings: [
        { bookingId: booking1._id, farmerName: booking1.farmerName, village: booking1.village, acreage: 2.0, crop: booking1.crop, lat: booking1.coordinates.lat, lng: booking1.coordinates.lng },
        { bookingId: booking2._id, farmerName: booking2.farmerName, village: booking2.village, acreage: 3.0, crop: booking2.crop, lat: booking2.coordinates.lat, lng: booking2.coordinates.lng },
        { bookingId: booking3._id, farmerName: booking3.farmerName, village: booking3.village, acreage: 4.0, crop: booking3.crop, lat: booking3.coordinates.lat, lng: booking3.coordinates.lng },
        { bookingId: booking4._id, farmerName: booking4.farmerName, village: booking4.village, acreage: 3.0, crop: booking4.crop, lat: booking4.coordinates.lat, lng: booking4.coordinates.lng }
      ],
      waypoints: [
        { id: 'WP-0', name: 'Zone North Hub Base', type: 'base', lat: 26.8467, lng: 80.9462, acres: 0, cumulativeKm: 0 },
        { id: 'WP-1', name: 'Farm A: Ramesh Patel (2 ac)', type: 'farm', lat: 26.8510, lng: 80.9525, acres: 2.0, cumulativeKm: 1.8 },
        { id: 'WP-2', name: 'Farm B: Sunita Devi (3 ac)', type: 'farm', lat: 26.8580, lng: 80.9605, acres: 3.0, cumulativeKm: 4.2 },
        { id: 'WP-3', name: 'Mobile Solar Van (Battery Swap)', type: 'charging-stop', lat: 26.8590, lng: 80.9510, acres: 0, cumulativeKm: 6.5 },
        { id: 'WP-4', name: 'Farm C: Balwant Singh (4 ac)', type: 'farm', lat: 26.8625, lng: 80.9410, acres: 4.0, cumulativeKm: 9.1 },
        { id: 'WP-5', name: 'Farm D: Kishan Verma (3 ac)', type: 'farm', lat: 26.8430, lng: 80.9590, acres: 3.0, cumulativeKm: 12.3 },
        { id: 'WP-6', name: 'Return to Hub Base', type: 'base', lat: 26.8467, lng: 80.9462, acres: 0, cumulativeKm: 14.2 }
      ],
      optimizedRoute: {
        sequence: [
          'Hub Base (Launch)',
          'Farm A (Ramesh - 2 ac)',
          'Farm B (Sunita - 3 ac)',
          'Solar Van (Battery Swap #1)',
          'Farm C (Balwant - 4 ac)',
          'Farm D (Kishan - 3 ac)',
          'Hub Base (Safe Return)'
        ],
        totalDistanceKm: 14.2,
        individualDistanceKm: 38.6,
        travelSavingsKm: 24.4,
        fuelSavedLiters: 5.8,
        estimatedFlightTimeMin: 68
      },
      batteryRequirements: {
        packsNeeded: 2,
        swapStopsCount: 1,
        estimatedDischargePct: 78
      },
      pricing: {
        soloRateTotal: 4800,
        clusteredRateTotal: 3600,
        farmerSavingsTotal: 1200,
        operatorRevenue: 3600,
        operatorCost: 650,
        estimatedProfit: 2950
      },
      operatorId: operatorUser._id,
      operatorName: operatorUser.name,
      droneId: drone1._id,
      droneUasId: drone1.dgcaUasId
    });

    // Update bookings with clusterId
    await Booking.updateMany(
      { _id: { $in: [booking1._id, booking2._id, booking3._id, booking4._id] } },
      { clusterId: cluster._id }
    );

    // 7. Create Predictive Maintenance Profile
    await Maintenance.create({
      droneId: drone1._id,
      droneName: drone1.modelName,
      dgcaUasId: drone1.dgcaUasId,
      overallHealthScore: 92,
      totalFlightHours: 142.5,
      components: [
        { key: 'motor-1', name: 'Motor 1 (Front Left CW)', healthScore: 96, status: 'nominal', flightHours: 142.5, notes: 'Bearings smooth, vibration < 0.12g' },
        { key: 'motor-2', name: 'Motor 2 (Front Right CCW)', healthScore: 95, status: 'nominal', flightHours: 142.5, notes: 'Current draw 14.2A nominal' },
        { key: 'motor-3', name: 'Motor 3 (Side Right CW)', healthScore: 94, status: 'nominal', flightHours: 142.5, notes: 'Thermal delta +1.2°C nominal' },
        { key: 'motor-4', name: 'Motor 4 (Rear Right CCW)', healthScore: 89, status: 'warning', flightHours: 142.5, notes: 'Slight thermal variance +2.4°C under 10L full load' },
        { key: 'motor-5', name: 'Motor 5 (Rear Left CW)', healthScore: 97, status: 'nominal', flightHours: 142.5, notes: 'Nominal operating conditions' },
        { key: 'motor-6', name: 'Motor 6 (Side Left CCW)', healthScore: 94, status: 'nominal', flightHours: 142.5, notes: 'Nominal operating conditions' },
        { key: 'propellers', name: 'Foldable Carbon-Nylon Propellers (30x10.5)', healthScore: 93, status: 'nominal', flightHours: 142.5, notes: 'No micro-chips or leading edge erosion detected' },
        { key: 'spray-pump', name: '12V High-Pressure Diaphragm Pump', healthScore: 86, status: 'warning', flightHours: 142.5, notes: 'Delivery pressure 0.42 MPa (expected 0.45 MPa). Filter clean recommended' },
        { key: 'nozzles', name: 'Centrifugal Atomizing Nozzles (4x)', healthScore: 91, status: 'warning', flightHours: 142.5, notes: 'Nozzle 2 slight flow restriction detected during spray calibration' },
        { key: 'avionics-fc', name: 'Triple Redundant Autopilot & IMU', healthScore: 99, status: 'nominal', flightHours: 142.5, notes: 'Heading error < 0.2 deg, zero sensor drift' },
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
    });

    // Seed notifications and Panchayat user
    await seedNotificationsIfMissing();

    console.log('✅ AgriDrone Hub database seeded successfully with 4-farm 12-acre cluster, batteries, maintenance and drones!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedDatabase;
