const db = require("../config/db");

// ── Get all hospitals ─────────────────────────────────────
const getAllHospitals = async (req, res) => {
  try {
    const { search, location, specialty } = req.query;

    let query = "SELECT * FROM hospitals WHERE 1=1";
    const params = [];

    if (search) {
      query += " AND name LIKE ?";
      params.push(`%${search}%`);
    }
    if (location && location !== "All") {
      query += " AND location = ?";
      params.push(location);
    }
    if (specialty && specialty !== "All") {
      query += " AND FIND_IN_SET(?, specialties)";
      params.push(specialty);
    }

    query += " ORDER BY id ASC";

    const [rows] = await db.query(query, params);

    // Convert specialties string to array
    const hospitals = rows.map((h) => ({
      ...h,
      specialties: h.specialties
        ? h.specialties.split(",").map((s) => s.trim())
        : [],
    }));

    res.json(hospitals);
  } catch (err) {
    console.error("Get hospitals error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Get single hospital ───────────────────────────────────
const getHospitalById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hospitals WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Hospital not found." });
    }
    const h = rows[0];
    res.json({
      ...h,
      specialties: h.specialties
        ? h.specialties.split(",").map((s) => s.trim())
        : [],
    });
  } catch (err) {
    console.error("Get hospital error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Create hospital (Admin only) ──────────────────────────
const createHospital = async (req, res) => {
  try {
    const { name, location, contact, specialties } = req.body;

    if (!name || !location) {
      return res
        .status(400)
        .json({ message: "Name and location are required." });
    }

    const specialtiesStr = Array.isArray(specialties)
      ? specialties.join(",")
      : specialties || "";

    const [result] = await db.query(
      "INSERT INTO hospitals (name, location, contact, specialties) VALUES (?, ?, ?, ?)",
      [name, location, contact || "N/A", specialtiesStr],
    );

    res.status(201).json({
      message: "Hospital created successfully!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create hospital error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Update hospital (Admin only) ──────────────────────────
const updateHospital = async (req, res) => {
  try {
    const { name, location, contact, specialties } = req.body;
    const { id } = req.params;

    const specialtiesStr = Array.isArray(specialties)
      ? specialties.join(",")
      : specialties || "";

    const [result] = await db.query(
      "UPDATE hospitals SET name=?, location=?, contact=?, specialties=? WHERE id=?",
      [name, location, contact || "N/A", specialtiesStr, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    res.json({ message: "Hospital updated successfully!" });
  } catch (err) {
    console.error("Update hospital error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Delete hospital (Admin only) ──────────────────────────
const deleteHospital = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM hospitals WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    res.json({ message: "Hospital deleted successfully!" });
  } catch (err) {
    console.error("Delete hospital error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
};
