// Script to clear old analysis data from database
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/placementhub";

async function clearAnalysis() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

    const Profile = mongoose.model('Profile', new mongoose.Schema({}, { strict: false }));
    
    // Count profiles with analysis
    const profilesWithAnalysis = await Profile.countDocuments({ resumeAnalysis: { $exists: true } });
    console.log(`Found ${profilesWithAnalysis} profile(s) with old analysis data`);

    // Remove analysis from all profiles
    const result = await Profile.updateMany(
      { resumeAnalysis: { $exists: true } },
      { $unset: { resumeAnalysis: 1 } }
    );
    
    console.log(`✅ Cleared analysis from ${result.modifiedCount} profile(s)`);
    console.log("\nNow refresh your browser and the old 100/100 score should be gone!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

clearAnalysis();
