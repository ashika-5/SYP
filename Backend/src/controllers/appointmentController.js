const db = require("../config/db");

// ── Create appointment ────────────────────────────────────
const createAppointment = async (req, res) => {
  try {
    const {
      doctorId, patientName, patientEmail, patientPhone,
      patientAge, doctorName, hospitalName, preferredTime,
      paymentMethod, transactionId, amount,
    } = req.body;

    if (!doctorId || !patientName || !preferredTime) {
      return res.status(400).json({ message: "Doctor, patient name, and time are required." });
    }

    // Check if time slot already booked for this doctor
    const today = new Date().toISOString().split("T")[0];
    const [existing] = await db.query(
      "SELECT id FROM appointments WHERE doctor_id = ? AND preferred_time = ? AND appointment_date = ? AND status = 'Scheduled'",
      [doctorId, preferredTime, today]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "This time slot is already booked. Please choose another." });
    }

    // Get patient ID if logged in
    const patientId = req.user ? req.user.id : null;

    const [result] = await db.query(
      `INSERT INTO appointments
       (patient_id, doctor_id, patient_name, patient_email, patient_phone, patient_age,
        doctor_name, hospital_name, preferred_time, appointment_date, status,
        amount, payment_method, transaction_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled', ?, ?, ?)`,
      [patientId, doctorId, patientName, patientEmail, patientPhone, patientAge,
       doctorName, hospitalName, preferredTime, today,
       amount || 500, paymentMethod || "eSewa", transactionId || null]
    );

    res.status(201).json({
      message: "Appointment booked successfully!",
      appointmentId: result.insertId,
    });
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Get all appointments (Admin) ──────────────────────────
const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM appointments ORDER BY created_at DESC"
    );
    res.json(rows.map(formatAppointment));
  } catch (err) {
    console.error("Get all appointments error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Get appointments by patient ───────────────────────────
const getMyAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM appointments WHERE patient_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows.map(formatAppointment));
  } catch (err) {
    console.error("Get my appointments error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Update appointment status (Admin) ─────────────────────
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Scheduled", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const [result] = await db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json({ message: "Appointment status updated!" });
  } catch (err) {
    console.error("Update appointment error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── Delete appointment (Admin) ────────────────────────────
const deleteAppointment = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM appointments WHERE id = ?", [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json({ message: "Appointment deleted successfully!" });
  } catch (err) {
    console.error("Delete appointment error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── eSewa payment verification ────────────────────────────
const verifyEsewaPayment = async (req, res) => {
  try {
    const { data } = req.query; // eSewa sends base64 data in URL

    if (!data) {
      return res.status(400).json({ message: "No payment data received." });
    }

    // Decode eSewa response
    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    console.log("eSewa payment response:", decoded);

    // Get pending booking from request body
    const pendingBooking = req.body;

    if (!pendingBooking || !pendingBooking.doctorId) {
      return res.status(400).json({ message: "No pending booking data." });
    }

    const today = new Date().toISOString().split("T")[0];

    const [result] = await db.query(
      `INSERT INTO appointments
       (patient_id, doctor_id, patient_name, patient_email, patient_phone, patient_age,
        doctor_name, hospital_name, preferred_time, appointment_date, status,
        amount, payment_method, transaction_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled', ?, 'eSewa', ?)`,
      [
        pendingBooking.patientId || null,
        pendingBooking.doctorId,
        pendingBooking.patientName,
        pendingBooking.email,
        pendingBooking.contactNumber,
        pendingBooking.age,
        pendingBooking.doctorName,
        pendingBooking.hospitalName,
        pendingBooking.preferredTime,
        today,
        pendingBooking.amount || 500,
        decoded.transaction_uuid || null,
      ]
    );

    res.status(201).json({
      message: "Payment verified and appointment booked!",
      appointmentId: result.insertId,
      transactionId: decoded.transaction_uuid,
    });
  } catch (err) {
    console.error("eSewa verification error:", err);
    res.status(500).json({ message: "Payment verification failed." });
  }
};

// ── Helper to format appointment row ─────────────────────
const formatAppointment = (a) => ({
  id: a.id,
  patientId: a.patient_id,
  doctorId: a.doctor_id,
  patientName: a.patient_name,
  email: a.patient_email,
  contactNumber: a.patient_phone,
  age: a.patient_age,
  doctorName: a.doctor_name,
  hospitalName: a.hospital_name,
  preferredTime: a.preferred_time,
  date: a.appointment_date,
  status: a.status,
  amount: a.amount,
  paymentMethod: a.payment_method,
  transactionId: a.transaction_id,
  createdAt: a.created_at,
});

module.exports = {
  createAppointment, getAllAppointments, getMyAppointments,
  updateAppointmentStatus, deleteAppointment, verifyEsewaPayment,
};