const SystemSetting = require('../../models/SystemSetting');

exports.getSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const settings = await SystemSetting.find(filter).lean();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value, category } = req.body;
    let setting = await SystemSetting.findOne({ key });

    if (setting) {
      setting.value = value;
      setting.updatedBy = req.user._id;
      setting.updatedAt = Date.now();
      await setting.save();
    } else {
      setting = await SystemSetting.create({
        key,
        value,
        category,
        updatedBy: req.user._id
      });
    }

    res.json({ success: true, message: 'Setting updated', data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.resetSettings = async (req, res) => {
    // Implementation for reset would typically clear custom settings or revert to defaults
    // For now, we'll just delete all settings in a category to "reset" them to "undefined" (application defaults)
    try {
        const { category } = req.body;
        if(category) {
            await SystemSetting.deleteMany({ category });
        } else {
             // Dangerous: reset all
            await SystemSetting.deleteMany({});
        }
        res.json({ success: true, message: 'Settings reset' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
