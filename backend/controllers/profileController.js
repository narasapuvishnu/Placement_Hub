const Profile = require("../models/Profile");
const { PDFParse } = require("pdf-parse");
const { analyzeResumeWithAI, generateOptimizedResume } = require("../services/atsenseService");

const knownSkills = [
  "JavaScript", "TypeScript", "React", "React.js", "Node.js", "Express", "Python",
  "Java", "C++", "C#", "Go", "Golang", "Rust", "PHP", "Ruby", "Ruby on Rails",
  "HTML", "CSS", "Bootstrap", "Tailwind CSS", "Redux", "Next.js", "Vue.js", "Angular",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Oracle",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux", "Git", "GitHub", "CI/CD",
  "Data Structures", "Algorithms", "System Design", "Machine Learning", "Deep Learning",
  "REST API", "GraphQL", "Microservices", "Spring Boot", "Django", "FastAPI",
  "Unit Testing", "Jest", "Selenium", "Pandas", "NumPy"
];

const extractProfileFields = (text) => {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const email = normalizedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const links = normalizedText.match(/(?:https?:\/\/)?(?:www\.)?(?:github\.com|linkedin\.com|[a-z0-9-]+\.[a-z]{2,})(?:\/[^\s),]*)?/gi) || [];
  
  // Skill extraction with boundary matching
  const skills = knownSkills.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[\\s,.;:()\\[\\]/])${escaped}(?:$|[\\s,.;:()\\[\\]/])`, "i");
    return regex.test(normalizedText);
  });

  const graduationYear = normalizedText.match(/\b(20[1-3][0-9])\b/)?.[1] || "";
  const degree = normalizedText.match(/\b(B\.?Tech|B\.?E\.?|M\.?Tech|M\.?S\.?|BCA|MCA|B\.?Sc|M\.?Sc|Bachelor of [A-Za-z ]+|Master of [A-Za-z ]+)\b/i)?.[0] || "";
  const college = normalizedText.match(/\b([A-Z][A-Za-z&.'-]*(?:\s+[A-Z][A-Za-z&.'-]*){0,8}\s+(?:University|Institute of Technology|Institute|College|Engineering College))\b/)?.[1] || "";
  const roleMatches = normalizedText.match(/\b(?:Software|Frontend|Backend|Full Stack|Fullstack|Data|DevOps|Cloud|Machine Learning|AI|QA|System) (?:Engineer|Developer|Intern|Specialist)\b/gi) || [];

  return {
    email,
    college,
    skills: [...new Set(skills)],
    graduationYear: graduationYear ? Number(graduationYear) : undefined,
    degree,
    preferredRoles: [...new Set(roleMatches.map(r => r.trim()))].slice(0, 4),
    github: links.find((link) => /github\.com/i.test(link)) || "",
    linkedin: links.find((link) => /linkedin\.com/i.test(link)) || "",
    portfolio: links.find((link) => !/github\.com|linkedin\.com/i.test(link)) || "",
  };
};

const analyzeResume = (text, extracted, jobDescription) => {
  const normalizedText = text.toLowerCase();
  const normalizedJob = jobDescription.toLowerCase();
  const matchedKeywords = knownSkills.filter((skill) => {
    const pattern = new RegExp(`\\b${skill.replace(/[.+#]/g, "\\$&")}\\b`, "i");
    return pattern.test(normalizedText) && pattern.test(normalizedJob);
  });
  
  // Scoring: More realistic expectations, some checks are weighted more
  const checks = [
    { key: "contact", label: "Contact details", points: 10, complete: Boolean(extracted.email || /\+?\d[\d\s().-]{8,}/.test(text)) },
    { key: "education", label: "Education", points: 10, complete: Boolean(extracted.degree || extracted.college) },
    { key: "skills", label: "Technical skills (3+)", points: 15, complete: extracted.skills.length >= 3 },
    { key: "experience", label: "Experience evidence", points: 15, complete: /experience|employment|internship|work history/.test(normalizedText) },
    { key: "projects", label: "Projects or achievements", points: 10, complete: /project|achievement|award|certification/.test(normalizedText) },
    { key: "links", label: "Professional links", points: 10, complete: Boolean(extracted.github || extracted.linkedin || extracted.portfolio) },
    { key: "impact", label: "Action verbs used", points: 10, complete: /\b(increased|reduced|improved|built|optimized|delivered|automated|designed|developed|implemented|created|managed|led|achieved|launched|enhanced|streamlined|resolved)\b/.test(normalizedText) },
    { key: "jobMatch", label: "Job description keywords", points: 20, complete: matchedKeywords.length >= 2 }, // Need at least 2 matching keywords
  ];
  
  // Calculate score
  const earnedPoints = checks.reduce((total, check) => total + (check.complete ? check.points : 0), 0);
  const totalPoints = checks.reduce((total, check) => total + check.points, 0);
  const score = Math.round((earnedPoints / totalPoints) * 100);
  
  const suggestions = checks
    .filter((check) => !check.complete)
    .map((check) => ({
      contact: "Add a professional email address and phone number.",
      education: "Add your degree, college, and graduation year near the top.",
      skills: "List at least three role-relevant technical skills that match the job description.",
      experience: "Add experience or internship bullets that show what you built and owned.",
      projects: "Add projects, certifications, or achievements with measurable outcomes.",
      links: "Include a working GitHub, LinkedIn, or portfolio link.",
      impact: "Use action verbs like 'built', 'improved', 'optimized', 'delivered' to describe your impact.",
      jobMatch: "Add at least 2 keywords from the job description that match your actual experience.",
    }[check.key]));

  return { 
    score, 
    checks, 
    suggestions, 
    matchedKeywords, 
    earnedPoints,
    totalPoints,
    analyzedAt: new Date(), 
    jobDescriptionProvided: true 
  };
};

