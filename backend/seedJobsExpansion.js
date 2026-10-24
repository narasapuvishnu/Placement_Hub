require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const connectDB = require("./config/db");
const Job = require("./models/Job");

const jobs = [
  {
    title: "Backend Software Engineer",
    company: "Google",
    description: "Build reliable services and APIs used by millions of people. You will work with a product team on design, implementation, testing, and production operations.",
    responsibilities: ["Design and implement backend services with clear API contracts.", "Write tests, review code, and improve service reliability.", "Investigate production issues and document durable fixes."],
    location: "Bangalore",
    skills: ["Java", "Python", "Distributed Systems", "SQL", "Data Structures"],
    experience: "1-3 years",
    employmentType: "Full-time",
    source: "Google Careers",
    sourceUrl: "https://careers.google.com/",
    applyUrl: "https://careers.google.com/jobs/results/",
    deadline: new Date("2026-12-31"),
  },
  {
    title: "Frontend Software Engineer",
    company: "Amazon",
    description: "Create accessible, performant interfaces for customer-facing products while partnering with designers, product managers, and backend engineers.",
    responsibilities: ["Build responsive product experiences from design specifications.", "Improve frontend performance, accessibility, and browser compatibility.", "Collaborate with backend engineers on API integration and release quality."],
    location: "Bangalore",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "Web Performance"],
    experience: "0-2 years",
    employmentType: "Full-time",
    source: "Amazon Jobs",
    sourceUrl: "https://www.amazon.jobs/",
    applyUrl: "https://www.amazon.jobs/en/job_categories/software-development",
    deadline: new Date("2026-11-30"),
  },
  {
    title: "Cloud Platform Engineer",
    company: "Microsoft",
    description: "Develop cloud platform capabilities with a focus on resilient services, observability, and developer productivity across Azure workloads.",
    responsibilities: ["Implement platform services and automation for Azure workloads.", "Define dashboards, alerts, and operational runbooks for critical paths.", "Participate in design reviews and improve deployment safety."],
    location: "Hyderabad",
    skills: ["C#", ".NET", "Azure", "Kubernetes", "System Design"],
    experience: "2-5 years",
    employmentType: "Full-time",
    source: "Microsoft Careers",
    sourceUrl: "https://careers.microsoft.com/",
    applyUrl: "https://jobs.careers.microsoft.com/",
    deadline: new Date("2026-12-15"),
  },
  {
    title: "Data Engineer",
    company: "Uber",
    description: "Build batch and streaming data pipelines that power marketplace analytics, experimentation, and operational decision-making.",
    responsibilities: ["Develop reliable batch and streaming ingestion pipelines.", "Model data for analytics and validate data quality at pipeline boundaries.", "Monitor latency, freshness, and failure recovery for production jobs."],
    location: "Bangalore",
    skills: ["Python", "Spark", "Kafka", "SQL", "Data Modeling"],
    experience: "1-4 years",
    employmentType: "Full-time",
    source: "Uber Careers",
    sourceUrl: "https://www.uber.com/careers/",
    applyUrl: "https://www.uber.com/careers/list/",
    deadline: new Date("2027-01-10"),
  },
  {
    title: "Machine Learning Engineer Intern",
    company: "Meta",
    description: "Work with applied scientists and engineers to prototype, evaluate, and productionize machine-learning systems for consumer products.",
    responsibilities: ["Prepare datasets and build repeatable model evaluation workflows.", "Implement experiments and communicate model quality and limitations.", "Partner with engineering teams to ship maintainable inference services."],
    location: "Remote - India",
    skills: ["Python", "PyTorch", "Statistics", "Algorithms", "Machine Learning"],
    experience: "0-1 years",
    employmentType: "Internship",
    source: "Meta Careers",
    sourceUrl: "https://www.metacareers.com/",
    applyUrl: "https://www.metacareers.com/jobs/",
    deadline: new Date("2026-11-20"),
  },
  {
    title: "iOS Software Engineer",
    company: "Apple",
    description: "Build polished iOS experiences with a strong focus on performance, reliability, privacy, and maintainable mobile architecture.",
    responsibilities: ["Implement user-facing iOS features in Swift and SwiftUI.", "Profile performance and resolve memory, rendering, and lifecycle issues.", "Write unit and UI tests while maintaining privacy-focused data handling."],
    location: "Hyderabad",
    skills: ["Swift", "SwiftUI", "iOS SDK", "UIKit", "Unit Testing"],
    experience: "1-3 years",
    employmentType: "Full-time",
    source: "Apple Careers",
    sourceUrl: "https://www.apple.com/careers/",
    applyUrl: "https://jobs.apple.com/",
    deadline: new Date("2026-12-20"),
  },
  {
    title: "Site Reliability Engineer",
    company: "Netflix",
    description: "Improve the availability and efficiency of large-scale streaming systems through automation, observability, and incident learning.",
    responsibilities: ["Automate operational workflows and safe service changes.", "Build observability for latency, capacity, and availability signals.", "Participate in incident response and convert findings into reliability improvements."],
    location: "Remote",
    skills: ["Go", "AWS", "Kubernetes", "Linux", "Observability"],
    experience: "3-6 years",
    employmentType: "Full-time",
    source: "Netflix Jobs",
    sourceUrl: "https://jobs.netflix.com/",
    applyUrl: "https://jobs.netflix.com/search",
    deadline: new Date("2027-01-31"),
  },
  {
    title: "Full Stack Engineer",
    company: "Adobe",
    description: "Deliver end-to-end features for creative cloud workflows, from responsive web experiences to scalable service integrations.",
    responsibilities: ["Deliver features across React interfaces and Java services.", "Design and integrate secure REST APIs with durable data storage.", "Coordinate with product and design partners through testing and release."],
    location: "Noida",
    skills: ["React", "Java", "Spring Boot", "REST APIs", "PostgreSQL"],
    experience: "1-4 years",
    employmentType: "Full-time",
    source: "Adobe Careers",
    sourceUrl: "https://www.adobe.com/careers.html",
    applyUrl: "https://adobe.wd5.myworkdayjobs.com/external_experienced",
    deadline: new Date("2026-12-05"),
  },
];

const existingResponsibilities = {
  "Software Engineer Intern": ["Implement scoped product or infrastructure tasks with mentorship.", "Write tests and participate in code reviews.", "Learn the team's development and deployment practices."],
  "SDE 1": ["Build and maintain customer-focused services.", "Solve reliability and performance issues using data and logs.", "Collaborate with partner teams to deliver production-ready features."],
  "Frontend Developer": ["Develop reusable React components and page flows.", "Improve accessibility, responsiveness, and browser performance.", "Work with API and design teams to ship polished web features."],
};

async function seedJobsExpansion() {
  try {
    await connectDB();
    for (const [title, responsibilities] of Object.entries(existingResponsibilities)) {
      await Job.updateOne({ title }, { $set: { responsibilities } });
    }
    for (const job of jobs) {
      await Job.findOneAndUpdate({ title: job.title, company: job.company }, job, { upsert: true, returnDocument: "after" });
      console.log(`Seeded job: ${job.company} - ${job.title}`);
    }
    console.log(`Seeded ${jobs.length} additional jobs.`);
    process.exit(0);
  } catch (error) {
    console.error("Job expansion seed failed:", error);
    process.exit(1);
  }
}

seedJobsExpansion();
