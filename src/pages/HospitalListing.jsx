// src/pages/HospitalListing.jsx
// Hero section kept exactly as-is from previous build.
// Hospital cards below redesigned in MeroDoctor style.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Container,
  Typography,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";

// ─── data ──────────────────────────────────────────────────
const DEFAULT_HOSPITALS = [
  {
    id: 1,
    name: "Dharan Health Clinic",
    location: "Dharan",
    specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
    contact: "01-6678899",
    rating: 4.5,
    doctors: 3,
    beds: 50,
  },
  {
    id: 2,
    name: "Carewell Medical Hospital",
    location: "Itahari",
    specialties: ["Gynecology", "Oncology", "General Surgery"],
    contact: "01-7894567",
    rating: 4.7,
    doctors: 3,
    beds: 80,
  },
  {
    id: 3,
    name: "City Care Hospital",
    location: "Kathmandu",
    specialties: ["Cardiology", "Neurology", "Pediatrics"],
    contact: "01-5551234",
    rating: 4.8,
    doctors: 3,
    beds: 120,
  },
  {
    id: 4,
    name: "Green Valley Medical Center",
    location: "Pokhara",
    specialties: ["Orthopedics", "Dermatology", "ENT"],
    contact: "061-456789",
    rating: 4.6,
    doctors: 3,
    beds: 90,
  },
  {
    id: 5,
    name: "Sunrise Hospital",
    location: "Lalitpur",
    specialties: ["Gynecology", "Oncology", "General Surgery"],
    contact: "01-7894567",
    rating: 4.4,
    doctors: 3,
    beds: 70,
  },
  {
    id: 6,
    name: "Himalayan Health Clinic",
    location: "Bhaktapur",
    specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
    contact: "01-6678899",
    rating: 4.3,
    doctors: 3,
    beds: 60,
  },
  {
    id: 7,
    name: "Global Health Clinic",
    location: "Bhaktapur",
    specialties: ["Orthopedics", "Dermatology", "ENT"],
    contact: "01-6678899",
    rating: 4.5,
    doctors: 2,
    beds: 55,
  },
  {
    id: 8,
    name: "Noble Health Clinic",
    location: "Pokhara",
    specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
    contact: "01-6678899",
    rating: 4.2,
    doctors: 3,
    beds: 65,
  },
  {
    id: 9,
    name: "Trusted Hand Hospital",
    location: "Dharan",
    specialties: ["Gynecology", "Oncology", "General Surgery"],
    contact: "01-7894567",
    rating: 4.6,
    doctors: 3,
    beds: 75,
  },
];

const SPEC_COLORS = {
  Cardiology: "#e11d48",
  Neurology: "#7c3aed",
  Pediatrics: "#2563eb",
  Orthopedics: "#d97706",
  Dermatology: "#ec4899",
  ENT: "#0891b2",
  Gynecology: "#be185d",
  Oncology: "#4f46e5",
  "General Surgery": "#059669",
  "Internal Medicine": "#1d4ed8",
  Urology: "#0e7490",
  Physiotherapy: "#16a34a",
};

const HOSP_AVATARS = ["🏥", "🏨", "⚕️", "🩺", "💊", "🫀", "🧬", "🩻", "🏩"];

// Star rating display
function Stars({ rating }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <StarIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
        {rating}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>(reviews)</Typography>
    </Box>
  );
}

