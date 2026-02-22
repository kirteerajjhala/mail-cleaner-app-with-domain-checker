const User = require('../../models/User');
const SecurityLog = require('../../models/SecurityLog');
const paginateQuery = require('../../utils/paginateQuery');

exports.getUsers = async (req, res) => {
  try {
    const { page, limit, search, role, status, sortBy, sortOrder } = req.query;

    let filter = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (status) {
      if (status === 'blocked') filter.isBlocked = true;
      if (status === 'active') filter.isBlocked = false;
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const result = await paginateQuery(User, filter, page, limit, '', sortOptions);
    res.json({ success: true, ...result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Prevent modifying self role if not superadmin? Usually standard to allow superadmin to change roles.
    // If target is superadmin, prevent unless current user is superadmin (which middleware handles).

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await SecurityLog.create({
      action: 'UPDATE_USER_ROLE',
      performedBy: req.user._id,
      targetUser: user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: `Role changed from ${oldRole} to ${role}`
    });

    res.json({ success: true, message: 'User role updated', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBlocked = true;
    await user.save();

    await SecurityLog.create({
      action: 'BLOCK_USER',
      performedBy: req.user._id,
      targetUser: user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: 'User blocked'
    });

    res.json({ success: true, message: 'User blocked', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBlocked = false;
    await user.save();

    await SecurityLog.create({
      action: 'UNBLOCK_USER',
      performedBy: req.user._id,
      targetUser: user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: 'User unblocked'
    });

    res.json({ success: true, message: 'User unblocked', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);

    await SecurityLog.create({
      action: 'DELETE_USER',
      performedBy: req.user._id,
      targetUser: req.params.id, // ID since object is gone
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: `User ${user.email} deleted`
    });

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateAdminNotes = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.adminNotes = adminNotes;
    await user.save();

    res.json({ success: true, message: 'Notes updated', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
