const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ── Patient Register ──────────────────────────────────────
const patientRegister = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validate
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone must be exactly 10 digits." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check if email exists
    const [existing] = await db.query(
      "SELECT id FROM patients WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert patient
    const [result] = await db.query(
      "INSERT INTO patients (full_name, email, phone, password) VALUES (?, ?, ?, ?)",
      [fullName, email, phone, hashedPassword],
    );

    res.status(201).json({
      message: "Account created successfully!",
      patientId: result.insertId,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── Patient Login ─────────────────────────────────────────
const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find patient
    const [rows] = await db.query("SELECT * FROM patients WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const patient = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: patient.id,
        email: patient.email,
        role: "patient",
        name: patient.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      message: "Login successful!",
      token,
      patient: {
        id: patient.id,
        fullName: patient.full_name,
        email: patient.email,
        phone: patient.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── Admin Login ───────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find admin
    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const admin = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin", name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      message: "Admin login successful!",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── Get current patient profile ───────────────────────────
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, phone, created_at FROM patients WHERE id = ?",
      [req.user.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { patientRegister, patientLogin, adminLogin, getProfile };
