const Mail = require('../../models/Mail');
const paginateQuery = require('../../utils/paginateQuery');

exports.getMails = async (req, res) => {
  try {
    const { page, limit, status, recipient, startDate, endDate } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (recipient) filter.recipient = { $regex: recipient, $options: 'i' };
    if (startDate && endDate) {
      filter.sentAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const result = await paginateQuery(Mail, filter, page, limit, '', { sentAt: -1 });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getMail = async (req, res) => {
  try {
    const mail = await Mail.findById(req.params.id).lean();
    if (!mail) return res.status(404).json({ success: false, message: 'Mail not found' });
    res.json({ success: true, data: mail });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteMail = async (req, res) => {
  try {
    const mail = await Mail.findByIdAndDelete(req.params.id);
    if (!mail) return res.status(404).json({ success: false, message: 'Mail not found' });
    res.json({ success: true, message: 'Mail deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteBulkMails = async (req, res) => {
  try {
    const { ids } = req.body;
    await Mail.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: 'Mails deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getMailStats = async (req, res) => {
  try {
    const total = await Mail.countDocuments();
    const sent = await Mail.countDocuments({ status: 'sent' });
    const failed = await Mail.countDocuments({ status: 'failed' });
    res.json({ success: true, data: { total, sent, failed } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
