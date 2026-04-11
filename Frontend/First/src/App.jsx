import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HospitalListing from "./pages/HospitalListing.jsx";
import DoctorsList from "./pages/DoctorsList.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import PatientLogin from "./pages/PatientLogin.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailure from "./pages/PaymentFailure.jsx";
import Navbar from "./components/Navbar";

import { NotificationProvider } from "./context/NotificationContext";

const PatientRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isPatientLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/patient/login" replace />;
};

const AdminRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/admin" replace />;
};

const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <WithNavbar>
                <HospitalListing />
              </WithNavbar>
            }
          />
          <Route
            path="/hospital/:hospitalId/doctors"
            element={
              <WithNavbar>
                <DoctorsList />
              </WithNavbar>
            }
          />
          <Route
            path="/doctor/:doctorId"
            element={
              <WithNavbar>
                <DoctorProfile />
              </WithNavbar>
            }
          />
          <Route
            path="/payment/success"
            element={
              <WithNavbar>
                <PaymentSuccess />
              </WithNavbar>
            }
          />
          <Route
            path="/payment/failure"
            element={
              <WithNavbar>
                <PaymentFailure />
              </WithNavbar>
            }
          />

          {/* Patient Routes */}
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route
            path="/patient/dashboard"
            element={
              <PatientRoute>
                <PatientDashboard />
              </PatientRoute>
            }
          />
          <Route
            path="/patient"
            element={<Navigate to="/patient/login" replace />}
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <WithNavbar>
                <div style={{ textAlign: "center", padding: "100px 20px" }}>
                  <h2>Page Not Found</h2>
                  <p>Sorry, the page you're looking for doesn't exist.</p>
                </div>
              </WithNavbar>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
