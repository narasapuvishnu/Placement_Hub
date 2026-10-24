import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Practice from "./pages/Practice";
import PracticeSolve from "./pages/PracticeSolve";
import InterviewExperiences from "./pages/InterviewExperiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import Resources from "./pages/Resources";
import ResumeStudio from "./pages/ResumeStudio";
import MockInterview from "./pages/MockInterview";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 w-100 bg-light">
      <Navbar />
      <main className="flex-grow-1 w-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:id" element={<PracticeSolve />} />
          <Route path="/experiences" element={<InterviewExperiences />} />
          <Route path="/experiences/:id" element={<ExperienceDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resume" element={<ResumeStudio />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/mock-interviews" element={<MockInterview />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
