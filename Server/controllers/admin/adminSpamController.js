const SpamLog = require('../../models/SpamLog');
const paginateQuery = require('../../utils/paginateQuery');

exports.getSpamLogs = async (req, res) => {
  try {
    const { page, limit, source, isSpam } = req.query;

    let filter = {};
    if (source) filter.source = source;
    if (isSpam !== undefined) filter.isSpam = isSpam === 'true';

    const result = await paginateQuery(SpamLog, filter, page, limit, '', { detectedAt: -1 });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getSpamLog = async (req, res) => {
  try {
    const log = await SpamLog.findById(req.params.id).lean();
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteSpamLog = async (req, res) => {
  try {
    await SpamLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.flagSpamLog = async (req, res) => {
  try {
    const log = await SpamLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    log.isSpam = true;
    log.flaggedBy = 'admin';
    await log.save();
    res.json({ success: true, message: 'Flagged as spam', data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.clearSpamLog = async (req, res) => {
  try {
    const log = await SpamLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    log.isSpam = false;
    log.flaggedBy = 'admin'; // cleared by admin
    await log.save();
    res.json({ success: true, message: 'Cleared spam flag', data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getSpamAnalytics = async (req, res) => {
  try {
    const total = await SpamLog.countDocuments();
    const spam = await SpamLog.countDocuments({ isSpam: true });
    // Sources breakdown
    const sources = await SpamLog.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: { total, spam, sources } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
