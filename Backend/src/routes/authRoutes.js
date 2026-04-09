// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  patientRegister,
  patientLogin,
  adminLogin,
  getProfile,
} = require("../controllers/authController");
const { verifyPatient } = require("../middleware/auth");

// Patient auth
router.post("/patient/register", patientRegister);
router.post("/patient/login", patientLogin);

// Admin auth
router.post("/admin/login", adminLogin);

// Get profile (patient must be logged in)
router.get("/patient/profile", verifyPatient, getProfile);

module.exports = router;
