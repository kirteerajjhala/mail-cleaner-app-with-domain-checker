const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function resetPassword() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error("DATABASE_URL not found in .env");
      process.exit(1);
    }
    
    await mongoose.connect(url);
    console.log("Connected to MongoDB...");
    
    const email = "kashishghorpade11@gmail.com";
    const newPassword = "Admin@123";
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await User.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
    
    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found.`);
    } else {
      console.log(`Password reset to 'Admin@123' for ${email} successfully!`);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error during password reset:", err);
    process.exit(1);
  }
}

resetPassword();
