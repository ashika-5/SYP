// src/services/api.js
// This file handles ALL communication between React frontend and Node.js backend

const BASE_URL = "http://localhost:5000/api";

// ── Helper: get auth token from localStorage ──────────────
const getToken = () => localStorage.getItem("token");

// ── Helper: make API request ──────────────────────────────
const request = async (method, endpoint, body = null, requiresAuth = false) => {
  const headers = { "Content-Type": "application/json" };

  if (requiresAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ════════════════════════════════════════════════════════════
// AUTH APIs
// ════════════════════════════════════════════════════════════

export const authAPI = {
  // Patient register
  register: (userData) => request("POST", "/auth/patient/register", userData),

  // Patient login
  login: (credentials) => request("POST", "/auth/patient/login", credentials),

  // Admin login
  adminLogin: (credentials) =>
    request("POST", "/auth/admin/login", credentials),

  // Get patient profile
  getProfile: () => request("GET", "/auth/patient/profile", null, true),
};

// ════════════════════════════════════════════════════════════
// HOSPITAL APIs
// ════════════════════════════════════════════════════════════

export const hospitalAPI = {
  // Get all hospitals (with optional filters)
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request("GET", `/hospitals${query ? "?" + query : ""}`);
  },

  // Get single hospital
  getById: (id) => request("GET", `/hospitals/${id}`),

  // Admin: create hospital
  create: (data) => request("POST", "/hospitals", data, true),

  // Admin: update hospital
  update: (id, data) => request("PUT", `/hospitals/${id}`, data, true),

  // Admin: delete hospital
  delete: (id) => request("DELETE", `/hospitals/${id}`, null, true),
};

// ════════════════════════════════════════════════════════════
// DOCTOR APIs
// ════════════════════════════════════════════════════════════

export const doctorAPI = {
  // Get all doctors
  getAll: () => request("GET", "/doctors"),

  // Get doctors by hospital
  getByHospital: (hospitalId) =>
    request("GET", `/doctors/hospital/${hospitalId}`),

  // Get single doctor
  getById: (id) => request("GET", `/doctors/${id}`),

  // Admin: create doctor
  create: (data) => request("POST", "/doctors", data, true),

  // Admin: update doctor
  update: (id, data) => request("PUT", `/doctors/${id}`, data, true),

  // Admin: delete doctor
  delete: (id) => request("DELETE", `/doctors/${id}`, null, true),
};

// ════════════════════════════════════════════════════════════
// APPOINTMENT APIs
// ════════════════════════════════════════════════════════════

export const appointmentAPI = {
  // Patient: book appointment
  book: (data) => request("POST", "/appointments", data, true),

  // Patient: get own appointments
  getMyAppointments: () => request("GET", "/appointments/my", null, true),

  // Admin: get all appointments
  getAll: () => request("GET", "/appointments", null, true),

  // Admin: update appointment status
  updateStatus: (id, status) =>
    request("PUT", `/appointments/${id}/status`, { status }, true),

  // Admin: delete appointment
  delete: (id) => request("DELETE", `/appointments/${id}`, null, true),

  // eSewa: verify payment and save appointment
  verifyEsewa: (pendingBooking) =>
    request("POST", "/appointments/esewa/verify", pendingBooking),
};
