import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HospitalListing from "./pages/HospitalListing.jsx";
import DoctorsList from "./pages/DoctorsList.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Login from "./pages/Login.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailure from "./pages/PaymentFailure.jsx";
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
            <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* eSewa payment result pages */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />

            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", padding: "100px 20px" }}>
                  <h2>Page Not Found</h2>
                  <p>Sorry, the page you're looking for doesn't exist.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
   
  );
}

export default App;
