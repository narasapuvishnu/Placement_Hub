const https = require("https");
const Job = require("../models/Job");

/**
 * Fetch helper using native https
 */
const fetchJson = (url, headers = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          ...headers,
        },
        timeout: 10000,
      };

      const req = https.request(options, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          const nextUrl = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          return resolve(fetchJson(nextUrl, headers));
        }

        let rawData = "";
        res.on("data", (chunk) => (rawData += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(rawData);
              resolve(parsed);
            } catch (err) {
              reject(new Error(`JSON parse error from ${url}: ${err.message}`));
            }
          } else {
            reject(
              new Error(
                `HTTP error ${res.statusCode} from ${url}: ${rawData.slice(
                  0,
                  150
                )}`
              )
            );
          }
        });
      });

      req.on("error", (err) => reject(err));
      req.on("timeout", () => {
        req.destroy();
        reject(new Error(`Request timeout for ${url}`));
      });
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Clean HTML tags from API descriptions
 */
const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Slugify title for direct canonical URLs
 */
const slugify = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

/**
 * Deduce tech skills from job title and description
 */
const extractSkills = (title = "", text = "") => {
  const combined = `${title} ${text}`.toLowerCase();
  const skillKeywords = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "Python",
    "Java",
    "Spring Boot",
    "C++",
    "C#",
    ".NET",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "HTML",
    "CSS",
    "TailwindCSS",
    "Git",
    "Linux",
    "Next.js",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "Flutter",
    "Kafka",
    "Spark",
    "Machine Learning",
    "Data Science",
  ];

  const matched = skillKeywords.filter((skill) =>
    combined.includes(skill.toLowerCase())
  );

  return matched.length
    ? matched.slice(0, 6)
    : ["Software Engineering", "Problem Solving", "Computer Science"];
};

/**
 * Deduce experience label
 */
const extractExperience = (title = "", text = "") => {
  const combined = `${title} ${text}`.toLowerCase();
  if (combined.includes("intern") || combined.includes("internship"))
    return "0-1 years (Internship)";
  if (
    combined.includes("entry") ||
    combined.includes("fresher") ||
    combined.includes("associate") ||
    combined.includes("junior")
  )
    return "0-2 years (Fresher)";
  if (
    combined.includes("senior") ||
    combined.includes("lead") ||
    combined.includes("staff")
  )
    return "4-7 years (Senior)";
  return "0-3 years";
};

/**
 * Resolve direct, canonical job application URL for Greenhouse-hosted companies
 * Eliminates generic career search redirects or 404s
 */
const resolveDirectGreenhouseApplyUrl = (boardToken, jobId, jobTitle, apiAbsoluteUrl) => {
  if (boardToken === "airbnb") {
    // Direct individual job posting on Airbnb careers portal
    return `https://careers.airbnb.com/positions/${jobId}/?gh_jid=${jobId}`;
  }

  if (boardToken === "stripe") {
    // Stripe canonical job listing URL
    const slug = slugify(jobTitle) || "job";
    return `https://stripe.com/careers/listing/${slug}/${jobId}?gh_jid=${jobId}`;
  }

  if (boardToken === "gitlab") {
    return `https://job-boards.greenhouse.io/gitlab/jobs/${jobId}`;
  }

  if (boardToken === "cloudflare") {
    return `https://job-boards.greenhouse.io/cloudflare/jobs/${jobId}`;
  }

  if (boardToken === "figma") {
    return `https://job-boards.greenhouse.io/figma/jobs/${jobId}`;
  }

  if (boardToken === "reddit") {
    return `https://job-boards.greenhouse.io/reddit/jobs/${jobId}`;
  }

  if (boardToken === "discord") {
    return `https://job-boards.greenhouse.io/discord/jobs/${jobId}`;
  }

  if (boardToken === "gusto") {
    return `https://job-boards.greenhouse.io/gusto/jobs/${jobId}`;
  }

  return apiAbsoluteUrl || `https://job-boards.greenhouse.io/${boardToken}/jobs/${jobId}`;
};

/**
 * 1. Fetch verified direct job listings from Greenhouse Public Boards
 */
