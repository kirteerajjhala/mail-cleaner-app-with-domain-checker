const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

async function updateRole() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error("DATABASE_URL not found in .env");
      process.exit(1);
    }
    
    await mongoose.connect(url);
    console.log("Connected to MongoDB...");
    
    const email = "kashishghorpade11@gmail.com";
    const result = await User.updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );
    
    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found. Please register it first!`);
    } else if (result.modifiedCount === 0) {
      console.log(`User with email ${email} is already an admin.`);
    } else {
      console.log(`Role updated to admin for ${email} successfully!`);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error during update:", err);
    process.exit(1);
  }
}

updateRole();
