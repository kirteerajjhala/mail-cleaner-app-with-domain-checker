const mongoose = require('mongoose');

const spamLogSchema = new mongoose.Schema({
  source: { type: String }, // e.g. 'email', 'contact_form'
  content: { type: String },
  spamScore: { type: Number }, // 0-100
  isSpam: { type: Boolean, default: false },
  flaggedBy: { type: String, enum: ['system', 'admin'], default: 'system' },
  detectedAt: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('SpamLog', spamLogSchema);
