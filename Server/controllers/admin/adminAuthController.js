const User = require('../../models/User');
const SecurityLog = require('../../models/SecurityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // We allow login regardless of role here, then the frontend redirects.
    // adminMiddleware will still protect admin routes from non-admins.
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Log login
    await SecurityLog.create({
      action: 'ADMIN_LOGIN',
      performedBy: user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: 'Admin logged in successfully'
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.logout = async (req, res) => {
  // Client handles token removal, but we can log it
  if (req.user) {
    await SecurityLog.create({
      action: 'ADMIN_LOGOUT',
      performedBy: req.user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: 'Admin logged out'
    });
  }
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
