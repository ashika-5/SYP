import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HospitalListing from "./pages/HospitalListing.jsx";
import DoctorsList from "./pages/DoctorsList.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Login from "./pages/Login.jsx";

import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Navbar />

        <Routes>
          <Route path="/" element={<HospitalListing />} />

          <Route
            path="/hospital/:hospitalId/doctors"
            element={<DoctorsList />}
          />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "100px 20px" }}>
                <h2>Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
