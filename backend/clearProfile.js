// Script to clear your profile data for testing
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/placementhub";

async function clearProfile() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

    const Profile = mongoose.model('Profile', new mongoose.Schema({}, { strict: false }));
    
    // Count profiles before
    const countBefore = await Profile.countDocuments();
    console.log(`Found ${countBefore} profile(s) in database`);

    // Clear all profiles (for testing)
    const result = await Profile.deleteMany({});
    console.log(`Deleted ${result.deletedCount} profile(s)`);

    console.log("\n✅ Profile cleared! Now you can test with a clean slate.");
    console.log("\nNext steps:");
    console.log("1. Refresh browser");
    console.log("2. Form should be empty");
    console.log("3. Upload resume → fields auto-fill");
    console.log("4. Click 'Analyze ATS score' → see realistic score");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

clearProfile();
