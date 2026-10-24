# 🎓 PlacementHub — Comprehensive Campus & Off-Campus Career Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-emerald.svg)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-Llama%20%2F%20GPT--OSS-orange.svg)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**PlacementHub** is an all-in-one placement preparation and hiring ecosystem designed to take engineering and tech students from zero to job offer. It unifies daily curated off-campus/on-campus drives, an interactive LeetCode-style practice IDE, AI-powered mock interviews, realistic ATS resume analysis, community interview experiences, and real-time streak activity tracking into a single modern platform.

---

## 🌟 Key Features Across All 10 Phases

### 1. 💼 Jobs Portal & Auto-Sync
* **Curated Job Drives**: AccioJob-style categorized listings for **Off-Campus**, **Internships**, and **On-Campus drives**.
* **Automated Sync Engine**: Daily automated fetch and deduplication from top tech companies (Google, Microsoft, Amazon, Swiggy) and remote job portals (Greenhouse, Remotive).
* **Direct Apply & Tracking**: In-portal application status tracking with instant direct career portal application links.

### 2. 🎯 Profile-Based Job Recommendations *(New!)*
* **Automatic Resume-to-Profile Sync**: Uploading or pasting your resume in Resume Studio instantly parses your skills, target roles, graduation year, and degree to build your candidate profile.
* **Smart Matching Algorithm**: Evaluates exact technical skills, target role titles, batch eligibility (e.g. 2026/2027), degree requirements, and location preferences to produce an accurate **⭐ Match Score (15% - 98%)**.
* **Domain Relevancy Filter**: Ensures tech candidates receive high-affinity SDE, Full Stack, Frontend, and Backend roles while filtering out non-tech listings.

### 3. 🧩 Practice & Coding IDE (DSA, SQL, Aptitude)
* **Problem Repository**: Curated questions with difficulty filters (Easy, Medium, Hard), topic tags (Arrays, Dynamic Programming, SQL, System Design), and target company tags.
* **Interactive Code Runner**: Embedded code editor with live JavaScript execution against sample and hidden test cases.
* **Performance Tracking**: Records acceptance status, submission timestamps, and difficulty distribution.

### 4. 🏢 Company Roadmaps & Hiring Guides
* **Top Company Blueprints**: In-depth recruitment guides for Google, Amazon, Microsoft, Uber, Atlassian, and top startups.
* **Round-by-Round Breakdown**: Online assessment syllabus, technical interview rounds, bar raiser tips, and CTC salary ranges.

### 5. 💬 Community Interview Experiences
* **Authentic Candidate Insights**: Read and publish real-world round-by-round interview experiences.
* **Upvoting & Filtering**: Filter by company, interview outcome (Offered / Rejected / Pending), and difficulty level.
* **Full Moderation**: Built-in administrative review and moderation.

### 6. 📄 ATSense AI Resume Studio
* **Resume Text Extraction**: Supports both PDF uploads (`pdf-parse`) and copy-pasted text.
* **Deep ATS Gap Analysis**: Powered by Groq AI and deterministic fallbacks to score keyword density, skills alignment, action verb impact, and formatting against target job descriptions.
* **AI Resume Optimizer**: Generates an optimized, ATS-friendly markdown resume with quantified XYZ-format bullet points.

### 7. 🎙️ AI-Driven Mock Interviews
* **Role-Specific Sessions**: Practice HR, Technical Coding, and System Design rounds tailored to your target position and experience level.
* **Real-Time AI Feedback**: Evaluates communication, technical depth, problem-solving structure, and awards actionable scores out of 10.

### 8. 📊 Dashboard, Streaks & LeetCode Heatmap
* **Placement Activity Calendar**: 30-day interactive activity matrix tracking daily coding submissions, mock interviews, and job applications.
* **Daily Placement Goals**: Interactive streak targets that reward consistent preparation.
* **Quick Study Launchpad**: One-click shortcuts to resumes, problem sets, and company interview archives.

### 9. 🛡️ Admin Management Suite
* **Protected Portal**: Role-based access control for platform administrators.
* **Complete CRUD**: Manage job openings, add custom practice questions with test cases, curate company pages, and update student job application statuses.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Bootstrap 5, Vanilla CSS Design System, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, JWT Authentication, Multer (Memory Storage) |
| **Database** | MongoDB, Mongoose ODM |
| **AI / Machine Learning** | Groq SDK (LLM-based ATS analysis & Mock Interviews), PDFParse |
| **External Integrations** | Remote job APIs, Qdrant Vector Search Support |

---

## 📂 Project Architecture

```
PlacementHub/
├── frontend/                     # React + Vite client
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Modals, Shared Cards
│   │   ├── context/              # AuthContext (JWT & User state)
│   │   ├── pages/                # Home, Jobs, JobDetails, Practice, PracticeSolve,
│   │   │                         # ResumeStudio, MockInterview, Companies,
│   │   │                         # InterviewExperiences, Dashboard, Admin
│   │   ├── App.jsx               # Route definitions & guards
│   │   ├── index.css             # AccioJob & PlacementHub CSS styling
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Express.js REST API
│   ├── config/                   # MongoDB connection logic
│   ├── controllers/              # Job, Profile, Experience, Practice controllers
│   ├── middleware/               # JWT auth & Admin route protection
│   ├── models/                   # Mongoose schemas (Job, Profile, Question, User, etc.)
│   ├── routes/                   # API routes (/api/jobs, /api/profile, etc.)
│   ├── services/                 # ATSense AI, Job sync scraper, Groq clients
│   ├── server.js                 # Express server bootstrap
│   └── package.json
│
├── .gitignore                    # Git ignore file (excludes secrets & dependencies)
└── README.md                     # Comprehensive project documentation
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
* **Node.js** (v18.x or higher)
* **MongoDB** (Local instance or MongoDB Atlas URI)
* **npm** or **yarn**

### 1. Clone Repository
```bash
git clone https://github.com/narasapuvishnu/Placement_Hub.git
cd Placement_Hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placementhub
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Optional: Groq AI for Resume ATS & Mock Interviews
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

Run database seed scripts (Optional to populate sample problems & jobs):
```bash
node seedPracticeExpansion.js
node seedJobsExpansion.js
```

Start the backend server:
```bash
npm run dev
# or: node server.js
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔒 Security & Privacy Notice
* Sensitive environment credentials (`.env`), API keys, and local binaries are strictly ignored via `.gitignore`.
* Passwords are encrypted using `bcryptjs`.
* Sensitive endpoints require verified JWT bearer tokens.

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
