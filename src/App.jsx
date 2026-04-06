// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import HospitalListing from "./pages/HospitalListing";
import DoctorsList from "./pages/DoctorsList";
import DoctorProfile from "./pages/DoctorProfile";
import PatientLogin from "./pages/PatientLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HospitalListing />} />
          <Route
            path="/hospital/:hospitalId/doctors"
            element={<DoctorsList />}
          />
          <Route path="/doctor/:doctorId" element={<DoctorProfile />} />

          {/* Auth Routes */}
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Direct Dashboard Routes (as per your request) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />

          {/* Payment Routes */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
