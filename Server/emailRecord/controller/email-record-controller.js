const EmailRecord = require("../model/email-record-model");

// Save a new email record
exports.saveEmailRecord = async (req, res) => {
  const { email, subject, body  ,EmailType} = req.body;

//   if (!email || !body) {
//     return res.status(400).json({ success: false, message: "Missing required fields" });
//   }

  try {
    // req.user comes from auth middleware
    const record = new EmailRecord({
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
      },
      email,
      subject,
      body,
      EmailType,
    });

    await record.save();
    console.log("Email record saved: ", record);
    res.json({ success: true, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all email records
exports.getAllEmailRecords = async (req, res) => {
  try {
    const records = await EmailRecord.find().sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.deleteEmailRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await EmailRecord.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Email record not found' });
    }

    res.json({ success: true, message: 'Email record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};