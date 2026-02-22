const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config(); // Ensure env vars are loaded if running standalone

const seedAdmin = async () => {
  try {
    // Check if connected (if run standalone)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_URL);
      console.log('MongoDB connected for seeding');
    }

    const superAdminEmail = 'superadmin@admin.com';
    const existingAdmin = await User.findOne({ email: superAdminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123456', 10);
      const newAdmin = new User({
        username: 'Super Admin',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'superadmin',
        isBlocked: false,
        adminNotes: 'System generated super admin'
      });
      await newAdmin.save();
      console.log('Super Admin seeded successfully');
    } else {
      console.log('Super Admin already exists');
    }

    // Only close if we opened it (simple check)
    // process.exit(0); // Don't exit if imported, but this is usually run as script
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAdmin().then(() => process.exit(0));
}

module.exports = seedAdmin;
