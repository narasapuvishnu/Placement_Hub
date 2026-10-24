// Check what's actually in the database
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/placementhub";

async function checkDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected\n");

    const Profile = mongoose.model('Profile', new mongoose.Schema({}, { strict: false }));
    
    const profiles = await Profile.find({}).select('user resumeFileName resumeAnalysis').lean();
    
    console.log(`Found ${profiles.length} profile(s):\n`);
    
    profiles.forEach((profile, index) => {
      console.log(`Profile ${index + 1}:`);
      console.log(`  User ID: ${profile.user}`);
      console.log(`  Resume File: ${profile.resumeFileName || 'None'}`);
      console.log(`  Has Analysis: ${profile.resumeAnalysis ? 'YES' : 'NO'}`);
      
      if (profile.resumeAnalysis) {
        console.log(`  Analysis Score: ${profile.resumeAnalysis.score}`);
        console.log(`  Analysis Date: ${profile.resumeAnalysis.analyzedAt}`);
        console.log(`  Job Description Provided: ${profile.resumeAnalysis.jobDescriptionProvided}`);
      }
      console.log('');
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkDatabase();
