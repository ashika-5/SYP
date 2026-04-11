const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const hospitalRoutes = require("./src/routes/hospitalRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend URL
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

// ── Health check ──────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "MediCare API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      hospitals: "/api/hospitals",
      doctors: "/api/doctors",
      appointments: "/api/appointments",
    },
  });
});

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`

    MediCare Backend Running!         
    Port: ${PORT}                         
    http://localhost:${PORT}              

  `);
});

module.exports = app;