const extractFileText = async (file) => {
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text || "";
  }
  return file.buffer.toString("utf8");
};

const saveResumeText = async (userId, resumeText, fileName = "pasted-resume.txt") => {
  const extracted = extractProfileFields(resumeText);
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        ...extracted,
        resumeFileName: fileName,
        resumeText: resumeText.slice(0, 50000),
        resumeUploadedAt: new Date(),
      },
      $unset: { resumeAnalysis: 1 },
      $setOnInsert: { user: userId },
    },
    { new: true, upsert: true, runValidators: true }
  ).populate("user", "name email");
  return { profile, extracted };
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate("user", "name email");
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "college",
      "degree",
      "graduationYear",
      "skills",
      "preferredRoles",
      "preferredLocations",
      "experience",
      "projects",
      "github",
      "linkedin",
      "portfolio",
      "resumeUrl",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates, $setOnInsert: { user: req.user._id } },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "name email");

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Attach a PDF or text resume first." });
    }

    let resumeText = "";
    if (req.file.mimetype === "application/pdf") {
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      resumeText = result.text || "";
      await parser.destroy();
    } else {
      resumeText = req.file.buffer.toString("utf8");
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ success: false, message: "We could not extract readable text from that resume." });
    }

    const extracted = extractProfileFields(resumeText);
    const updates = {
      ...extracted,
      resumeFileName: req.file.originalname,
      resumeText: resumeText.slice(0, 50000),
      resumeUploadedAt: new Date(),
    };
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates, $unset: { resumeAnalysis: 1 }, $setOnInsert: { user: req.user._id } },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "name email");

    res.json({ success: true, message: "Resume scanned. Add a job description to calculate an ATS match score.", data: profile, extracted, analysis: null });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.analyzeMyResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ success: false, message: "Paste a complete job description (at least 30 characters) before calculating the ATS score." });
    }
    
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile?.resumeText) {
      return res.status(400).json({ success: false, message: "Upload or paste a resume before running an ATS analysis." });
    }

    const atsenseResult = await analyzeResumeWithAI(profile.resumeText, jobDescription.trim());
    
    const analysis = {
      score: atsenseResult.overallScore,
      matchLevel: atsenseResult.matchLevel,
      breakdown: atsenseResult.breakdown,
      matchedKeywords: atsenseResult.matchedKeywords,
      missingKeywords: atsenseResult.missingKeywords,
      recommendedChanges: atsenseResult.recommendedChanges,
      gapAnalysis: atsenseResult.gapAnalysis,
      targetJobDescription: jobDescription.trim(),
      analyzedAt: atsenseResult.analyzedAt || new Date(),
      jobDescriptionProvided: true,
    };
    
    await Profile.updateOne({ user: req.user._id }, { $set: { resumeAnalysis: analysis } });
    
    res.json({ success: true, analysis });
  } catch (error) {
    console.error("Error in analyzeMyResume:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.savePastedResume = async (req, res) => {
  try {
    if (!req.body.resumeText || req.body.resumeText.trim().length < 30) {
      return res.status(400).json({ success: false, message: "Paste at least 30 characters of resume text." });
    }
    const result = await saveResumeText(req.user._id, req.body.resumeText);
    res.json({ success: true, message: "Resume text saved and profile fields extracted.", data: result.profile, extracted: result.extracted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.analyzeJobDescriptionFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Attach a PDF or text job description first." });
    }
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile?.resumeText) {
      return res.status(400).json({ success: false, message: "Upload or paste your resume before analyzing a job description." });
    }
    const jobDescription = await extractFileText(req.file);
    if (jobDescription.trim().length < 30) {
      return res.status(400).json({ success: false, message: "We could not extract enough text from that job description." });
    }

    const atsenseResult = await analyzeResumeWithAI(profile.resumeText, jobDescription.trim());
    const analysis = {
      score: atsenseResult.overallScore,
      matchLevel: atsenseResult.matchLevel,
      breakdown: atsenseResult.breakdown,
      matchedKeywords: atsenseResult.matchedKeywords,
      missingKeywords: atsenseResult.missingKeywords,
      recommendedChanges: atsenseResult.recommendedChanges,
      gapAnalysis: atsenseResult.gapAnalysis,
      targetJobDescription: jobDescription.trim(),
      analyzedAt: atsenseResult.analyzedAt || new Date(),
      jobDescriptionProvided: true,
    };

    await Profile.updateOne({ user: req.user._id }, { $set: { resumeAnalysis: analysis } });
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.generateOptimized = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile?.resumeText) {
      return res.status(400).json({ success: false, message: "Upload or paste your resume first." });
    }
    const targetJD = jobDescription || profile.resumeAnalysis?.targetJobDescription || "Software Engineer role";
    const optimizedResume = await generateOptimizedResume(profile.resumeText, targetJD, profile.resumeAnalysis);
    res.json({ success: true, optimizedResume });
  } catch (error) {
    console.error("Error generating optimized resume:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearAnalysis = async (req, res) => {
  try {
    await Profile.updateOne({ user: req.user._id }, { $unset: { resumeAnalysis: 1 } });
    res.json({ success: true, message: "Analysis cleared successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
