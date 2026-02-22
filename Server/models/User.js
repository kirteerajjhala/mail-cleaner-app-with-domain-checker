const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  lastLogin: Date,
  adminNotes: { type: String, default: '' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
