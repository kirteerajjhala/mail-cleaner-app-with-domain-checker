const Report = require('../../models/Report');
const paginateQuery = require('../../utils/paginateQuery');
// Import other models to generate reports
const User = require('../../models/User');
const Mail = require('../../models/Mail');
const SpamLog = require('../../models/SpamLog');
const ContactMessage = require('../../models/ContactMessage');
const SecurityLog = require('../../models/SecurityLog');

exports.getReports = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await paginateQuery(Report, {}, page, limit, 'generatedBy', { createdAt: -1 });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { title, type, filters } = req.body;
    let data = [];

    // Simple report generation logic
    if (type === 'users') {
      data = await User.find(filters || {}).select('-password').limit(1000).lean();
    } else if (type === 'spam') {
      data = await SpamLog.find(filters || {}).limit(1000).lean();
    } else if (type === 'mail') {
      data = await Mail.find(filters || {}).limit(1000).lean();
    } else if (type === 'contacts') {
      data = await ContactMessage.find(filters || {}).limit(1000).lean();
    } else if (type === 'security') {
      data = await SecurityLog.find(filters || {}).limit(1000).lean();
    }

    const report = await Report.create({
      title,
      type,
      filters,
      generatedBy: req.user._id,
      data
    });

    res.json({ success: true, message: 'Report generated', data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).lean();
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
