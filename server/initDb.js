require('dotenv').config();
const { connectDB } = require('./config/db');
const seedDatabase = require('./seedData');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
const Drone = require('./models/Drone');
const Booking = require('./models/Booking');
const Cluster = require('./models/Cluster');
const Battery = require('./models/Battery');
const Maintenance = require('./models/Maintenance');
const Notification = require('./models/Notification');

async function run() {
  console.log('=====================================================================');
  console.log('       AGRIDRONE HUB — MONGODB INITIALIZATION & SEED SCRIPT');
  console.log('=====================================================================\n');

  console.log('Connecting to MongoDB...');
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Could not connect to MongoDB. Please make sure MongoDB is running.');
    process.exit(1);
  }

  console.log('\nCreating and seeding fresh database collections...');
  await seedDatabase(true);

  console.log('\n---------------------------------------------------------------------');
  console.log('📊 DATABASE STATUS SUMMARY:');
  console.log('---------------------------------------------------------------------');
  const [users, farmers, drones, bookings, clusters, batteries, maintenance, notifications] = await Promise.all([
    User.countDocuments(),
    Farmer.countDocuments(),
    Drone.countDocuments(),
    Booking.countDocuments(),
    Cluster.countDocuments(),
    Battery.countDocuments(),
    Maintenance.countDocuments(),
    Notification.countDocuments()
  ]);

  console.log(` • Users:          ${users} demo accounts (Farmer, Operator, Admin, Panchayat)`);
  console.log(` • Farmers:        ${farmers} progressive farmers registered`);
  console.log(` • Drones:         ${drones} KisanDrones (Hexa-10L & Garuda 16L)`);
  console.log(` • Bookings:       ${bookings} active booking slots (Cluster 12-Acre Demo)`);
  console.log(` • Clusters:       ${clusters} spatial aggregation corridor (3-5km radius)`);
  console.log(` • Smart Batteries:${batteries} 16000mAh LiPo packs with health telemetry`);
  console.log(` • Maintenance:    ${maintenance} predictive diagnostic records`);
  console.log(` • Notifications:  ${notifications} pilot dispatch alerts`);
  console.log('---------------------------------------------------------------------');
  console.log('🎉 Brand new MongoDB database is successfully initialized and ready to use!\n');

  process.exit(0);
}

run().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
