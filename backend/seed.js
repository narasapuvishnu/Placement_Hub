require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("./models/Job");
const connectDB = require("./config/db");

const seedJobs = [
  {
    title: "Software Engineer Intern",
    company: "Google",
    description: "Join Google as an SWE Intern. You will work on core products and infrastructure.",
    location: "Bangalore",
    skills: ["Java", "C++", "Python", "DSA"],
    experience: "0-1 years",
    employmentType: "Internship",
  },
  {
    title: "SDE 1",
    company: "Amazon",
    description: "Amazon is hiring for SDE 1. Strong knowledge of data structures and algorithms is required.",
    location: "Hyderabad",
    skills: ["Java", "System Design", "DSA"],
    experience: "0-2 years",
    employmentType: "Full-time",
  },
  {
    title: "Frontend Developer",
    company: "Microsoft",
    description: "Work on Microsoft's modern web apps using React and TypeScript.",
    location: "Bangalore",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    experience: "1-3 years",
    employmentType: "Full-time",
  },
];

const seedDB = async () => {
  await connectDB();
  await Job.deleteMany();
  await Job.insertMany(seedJobs);
  console.log("Database seeded with sample jobs!");
  process.exit();
};

seedDB();
