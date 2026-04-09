// src/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorsByHospital,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { verifyAdmin } = require("../middleware/auth");

// Public routes
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.get("/hospital/:hospitalId", getDoctorsByHospital);

// Admin only
router.post("/", verifyAdmin, createDoctor);
router.put("/:id", verifyAdmin, updateDoctor);
router.delete("/:id", verifyAdmin, deleteDoctor);

module.exports = router;