// ─── MeroDoctor-style Hospital Card ────────────────────────
function HospitalCard({ hospital, index, onView }) {
  const [hovered, setHovered] = useState(false);
  const primarySpec = hospital.specialties?.[0] || "";
  const color = SPEC_COLORS[primarySpec] || "#1d4ed8";

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        border: hovered ? `1.5px solid ${color}` : "1.5px solid #e2e8f0",
        boxShadow: hovered
          ? `0 16px 48px ${color}18`
          : "0 1px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.28s cubic-bezier(0.34,1.2,0.64,1)",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Colored top strip */}
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }}
      />

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header row */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {/* Avatar */}
          <Avatar
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2.5,
              flexShrink: 0,
              fontSize: 28,
              bgcolor: `${color}15`,
              border: `1.5px solid ${color}25`,
            }}
          >
            {HOSP_AVATARS[index % HOSP_AVATARS.length]}
          </Avatar>

          {/* Name + Location */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 15,
                color: "#0f172a",
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {hospital.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: "#64748b" }} />
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                {hospital.location}, Nepal
              </Typography>
            </Box>
            <Stars rating={hospital.rating} />
          </Box>
        </Box>

        {/* Specialties */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2 }}>
          {(hospital.specialties || []).map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              sx={{
                fontSize: 11,
                height: 22,
                fontWeight: 600,
                bgcolor: `${SPEC_COLORS[s] || "#3b82f6"}14`,
                color: SPEC_COLORS[s] || "#3b82f6",
                border: `1px solid ${SPEC_COLORS[s] || "#3b82f6"}28`,
              }}
            />
          ))}
        </Box>

        {/* Stats row (MeroDoctor-style) */}
        <Box
          sx={{
            display: "flex",
            gap: 0,
            mb: 2.5,
            bgcolor: "#f8fafc",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          {[
            { icon: "👨‍⚕️", val: `${hospital.doctors}+`, label: "Doctors" },
            { icon: "🛏️", val: `${hospital.beds}`, label: "Beds" },
            { icon: "⏰", val: "24/7", label: "Emergency" },
          ].map((s, i) => (
            <Box
              key={s.label}
              sx={{
                flex: 1,
                py: 1.2,
                textAlign: "center",
                borderRight: i < 2 ? "1px solid #e2e8f0" : "none",
              }}
            >
              <Typography sx={{ fontSize: 14 }}>{s.icon}</Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.2,
                }}
              >
                {s.val}
              </Typography>
              <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Contact */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2.5,
            px: 1.5,
            py: 1.2,
            borderRadius: 2,
            bgcolor: "#f0f9ff",
            border: "1px solid #bae6fd",
          }}
        >
          <PhoneIcon sx={{ fontSize: 15, color: "#0369a1" }} />
          <Typography sx={{ fontSize: 13, color: "#0369a1", fontWeight: 600 }}>
            {hospital.contact}
          </Typography>
        </Box>

        {/* CTA */}
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => onView(hospital.id)}
          sx={{
            borderRadius: 2.5,
            py: 1.3,
            fontWeight: 800,
            fontSize: 14,
            textTransform: "none",
            background: hovered
              ? `linear-gradient(135deg, ${color}dd, ${color})`
              : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            boxShadow: hovered
              ? `0 4px 16px ${color}44`
              : "0 4px 12px rgba(29,78,216,0.3)",
            transition: "all 0.3s",
          }}
        >
          View Doctors
        </Button>
      </Box>
    </Box>
  );
}

