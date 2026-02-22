const ContactMessage = require('../../models/ContactMessage');
const paginateQuery = require('../../utils/paginateQuery');

exports.getContacts = async (req, res) => {
  try {
    const { page, limit, status, search } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    const result = await paginateQuery(ContactMessage, filter, page, limit, 'assignedTo', { createdAt: -1 });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contact = await ContactMessage.findById(req.params.id).populate('assignedTo', 'username email').lean();
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    contact.status = status;
    if (status === 'resolved') contact.resolvedAt = Date.now();
    await contact.save();
    res.json({ success: true, message: 'Status updated', data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.assignContact = async (req, res) => {
  try {
    const { assignedTo } = req.body; // User ID
    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    contact.assignedTo = assignedTo;
    await contact.save();
    res.json({ success: true, message: 'Assigned successfully', data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.replyContact = async (req, res) => {
  try {
    const { reply } = req.body;
    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    contact.adminReply = reply;
    contact.status = 'resolved';
    contact.resolvedAt = Date.now();
    await contact.save();
    // In a real app, send email here
    res.json({ success: true, message: 'Reply saved', data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