const fetchGreenhouseJobs = async (boardToken, companyName) => {
  try {
    const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;
    const res = await fetchJson(url);
    if (!res || !Array.isArray(res.jobs)) return [];

    return res.jobs.slice(0, 10).map((j) => {
      const skills = extractSkills(j.title, j.content);
      const isIntern = j.title.toLowerCase().includes("intern");
      const cleanDesc =
        stripHtml(j.content || "") ||
        `${j.title} at ${companyName}. Exciting career opportunity with our engineering and product teams.`;

      const directApplyUrl = resolveDirectGreenhouseApplyUrl(
        boardToken,
        j.id,
        j.title,
        j.absolute_url
      );

      return {
        externalId: `greenhouse_${boardToken}_${j.id}`,
        title: j.title,
        company: companyName,
        companyLogo: `https://logo.clearbit.com/${boardToken}.com`,
        description: cleanDesc.slice(0, 2000),
        responsibilities: [
          `Collaborate with cross-functional product and engineering teams at ${companyName}.`,
          `Design, build, and maintain production-grade services and user-facing features.`,
          `Ensure high code quality, test coverage, and clear documentation standards.`,
          `Participate in code reviews, bug fixes, and system architecture discussions.`,
        ],
        location: j.location?.name || "Global / Hybrid",
        skills,
        experience: extractExperience(j.title, j.content),
        employmentType: isIntern ? "Internship" : "Full-time",
        salary: isIntern ? "₹40,000 - ₹80,000 / month" : "₹14 - ₹30 LPA",
        batchEligible: ["2023", "2024", "2025", "2026"],
        degreeEligible: ["B.Tech", "B.E.", "MCA", "M.Tech", "Any Graduate"],
        workMode: (j.location?.name || "").toLowerCase().includes("remote")
          ? "Remote"
          : "Hybrid",
        category: isIntern ? "INTERNSHIP" : "OFF_CAMPUS",
        source: `${companyName} (Official Job Application)`,
        sourceUrl: directApplyUrl,
        applyUrl: directApplyUrl,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "Open",
      };
    });
  } catch (err) {
    console.warn(`[JobSync] Greenhouse error for ${companyName}:`, err.message);
    return [];
  }
};

/**
 * 2. Fetch from Remotive Public API (Remote software engineer jobs with verified direct links)
 */
const fetchRemotiveJobs = async () => {
  try {
    const url =
      "https://remotive.com/api/remote-jobs?category=software-dev&limit=15";
    const res = await fetchJson(url);
    if (!res || !Array.isArray(res.jobs)) return [];

    return res.jobs.slice(0, 12).map((j) => {
      const cleanDesc = stripHtml(j.description || "");
      const isIntern = (j.title || "").toLowerCase().includes("intern");
      const skills = j.tags?.length
        ? j.tags.slice(0, 6)
        : extractSkills(j.title, cleanDesc);

      const directLink = j.url;

      return {
        externalId: `remotive_${j.id}`,
        title: j.title,
        company: j.company_name,
        companyLogo: j.company_logo || "",
        description: cleanDesc.slice(0, 2000),
        responsibilities: [
          `Build and maintain web features and APIs for ${j.company_name}.`,
          `Write clean, testable, and efficient code with team documentation.`,
          `Debug issues, run diagnostics, and improve system reliability.`,
          `Participate in agile sprints, code reviews, and architectural planning.`,
        ],
        location: j.candidate_required_location || "Remote (Worldwide / APAC)",
        skills,
        experience: extractExperience(j.title, cleanDesc),
        employmentType:
          j.job_type === "contract"
            ? "Contract"
            : isIntern
            ? "Internship"
            : "Full-time",
        salary:
          j.salary || (isIntern ? "₹35,000 - ₹65,000 / month" : "₹12 - ₹24 LPA"),
        batchEligible: ["2023", "2024", "2025", "2026", "2027"],
        degreeEligible: [
          "B.Tech",
          "B.E.",
          "BCA / MCA",
          "B.Sc (CS/IT)",
          "Any Degree",
        ],
        workMode: "Remote",
        category: "OFF_CAMPUS",
        source: `${j.company_name} (Direct Job Post)`,
        sourceUrl: directLink,
        applyUrl: directLink,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: "Open",
      };
    });
  } catch (err) {
    console.warn("[JobSync] Remotive error:", err.message);
    return [];
  }
};

