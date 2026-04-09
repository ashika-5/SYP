// src/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  verifyEsewaPayment,
} = require("../controllers/appointmentController");
const { verifyPatient, verifyAdmin } = require("../middleware/auth");

// Patient: book appointment and view own appointments
router.post("/", verifyPatient, createAppointment);
router.get("/my", verifyPatient, getMyAppointments);

// eSewa payment verification (called after eSewa redirects back)
router.post("/esewa/verify", verifyEsewaPayment);

// Admin: view all, update status, delete
router.get("/", verifyAdmin, getAllAppointments);
router.put("/:id/status", verifyAdmin, updateAppointmentStatus);
router.delete("/:id", verifyAdmin, deleteAppointment);

module.exports = router;
