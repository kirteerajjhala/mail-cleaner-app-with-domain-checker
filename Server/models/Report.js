const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['users', 'spam', 'mail', 'contacts', 'security'], required: true },
  filters: mongoose.Schema.Types.Mixed,
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