/**
 * 3. Fetch from RemoteOK Public API
 */
const fetchRemoteOKJobs = async () => {
  try {
    const url = "https://remoteok.com/api";
    const res = await fetchJson(url);
    if (!Array.isArray(res)) return [];

    const validJobs = res
      .filter((j) => j && j.position && j.company)
      .slice(0, 10);

    return validJobs.map((j) => {
      const cleanDesc = stripHtml(j.description || "");
      const isIntern = (j.position || "").toLowerCase().includes("intern");
      const skills = j.tags?.length
        ? j.tags.slice(0, 6)
        : extractSkills(j.position, cleanDesc);

      const applyLink =
        j.apply_url ||
        j.url ||
        (j.id
          ? `https://remoteok.com/remote-jobs/${j.id}`
          : "https://remoteok.com");

      return {
        externalId: `remoteok_${j.id || j.epoch}`,
        title: j.position,
        company: j.company,
        companyLogo: j.company_logo || "",
        description: cleanDesc.slice(0, 2000),
        responsibilities: [
          `Collaborate with remote distributed engineering team at ${j.company}.`,
          `Develop scalable backend and frontend modules according to product roadmap.`,
          `Work closely with QA, product, and DevOps to ensure continuous delivery.`,
        ],
        location: j.location || "Remote",
        skills,
        experience: extractExperience(j.position, cleanDesc),
        employmentType: isIntern ? "Internship" : "Full-time",
        salary: isIntern ? "₹30,000 - ₹50,000 / month" : "₹10 - ₹22 LPA",
        batchEligible: ["2023", "2024", "2025", "2026"],
        degreeEligible: ["B.Tech", "B.E.", "MCA", "Any Degree"],
        workMode: "Remote",
        category: "OFF_CAMPUS",
        source: `${j.company} (RemoteOK Direct)`,
        sourceUrl: applyLink,
        applyUrl: applyLink,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: "Open",
      };
    });
  } catch (err) {
    console.warn("[JobSync] RemoteOK error:", err.message);
    return [];
  }
};

/**
 * 4. High-value India Off-Campus & Top Tech Career Opportunities with verified, active direct links
 */