// ─── Main page ──────────────────────────────────────────────
const HospitalListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hospitals") || "[]");
    const merged = [
      ...DEFAULT_HOSPITALS,
      ...saved.map((s) => ({
        ...s,
        specialties: s.specialties || [],
        contact: s.contact || "N/A",
        rating: s.rating || 4.0,
        doctors: s.doctors || 1,
        beds: s.beds || 20,
      })),
    ];
    setHospitals(merged);
  }, []);

  const locations = ["All", ...new Set(hospitals.map((h) => h.location))];
  const specialties = [
    "All",
    ...new Set(hospitals.flatMap((h) => h.specialties || [])),
  ];

  const filtered = hospitals.filter((h) => {
    const ms = h.name.toLowerCase().includes(searchTerm.toLowerCase());
    const ml = locationFilter === "All" || h.location === locationFilter;
    const msp =
      specialtyFilter === "All" ||
      (h.specialties || []).includes(specialtyFilter);
    return ms && ml && msp;
  });

  const selectSx = {
    bgcolor: "rgba(255,255,255,0.1)",
    borderRadius: 2.5,
    color: "white",
    minWidth: 140,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.2)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.45)",
    },
    "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.65)" },
    "& .MuiSelect-select": { py: 1.55 },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8faff 0%,#eef4ff 50%,#f0f7ff 100%)",
      }}
    >
      {/* ══════════════ HERO (unchanged from your screenshot) ══════════════ */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0c1445 0%, #0f2878 45%, #1565c0 80%, #0ea5e9 100%)",
          pt: 10,
          pb: 16,
          px: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative circles */}
        {[
          { w: 500, h: 500, top: -150, right: -150 },
          { w: 300, h: 300, bottom: -100, left: -80 },
          { w: 220, h: 220, top: 80, left: "25%" },
        ].map((c, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: c.w,
              height: c.h,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.05)",
              bgcolor: "rgba(255,255,255,0.02)",
              top: c.top,
              bottom: c.bottom,
              left: c.left,
              right: c.right,
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{ width: 40, height: 3, bgcolor: "#60a5fa", borderRadius: 2 }}
            />
            <Typography
              sx={{
                color: "#60a5fa",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Nepal's Trusted Network
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            sx={{
              fontFamily: "'Georgia', serif",
              fontSize: { xs: 36, md: 56 },
              fontWeight: 900,
              color: "white",
              lineHeight: 1.15,
              mb: 2,
              maxWidth: 700,
            }}
          >
            Find the Right{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hospital
            </Box>{" "}
            for You
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 18,
              mb: 5,
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Browse {hospitals.length} hospitals across Nepal. Find specialists,
            book appointments, and get care — all in one place.
          </Typography>

          {/* Stats */}
          <Box sx={{ display: "flex", gap: 5, mb: 7, flexWrap: "wrap" }}>
            {[
              { n: `${hospitals.length}+`, l: "Hospitals" },
              { n: "150+", l: "Doctors" },
              { n: "10+", l: "Cities" },
              { n: "24/7", l: "Support" },
            ].map((s) => (
              <Box key={s.l}>
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 900,
                    fontSize: 26,
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13, mt: 0.5 }}
                >
                  {s.l}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Search bar */}
          <Box
            sx={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: 2.5,
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search hospital by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flex: "1 1 220px",
                minWidth: 180,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2.5,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                },
                "& input::placeholder": { color: "rgba(255,255,255,0.5)" },
                "& input": { py: 1.55 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255,255,255,0.6)" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              displayEmpty
              renderValue={(v) => (v === "All" ? "📍 All Cities" : `📍 ${v}`)}
              sx={selectSx}
            >
              {locations.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              displayEmpty
              renderValue={(v) =>
                v === "All" ? "🩺 All Specialties" : `🩺 ${v}`
              }
              sx={selectSx}
            >
              {specialties.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                borderRadius: 2.5,
                py: 1.55,
                px: 3.5,
                fontWeight: 800,
                fontSize: 15,
                textTransform: "none",
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.5)",
                "&:hover": {
                  background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s",
              }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ══════════════ CARDS (MeroDoctor style) ══════════════ */}
      <Container
        maxWidth="lg"
        sx={{ mt: -6, position: "relative", zIndex: 2, pb: 10 }}
      >
        {/* Results header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}
            >
              {filtered.length} Hospital{filtered.length !== 1 ? "s" : ""} Found
            </Typography>
            {(searchTerm ||
              locationFilter !== "All" ||
              specialtyFilter !== "All") && (
              <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.3 }}>
                Showing filtered results —{" "}
                <Box
                  component="span"
                  sx={{ color: "#3b82f6", cursor: "pointer", fontWeight: 700 }}
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("All");
                    setSpecialtyFilter("All");
                  }}
                >
                  Clear all
                </Box>
              </Typography>
            )}
          </Box>
          {/* Active filter chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {locationFilter !== "All" && (
              <Chip
                label={locationFilter}
                onDelete={() => setLocationFilter("All")}
                size="small"
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                }}
              />
            )}
            {specialtyFilter !== "All" && (
              <Chip
                label={specialtyFilter}
                onDelete={() => setSpecialtyFilter("All")}
                size="small"
                sx={{
                  bgcolor: "#f5f3ff",
                  color: "#6d28d9",
                  border: "1px solid #ddd6fe",
                }}
              />
            )}
          </Box>
        </Box>

        {filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 14,
              bgcolor: "white",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography fontSize={56}>🔍</Typography>
            <Typography variant="h6" fontWeight={700} mt={2} color="#0f172a">
              No hospitals found
            </Typography>
            <Typography color="#64748b" mt={1} mb={3}>
              Try adjusting your search or filters
            </Typography>
            <Button
              variant="outlined"
              sx={{ borderRadius: 3, textTransform: "none" }}
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("All");
                setSpecialtyFilter("All");
              }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((hospital, idx) => (
              <Grid item xs={12} sm={6} lg={4} key={hospital.id}>
                <HospitalCard
                  hospital={hospital}
                  index={idx}
                  onView={(id) => navigate(`/hospital/${id}/doctors`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HospitalListing;
