const User = require('../models/User');
const SecurityLog = require('../models/SecurityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Fill required fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashed });
    await user.save();

    const token = createToken(user);
    res.status(201).json({ 
      message: 'Account created', 
      token, 
      user: { id: user._id, email: user.email, username: user.username, role: user.role } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ message: "Fill required fields" });

    const user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Log security event for admins
    if (user.role === "admin" || user.role === "superadmin") {
      await SecurityLog.create({
        action: "ADMIN_LOGIN",
        performedBy: user._id,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        status: "success",
        details: "Admin logged in via unified login",
      });
    }

    // Generate token
    const token = createToken(user);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,                      // not accessible via JS
     secure: process.env.NODE_ENV === 'production', // HTTPS me true
  sameSite: 'lax', // 'none' if frontend on different domain                // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days
    });

    // Send response
    res.json({
      message: "Logged in",
      token, // optional, can also rely on cookie
      user: { id: user._id, email: user.email, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if(!email) return res.status(400).json({ message: 'Please enter your email' });

    const user = await User.findOne({ email });
    if(!user) return res.status(200).json({ message: 'If that email exists, reset link sent' }); // avoid user enumeration

    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f9fafb; text-align: center;">
    <h2 style="color: #4f46e5;"> Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested a password reset. Click the button below to reset your password:</p>
    <div style="margin: 20px 0;">
      <a href="${resetUrl}" 
         style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
         Reset Password
      </a>
    </div>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
      SpamSafe &copy; 2025
    </p>
  </div>
`;



    await sendEmail({ to: user.email, subject: 'Password Reset', html });

    res.json({ message: 'Reset link sent if email exists' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    if(!password) return res.status(400).json({ message: 'Please provide new password' });

    const hash = crypto.createHash('sha256').update(token).digest('hex');
    console.log("Incoming Token:", token);
console.log("Hashed Token:", crypto.createHash('sha256').update(token).digest('hex'));

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = createToken(user);
    res.json({ message: 'Password reset successful', token: jwtToken });

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
