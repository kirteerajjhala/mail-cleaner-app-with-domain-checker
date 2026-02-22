const SecurityLog = require('../models/SecurityLog');

const superAdminMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    await SecurityLog.create({
      action: 'UNAUTHORIZED_SUPERADMIN_ACCESS',
      performedBy: req.user ? req.user._id : null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'failure',
      details: `User ${req.user ? req.user.email : 'Unknown'} attempted to access superadmin route ${req.originalUrl}`
    });
    return res.status(403).json({ success: false, message: 'Access denied: Super Admins only' });
  }
};

module.exports = superAdminMiddleware;
