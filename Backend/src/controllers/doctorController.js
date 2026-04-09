const db = require("../config/db");

// ── Get all doctors ───────────────────────────────────────
const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, h.name AS hospital_name
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      ORDER BY d.id ASC
    `);

    const doctors = rows.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      hospitalId: d.hospital_id,
      hospitalName: d.hospital_name || "N/A",
      experience: d.experience,
      qualification: d.qualification,
      availability: d.availability,
      bio: d.bio,
      image: d.image,
    }));

    res.json(doctors);
  } catch (err) {
    console.error("Get doctors error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Get doctors by hospital ───────────────────────────────
const getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const [rows] = await db.query(
      `
      SELECT d.*, h.name AS hospital_name
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      WHERE d.hospital_id = ?
      ORDER BY d.id ASC
    `,
      [hospitalId],
    );

    const doctors = rows.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      hospitalId: d.hospital_id,
      hospitalName: d.hospital_name || "N/A",
      experience: d.experience,
      qualification: d.qualification,
      availability: d.availability,
      bio: d.bio,
      image: d.image,
    }));

    res.json(doctors);
  } catch (err) {
    console.error("Get doctors by hospital error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Get single doctor ─────────────────────────────────────
const getDoctorById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT d.*, h.name AS hospital_name
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      WHERE d.id = ?
    `,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const d = rows[0];
    res.json({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      hospitalId: d.hospital_id,
      hospitalName: d.hospital_name || "N/A",
      experience: d.experience,
      qualification: d.qualification,
      availability: d.availability,
      bio: d.bio,
      image: d.image,
    });
  } catch (err) {
    console.error("Get doctor error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Create doctor (Admin only) ────────────────────────────
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      hospitalId,
      experience,
      qualification,
      availability,
      bio,
      image,
    } = req.body;

    if (!name || !specialty || !hospitalId) {
      return res
        .status(400)
        .json({ message: "Name, specialty, and hospital are required." });
    }

    const [result] = await db.query(
      `INSERT INTO doctors (name, specialty, hospital_id, experience, qualification, availability, bio, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        specialty,
        hospitalId,
        experience || "N/A",
        qualification || "N/A",
        availability || "N/A",
        bio || "",
        image || "",
      ],
    );

    res.status(201).json({
      message: "Doctor created successfully!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create doctor error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Update doctor (Admin only) ────────────────────────────
const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      hospitalId,
      experience,
      qualification,
      availability,
      bio,
      image,
    } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE doctors SET name=?, specialty=?, hospital_id=?, experience=?,
       qualification=?, availability=?, bio=?, image=? WHERE id=?`,
      [
        name,
        specialty,
        hospitalId,
        experience || "N/A",
        qualification || "N/A",
        availability || "N/A",
        bio || "",
        image || "",
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    res.json({ message: "Doctor updated successfully!" });
  } catch (err) {
    console.error("Update doctor error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Delete doctor (Admin only) ────────────────────────────
const deleteDoctor = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM doctors WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    res.json({ message: "Doctor deleted successfully!" });
  } catch (err) {
    console.error("Delete doctor error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorsByHospital,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
