// ATSense AI Service - Integrated into PlacementHub
const Groq = require("groq-sdk");

// Lazy initialize Groq
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }
  return new Groq({ apiKey });
}

// Comprehensive skill library for accurate matching and fallback
const comprehensiveSkills = [
  "JavaScript", "TypeScript", "React", "React.js", "Node.js", "Express", "Python",
  "Java", "C++", "C#", "Go", "Golang", "Rust", "PHP", "Ruby", "Ruby on Rails",
  "HTML", "CSS", "Bootstrap", "Tailwind CSS", "Redux", "Next.js", "Vue.js", "Angular",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Oracle", "Cassandra",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux", "Git", "GitHub", "CI/CD",
  "Jenkins", "Terraform", "REST API", "GraphQL", "Microservices", "System Design",
  "Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks",
  "Spring Boot", "Hibernate", "Django", "FastAPI", "Flask", "Pandas", "NumPy",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Power BI", "Tableau",
  "Unit Testing", "Jest", "Mocha", "Selenium", "Cypress", "Agile", "Scrum", "Jira"
];

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSkillsFromText(text) {
  if (!text) return [];
  const normalized = text.toLowerCase();
  return comprehensiveSkills.filter((skill) => {
    const escaped = escapeRegex(skill.toLowerCase());
    const regex = new RegExp(`(?:^|[\\s,.;:()\\[\\]/])${escaped}(?:$|[\\s,.;:()\\[\\]/])`, "i");
    return regex.test(normalized);
  });
}

function calculateDeterministicAnalysis(resumeText, jobDescription) {
  const resumeSkills = extractSkillsFromText(resumeText);
  const jobSkills = extractSkillsFromText(jobDescription);

  const matchedKeywords = jobSkills.filter((s) =>
    resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase())
  );
  const missingKeywords = jobSkills.filter(
    (s) => !resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase())
  );

  const normalizedResume = (resumeText || "").toLowerCase();
  const normalizedJob = (jobDescription || "").toLowerCase();

  // Skills Match: proportion of required skills matched
  const skillsMatch = jobSkills.length > 0
    ? Math.min(100, Math.round((matchedKeywords.length / jobSkills.length) * 100))
    : 80;

  // Experience Match: check for years, internships, companies
  const hasExperience = /experience|internship|employment|worked at|developer at/i.test(normalizedResume);
  const experienceMatch = hasExperience ? 85 : 55;

  // Education Match
  const hasEducation = /b\.?tech|b\.?e\.?|bachelor|master|m\.?tech|computer science|university|college|gpa|cgpa/i.test(normalizedResume);
  const educationMatch = hasEducation ? 95 : 60;

  // Keywords Match
  const keywordsMatch = jobSkills.length > 0
    ? Math.round((matchedKeywords.length / Math.max(1, jobSkills.length)) * 90)
    : 75;

  // Projects Match
  const hasProjects = /project|built|developed|implemented|github\.com|deployed/i.test(normalizedResume);
  const projectsMatch = hasProjects ? 88 : 50;

  const overallScore = Math.round(
    skillsMatch * 0.35 +
    experienceMatch * 0.2 +
    educationMatch * 0.15 +
    keywordsMatch * 0.15 +
    projectsMatch * 0.15
  );

  const recommendedChanges = [];
  if (missingKeywords.length > 0) {
    recommendedChanges.push({
      type: "Add",
      text: `Add core keywords and skills requested in JD: ${missingKeywords.slice(0, 4).join(", ")}.`,
    });
  }
  recommendedChanges.push({
    type: "Rewrite",
    text: "Rewrite project and experience bullet points using action verbs (e.g. 'Architected', 'Optimized', 'Integrated') with quantified metrics.",
  });
  if (matchedKeywords.length > 0) {
    recommendedChanges.push({
      type: "Highlight",
      text: `Prominently showcase your relevant strengths in ${matchedKeywords.slice(0, 3).join(", ")} near the top summary.`,
    });
  }

  let matchLevel = "Moderate Match";
  if (overallScore >= 85) matchLevel = "Exceptional Match";
  else if (overallScore >= 75) matchLevel = "Strong Match";
  else if (overallScore >= 65) matchLevel = "Good Match";
  else if (overallScore < 50) matchLevel = "Low Match";

  return {
    overallScore,
    matchLevel,
    breakdown: {
      skillsMatch: Math.max(10, Math.min(100, skillsMatch)),
      experienceMatch: Math.max(10, Math.min(100, experienceMatch)),
      educationMatch: Math.max(10, Math.min(100, educationMatch)),
      keywordsMatch: Math.max(10, Math.min(100, keywordsMatch)),
      projectsMatch: Math.max(10, Math.min(100, projectsMatch)),
    },
    matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : resumeSkills.slice(0, 6),
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ["Unit Testing", "System Design", "CI/CD"],
    recommendedChanges,
    gapAnalysis: {
      summary: `Candidate profile matches ${matchedKeywords.length} key competencies found in the job description, with ${missingKeywords.length} gap areas identified.`,
      strengths: matchedKeywords.length > 0 ? matchedKeywords.slice(0, 5) : ["Core technical fundamentals"],
      criticalGaps: missingKeywords.length > 0 ? missingKeywords.slice(0, 5) : ["Industry-specific frameworks"],
    },
  };
}

