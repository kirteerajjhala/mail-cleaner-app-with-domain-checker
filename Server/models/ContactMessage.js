const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'in_progress', 'resolved', 'closed'], default: 'new' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  resolvedAt: { type: Date, default: null },
  adminReply: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
