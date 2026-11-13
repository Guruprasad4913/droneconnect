const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'agridrone_hub_super_secret_jwt_key_2026';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user exists in database
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // In case MongoDB is offline, use token payload directly
    }

    if (!user) {
      // Use fallback decoded object
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || 'Demo User',
        email: decoded.email,
        role: decoded.role || 'farmer',
        organization: decoded.organization || 'AgriDrone Network',
        village: decoded.village || 'Rampur Kalan'
      };
    } else {
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET };
