// src/routes/hospitalRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitalController");
const { verifyAdmin } = require("../middleware/auth");

// Public routes (anyone can view)
router.get("/", getAllHospitals);
router.get("/:id", getHospitalById);

// Admin only routes
router.post("/", verifyAdmin, createHospital);
router.put("/:id", verifyAdmin, updateHospital);
router.delete("/:id", verifyAdmin, deleteHospital);

module.exports = router;
