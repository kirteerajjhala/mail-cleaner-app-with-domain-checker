const User = require('../../models/User');
const Mail = require('../../models/Mail');
const SpamLog = require('../../models/SpamLog');
const ContactMessage = require('../../models/ContactMessage');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMails = await Mail.countDocuments();
    const totalSpam = await SpamLog.countDocuments({ isSpam: true });
    const totalContacts = await ContactMessage.countDocuments();
    const activeUsers = await User.countDocuments({ isBlocked: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalMails,
        totalSpam,
        totalContacts,
        activeUsers,
        blockedUsers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getDashboardCharts = async (req, res) => {
  try {
    // Example chart data: Users registered last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const spamActivity = await SpamLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: { userGrowth, spamActivity } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
