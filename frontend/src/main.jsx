import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Configure Axios base URL for both local dev and production deployment (Vercel / Render / Railway)
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