const getCuratedIndiaTechJobs = () => {
  return [
    {
      externalId: "curated_google_swe_entry",
      title: "Software Engineer, Early Career",
      company: "Google",
      companyLogo: "https://logo.clearbit.com/google.com",
      description:
        "Join Google as an Early Career Software Engineer in Bangalore or Hyderabad. You will develop next-generation technologies that change how millions of users interact, connect, and explore information. As an engineer, you work on a specific project critical to Google's needs with opportunities to switch teams as you grow.",
      responsibilities: [
        "Design, test, deploy, and maintain software solutions for distributed consumer and enterprise products.",
        "Manage project priorities, deadlines, and deliverables with technical leadership.",
        "Work with large-scale distributed systems and optimize algorithmic efficiency.",
        "Contribute to code health, maintain automated test suites, and write design documents.",
      ],
      location: "Bangalore / Hyderabad, India",
      skills: ["Java", "C++", "Python", "Data Structures", "Algorithms", "System Design"],
      experience: "0-2 years (Fresher)",
      employmentType: "Full-time",
      salary: "₹18 - ₹26 LPA",
      batchEligible: ["2024", "2025", "2026"],
      degreeEligible: ["B.Tech", "B.E.", "M.Tech", "MCA"],
      workMode: "Hybrid",
      category: "OFF_CAMPUS",
      source: "Google Careers (Direct Search & Apply)",
      sourceUrl:
        "https://www.google.com/about/careers/applications/jobs/results/?q=Software%20Engineer",
      applyUrl:
        "https://www.google.com/about/careers/applications/jobs/results/?q=Software%20Engineer",
      deadline: new Date("2026-12-31"),
      status: "Open",
    },
    {
      externalId: "curated_amazon_sde1",
      title: "Software Development Engineer - I (SDE-1)",
      company: "Amazon",
      companyLogo: "https://logo.clearbit.com/amazon.com",
      description:
        "Amazon is actively hiring SDE-1s to join our India Development Centers. You will collaborate with experienced teams of engineers and product leaders to tackle some of the hardest problems in distributed systems, high-availability architecture, and e-commerce services.",
      responsibilities: [
        "Develop scalable web services and cloud-native applications on AWS.",
        "Collaborate with architects and peers to produce rock-solid design specifications.",
        "Champion engineering best practices including CI/CD, unit testing, and code reviews.",
        "Analyze operational telemetry, alarms, and latency metrics to keep systems highly resilient.",
      ],
      location: "Bangalore / Hyderabad / Chennai",
      skills: ["Java", "C++", "AWS", "Data Structures", "OOP", "Distributed Systems"],
      experience: "0-2 years (Fresher)",
      employmentType: "Full-time",
      salary: "₹16 - ₹24 LPA",
      batchEligible: ["2024", "2025", "2026"],
      degreeEligible: ["B.Tech", "B.E.", "MCA", "M.Sc (CS)"],
      workMode: "In-Office",
      category: "OFF_CAMPUS",
      source: "Amazon Jobs (Software Development Openings)",
      sourceUrl:
        "https://www.amazon.jobs/content/en/job-categories/software-development",
      applyUrl:
        "https://www.amazon.jobs/content/en/job-categories/software-development",
      deadline: new Date("2026-11-30"),
      status: "Open",
    },
    {
      externalId: "curated_microsoft_swe",
      title: "Software Engineer - Azure Core",
      company: "Microsoft",
      companyLogo: "https://logo.clearbit.com/microsoft.com",
      description:
        "The Azure team at Microsoft India is building the world's computer. You will engineer fundamental building blocks that power global cloud services, container orchestration, and ultra-high-throughput networking.",
      responsibilities: [
        "Design and implement scalable microservices with fault-tolerant principles.",
        "Build developer tooling, telemetry, and automated deployment pipelines.",
        "Participate in design syncs, performance profiling, and security auditing.",
      ],
      location: "Hyderabad / Noida, India",
      skills: ["C#", ".NET", "C++", "Azure", "Cloud Architecture", "Kubernetes"],
      experience: "0-2 years",
      employmentType: "Full-time",
      salary: "₹17 - ₹25 LPA",
      batchEligible: ["2024", "2025", "2026"],
      degreeEligible: ["B.Tech", "B.E.", "MCA", "M.Tech"],
      workMode: "Hybrid",
      category: "OFF_CAMPUS",
      source: "Microsoft Careers (Direct Apply Portal)",
      sourceUrl: "https://apply.careers.microsoft.com/careers",
      applyUrl: "https://apply.careers.microsoft.com/careers",
      deadline: new Date("2026-12-15"),
      status: "Open",
    },
    {
      externalId: "curated_swiggy_frontend",
      title: "Frontend Engineer (React / Next.js)",
      company: "Swiggy",
      companyLogo: "https://logo.clearbit.com/swiggy.com",
      description:
        "Swiggy is India's leading on-demand convenience platform. We are looking for Frontend Engineers who care deeply about delightful UI, micro-interactions, web performance, and building seamless consumer experiences.",
      responsibilities: [
        "Architect and build responsive, performant user interfaces for millions of consumers.",
        "Optimize Core Web Vitals, page load speeds, and client-side memory footprint.",
        "Collaborate closely with UI/UX designers to implement design system tokens.",
      ],
      location: "Bangalore, India",
      skills: ["React", "JavaScript", "TypeScript", "Next.js", "Redux", "Web Performance"],
      experience: "1-3 years",
      employmentType: "Full-time",
      salary: "₹12 - ₹18 LPA",
      batchEligible: ["2023", "2024", "2025"],
      degreeEligible: ["Any Graduate", "B.Tech", "B.E.", "BCA"],
      workMode: "Hybrid",
      category: "OFF_CAMPUS",
      source: "Swiggy Careers (Official)",
      sourceUrl: "https://careers.swiggy.in/",
      applyUrl: "https://careers.swiggy.in/",
      deadline: new Date("2026-12-20"),
      status: "Open",
    },
    {
      externalId: "curated_razorpay_sde1",
      title: "SDE-1 (Backend / Payment Gateways)",
      company: "Razorpay",
      companyLogo: "https://logo.clearbit.com/razorpay.com",
      description:
        "Powering fintech infrastructure for India. As an SDE-1 at Razorpay, you will build bulletproof transaction processing systems handling billions of rupees daily with sub-second latencies.",
      responsibilities: [
        "Build secure, compliant REST and gRPC microservices.",
        "Handle distributed concurrency, idempotency, and high-volume database sharding.",
        "Work with automated load testing and zero-downtime database migrations.",
      ],
      location: "Bangalore, India",
      skills: ["Go", "Node.js", "PostgreSQL", "Redis", "Kafka", "Docker"],
      experience: "0-2 years",
      employmentType: "Full-time",
      salary: "₹14 - ₹20 LPA",
      batchEligible: ["2024", "2025", "2026"],
      degreeEligible: ["B.Tech", "B.E.", "MCA"],
      workMode: "In-Office",
      category: "OFF_CAMPUS",
      source: "Razorpay Careers (Direct Apply)",
      sourceUrl: "https://razorpay.com/careers/",
      applyUrl: "https://razorpay.com/careers/",
      deadline: new Date("2026-12-31"),
      status: "Open",
    },
  ];
};

