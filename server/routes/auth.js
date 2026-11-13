const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      village: user.village
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, organization, village, district } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'farmer',
      phone: phone || '+91 98765 43210',
      organization: organization || 'Individual Farmer',
      village: village || 'Rampur Kalan',
      district: district || 'Lucknow'
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        village: user.village,
        district: user.district
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'password123') { // Allow standard demo password fallback
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        village: user.village,
        district: user.district
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user: user || req.user
    });
  } catch (err) {
    res.json({ success: true, user: req.user });
  }
});

// @route   POST /api/auth/demo-login/:role
// Instant 1-click switch between Farmer, Operator, Admin
router.post('/demo-login/:role', async (req, res) => {
  const { role } = req.params;
  const validRoles = ['farmer', 'operator', 'panchayat', 'admin'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid demo role requested' });
  }

  try {
    let user = await User.findOne({ role });
    
    if (!user) {
      // Create on the fly if not found
      const demoProfiles = {
        farmer: {
          name: 'Balwant Singh',
          email: 'farmer@agridrone.in',
          role: 'farmer',
          phone: '+91 98765 43210',
          organization: 'Balwant Krishi Farm',
          village: 'Rampur Kalan',
          district: 'Lucknow'
        },
        operator: {
          name: 'Smt. Kavita Sharma (Drone Didi)',
          email: 'operator@agridrone.in',
          role: 'operator',
          phone: '+91 94150 12345',
          organization: 'Prerna Drone Didi SHG Federation',
          village: 'Rampur Hub Base',
          district: 'Lucknow'
        },
        panchayat: {
          name: 'Shri Rajeshwar Nath (Gram Pradhan)',
          email: 'panchayat@agridrone.in',
          role: 'panchayat',
          phone: '+91 94520 67890',
          organization: 'Rampur Kalan Gram Panchayat & CSC Hub',
          village: 'Rampur Kalan',
          district: 'Lucknow'
        },
        admin: {
          name: 'Dr. Rajiv Menon',
          email: 'admin@agridrone.in',
          role: 'admin',
          phone: '+91 98110 56789',
          organization: 'National CHC Agri-Drone Federation',
          village: 'State Directorate',
          district: 'Lucknow'
        }
      };

      const p = demoProfiles[role];
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      user = await User.create({ ...p, password: hashedPassword });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        village: user.village,
        district: user.district
      }
    });
  } catch (err) {
    // Graceful fallback token
    const fallbackUser = {
      id: 'demo-' + role,
      name: role === 'farmer' ? 'Balwant Singh (Farmer)' : role === 'operator' ? 'Kavita Sharma (Drone Didi)' : role === 'panchayat' ? 'Shri Rajeshwar Nath (Gram Pradhan)' : 'Dr. Rajiv Menon (Admin)',
      email: `${role}@agridrone.in`,
      role: role,
      organization: role === 'panchayat' ? 'Rampur Kalan Gram Panchayat' : role === 'operator' ? 'Prerna Drone Didi SHG' : 'AgriDrone Hub',
      village: 'Rampur Kalan'
    };
    const token = generateToken(fallbackUser);
    res.json({ success: true, token, user: fallbackUser });
  }
});

module.exports = router;
