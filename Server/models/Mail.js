const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  subject: { type: String },
  content: { type: String },
  status: { type: String, enum: ['sent', 'failed', 'queued'], default: 'sent' },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mail', mailSchema);