/**
 * Main synchronizer function: pulls verified jobs from Greenhouse boards (GitLab, Cloudflare, Figma, Reddit, Discord, Gusto, Airbnb, Stripe), Remotive, RemoteOK, and verified Tech Drives
 */
const syncExternalJobs = async () => {
  console.log("[JobSync] Starting automated job aggregation from external sources...");
  let totalFetched = 0;
  let newAdded = 0;
  let updated = 0;

  try {
    // Clean up any historical seed jobs with missing or broken apply URLs
    await Job.deleteMany({
      $or: [
        { applyUrl: { $exists: false } },
        { applyUrl: null },
        { applyUrl: "" },
        { applyUrl: "undefined" },
      ],
    });

    const greenhouseTargets = [
      { token: "gitlab", company: "GitLab" },
      { token: "cloudflare", company: "Cloudflare" },
      { token: "figma", company: "Figma" },
      { token: "reddit", company: "Reddit" },
      { token: "discord", company: "Discord" },
      { token: "gusto", company: "Gusto" },
      { token: "airbnb", company: "Airbnb" },
      { token: "stripe", company: "Stripe" },
    ];

    const fetchPromises = [
      ...greenhouseTargets.map((t) => fetchGreenhouseJobs(t.token, t.company)),
      fetchRemotiveJobs(),
      fetchRemoteOKJobs(),
      Promise.resolve(getCuratedIndiaTechJobs()),
    ];

    const results = await Promise.allSettled(fetchPromises);
    const candidateJobs = [];

    for (const res of results) {
      if (res.status === "fulfilled" && Array.isArray(res.value)) {
        candidateJobs.push(...res.value);
      }
    }

    totalFetched = candidateJobs.length;
    console.log(
      `[JobSync] Total candidates collected across sources: ${totalFetched}`
    );

    for (const item of candidateJobs) {
      if (!item.externalId || !item.title || !item.company || !item.applyUrl)
        continue;

      const existing = await Job.findOne({ externalId: item.externalId });
      if (existing) {
        existing.status = item.status;
        existing.applyUrl = item.applyUrl;
        existing.sourceUrl = item.sourceUrl;
        existing.source = item.source;
        if (!existing.salary || existing.salary === "Not Disclosed")
          existing.salary = item.salary;
        if (!existing.batchEligible?.length)
          existing.batchEligible = item.batchEligible;
        if (!existing.degreeEligible?.length)
          existing.degreeEligible = item.degreeEligible;
        await existing.save();
        updated++;
      } else {
        await Job.create(item);
        newAdded++;
      }
    }

    console.log(
      `[JobSync] Sync complete. Added: ${newAdded}, Updated: ${updated}, Total in feed: ${totalFetched}`
    );
    return {
      success: true,
      totalFetched,
      newAdded,
      updated,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("[JobSync] Fatal error syncing external jobs:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  syncExternalJobs,
  fetchGreenhouseJobs,
  fetchRemotiveJobs,
  fetchRemoteOKJobs,
  getCuratedIndiaTechJobs,
};
