// addUsers.js
require('dotenv').config(); // load .env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const mongoURI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

async function addOrUpdateUsers() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const users = [
      { name: 'Admin', email: 'admin@gmail.com', password: '123456', role: 'admin' },
      { name: 'Student', email: 'student@gmail.com', password: '12345', role: 'student' },
    ];

    for (let userData of users) {
      const hashed = await bcrypt.hash(userData.password, 10);

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        existingUser.password = hashed; // overwrite with hashed password
        existingUser.name = userData.name;
        existingUser.role = userData.role;
        await existingUser.save();
        console.log(`✅ Updated hashed password for ${existingUser.email}`);
      } else {
        const newUser = new User({ ...userData, password: hashed });
        await newUser.save();
        console.log(`✅ Added new user ${userData.email} with hashed password`);
      }
    }

    console.log('✅ Users added/updated successfully');
    mongoose.disconnect();

  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

addOrUpdateUsers();
