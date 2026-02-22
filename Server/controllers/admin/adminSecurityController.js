const SecurityLog = require('../../models/SecurityLog');
const paginateQuery = require('../../utils/paginateQuery');

exports.getSecurityLogs = async (req, res) => {
  try {
    const { page, limit, status, action, startDate, endDate } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (action) filter.action = action;
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const result = await paginateQuery(SecurityLog, filter, page, limit, 'performedBy targetUser', { createdAt: -1 });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getSecurityLog = async (req, res) => {
  try {
    const log = await SecurityLog.findById(req.params.id).populate('performedBy targetUser').lean();
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.clearLogs = async (req, res) => {
  try {
    // Keep logs for 30 days, clear older? Or clear all requested?
    // Prompt says "DELETE /logs/clear".
    const { beforeDate } = req.body; 
    let filter = {};
    if(beforeDate) {
        filter.createdAt = { $lt: new Date(beforeDate) };
    }
    
    await SecurityLog.deleteMany(filter);
    res.json({ success: true, message: 'Logs cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getSecuritySummary = async (req, res) => {
    try {
        // Stats: failures today, total logs, etc.
        const total = await SecurityLog.countDocuments();
        const failures = await SecurityLog.countDocuments({ status: 'failure' });
        res.json({ success: true, data: { total, failures } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