async function analyzeResumeWithAI(resumeText, jobDescription) {
  if (!resumeText || !jobDescription) {
    throw new Error("Both resume text and job description are required.");
  }

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  try {
    const groq = getGroqClient();

    const prompt = `You are a strict, world-class Applicant Tracking System (ATS) and Senior Technical Recruiter.
Analyze the following candidate's RESUME against the target JOB DESCRIPTION.

JOB DESCRIPTION:
${jobDescription.slice(0, 3500)}

CANDIDATE RESUME:
${resumeText.slice(0, 4500)}

Perform an exhaustive gap analysis and ATS scoring.
Return a STRICT JSON response (no markdown, no preamble) adhering exactly to this JSON schema:
{
  "overallScore": <integer between 0 and 100>,
  "matchLevel": "<Exceptional Match | Strong Match | Good Match | Moderate Match | Needs Work>",
  "breakdown": {
    "skillsMatch": <integer 0-100>,
    "experienceMatch": <integer 0-100>,
    "educationMatch": <integer 0-100>,
    "keywordsMatch": <integer 0-100>,
    "projectsMatch": <integer 0-100>
  },
  "matchedKeywords": [<array of exact skill strings present in both resume and job>],
  "missingKeywords": [<array of important skills/keywords present in job description but missing in resume>],
  "recommendedChanges": [
    { "type": "Add", "text": "<Actionable instruction starting with 'Add...' specifying what missing technology or qualification to add>" },
    { "type": "Rewrite", "text": "<Actionable instruction starting with 'Rewrite...' specifying how to rephrase bullet points with metrics and impact>" },
    { "type": "Highlight", "text": "<Actionable instruction starting with 'Highlight...' specifying what key achievements or strengths to place prominently>" }
  ],
  "gapAnalysis": {
    "summary": "<2-3 sentence executive assessment of candidate fit against job requirements>",
    "strengths": [<array of candidate's top 3-4 strengths matching this role>],
    "criticalGaps": [<array of top 3-4 critical skill or requirement gaps>]
  }
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: 0.2,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "";
    const cleanJson = responseText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    // Validate score ranges
    const overallScore = Math.min(100, Math.max(0, Number(parsed.overallScore) || 75));
    const breakdown = {
      skillsMatch: Math.min(100, Math.max(0, Number(parsed.breakdown?.skillsMatch) || 70)),
      experienceMatch: Math.min(100, Math.max(0, Number(parsed.breakdown?.experienceMatch) || 70)),
      educationMatch: Math.min(100, Math.max(0, Number(parsed.breakdown?.educationMatch) || 80)),
      keywordsMatch: Math.min(100, Math.max(0, Number(parsed.breakdown?.keywordsMatch) || 65)),
      projectsMatch: Math.min(100, Math.max(0, Number(parsed.breakdown?.projectsMatch) || 75)),
    };

    return {
      overallScore,
      matchLevel: parsed.matchLevel || (overallScore >= 80 ? "Strong Match" : "Good Match"),
      breakdown,
      matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      recommendedChanges: Array.isArray(parsed.recommendedChanges) ? parsed.recommendedChanges : [],
      gapAnalysis: parsed.gapAnalysis || {
        summary: "Analysis completed.",
        strengths: parsed.matchedKeywords?.slice(0, 4) || [],
        criticalGaps: parsed.missingKeywords?.slice(0, 4) || [],
      },
      analyzedAt: new Date(),
    };
  } catch (error) {
    console.warn("Groq AI analysis failed or returned invalid format. Falling back to deterministic analysis:", error.message);
    const fallback = calculateDeterministicAnalysis(resumeText, jobDescription);
    fallback.analyzedAt = new Date();
    return fallback;
  }
}

async function generateOptimizedResume(resumeText, jobDescription, analysisData) {
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  try {
    const groq = getGroqClient();

    const missingStr = (analysisData?.missingKeywords || []).slice(0, 6).join(", ");
    const prompt = `You are a resume strategist. Rewrite and optimize the candidate's resume for the provided target job description.

TARGET JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

CURRENT CANDIDATE RESUME:
${resumeText.slice(0, 4000)}

MISSING KEYWORDS TO INCORPORATE WHERE APPROPRIATE:
${missingStr || "Core role keywords"}

Instructions:
1. Maintain honesty: do not fabricate degrees or non-existent company tenures.
2. Integrate missing skills naturally into technical skills or project descriptions.
3. Transform bullet points using XYZ format: Accomplished [X], as measured by [Y], by doing [Z].
4. Format in clean, ATS-compliant Markdown (Professional Summary, Technical Skills, Experience / Projects, Education, Certifications).
5. Output ONLY the optimized Markdown resume text without any conversational prefix or suffix.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: 0.3,
      max_tokens: 3000,
    });

    return completion.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error generating optimized resume with Groq:", error.message);
    // Deterministic resume enhancement fallback
    return `# OPTIMIZED RESUME\n\n## Professional Summary\nResults-driven software engineer with proven experience building scalable applications. Targeted for: ${jobDescription.slice(0, 80)}...\n\n## Technical Skills\n- Core Skills: ${analysisData?.matchedKeywords?.join(", ") || "Full Stack Development"}\n- Targeted Competencies: ${analysisData?.missingKeywords?.join(", ") || "System Design, Testing"}\n\n## Professional Experience & Projects\n${resumeText.slice(0, 2000)}\n\n---\n*Generated by PlacementHub ATSense Engine*`;
  }
}

module.exports = {
  analyzeResumeWithAI,
  generateOptimizedResume,
  calculateDeterministicAnalysis,
};

