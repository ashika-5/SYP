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
  Chip,
  Avatar,
  Divider,
  Collapse,
  Slider,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// ─── data ──────────────────────────────────────────────────────
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
    established: 2008,
    type: "Clinic",
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
    established: 2005,
    type: "Hospital",
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
    established: 2001,
    type: "Hospital",
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
    established: 2010,
    type: "Medical Center",
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
    established: 2012,
    type: "Hospital",
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
    established: 2015,
    type: "Clinic",
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
    established: 2014,
    type: "Clinic",
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
    established: 2016,
    type: "Clinic",
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
    established: 2009,
    type: "Hospital",
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

const TYPE_COLOR = {
  Hospital: "#1d4ed8",
  Clinic: "#0891b2",
  "Medical Center": "#059669",
};
const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ── Stars ─────────────────────────────────────────────────────
function StarRow({ rating }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          sx={{
            fontSize: 13,
            color: i <= Math.round(rating) ? "#f59e0b" : "#e2e8f0",
          }}
        />
      ))}
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, color: "#1e293b", ml: 0.4 }}
      >
        {rating}
      </Typography>
    </Box>
  );
}

// ── Horizontal MeroDoctor-style card ──────────────────────────
function HospitalCard({ hospital, onView }) {
  const [hov, setHov] = useState(false);
  const col = SPEC_COLORS[hospital.specialties?.[0]] || "#1d4ed8";
  const typeCol = TYPE_COLOR[hospital.type] || "#1d4ed8";
  const ini = initials(hospital.name);

  return (
    <Box
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      sx={{
        bgcolor: "white",
        border: hov ? `1.5px solid ${col}` : "1.5px solid #e8edf2",
        borderRadius: "16px",
        boxShadow: hov ? `0 10px 36px ${col}1a` : "0 1px 8px rgba(0,0,0,0.05)",
        transform: hov ? "translateY(-3px)" : "none",
        transition: "all 0.26s cubic-bezier(0.34,1.1,0.64,1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        mb: 2.5,
        position: "relative",
      }}
    >
      {/* Left accent stripe */}
      <Box
        sx={{
          width: { xs: "100%", sm: 5 },
          height: { xs: 4, sm: "auto" },
          background: `linear-gradient(180deg, ${col} 0%, ${col}55 100%)`,
          flexShrink: 0,
        }}
      />

      {/* Hospital logo tile */}
      <Box
        sx={{
          width: { xs: "100%", sm: 116 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: `${col}08`,
          borderRight: { sm: `1px solid ${col}14` },
          py: { xs: 2.5, sm: 0 },
          flexShrink: 0,
        }}
      >
        <Avatar
          sx={{
            width: 68,
            height: 68,
            borderRadius: "14px",
            background: `linear-gradient(135deg, ${col}28, ${col}10)`,
            border: `2px solid ${col}28`,
            color: col,
            fontWeight: 900,
            fontSize: 20,
            fontFamily: "'Georgia', serif",
            boxShadow: `0 4px 14px ${col}20`,
          }}
        >
          {ini}
        </Avatar>
      </Box>

      {/* Main info */}
      <Box
        sx={{
          flex: 1,
          p: { xs: "16px 20px", sm: "18px 22px" },
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Name row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.4 }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: 15, sm: 17 },
                  color: "#0f172a",
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                }}
              >
                {hospital.name}
              </Typography>
              <VerifiedIcon sx={{ fontSize: 15, color: col, flexShrink: 0 }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                <LocationOnIcon sx={{ fontSize: 13, color: "#64748b" }} />
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                  {hospital.location}, Nepal
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.15,
                  borderRadius: 1,
                  bgcolor: `${typeCol}12`,
                  color: typeCol,
                  fontSize: 11,
                  fontWeight: 700,
                  border: `1px solid ${typeCol}22`,
                }}
              >
                {hospital.type}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                <AccessTimeIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
                <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                  Est. {hospital.established}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ flexShrink: 0, textAlign: "right" }}>
            <StarRow rating={hospital.rating} />
            <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.3 }}>
              {Math.floor(hospital.rating * 38)} reviews
            </Typography>
          </Box>
        </Box>

        {/* Specialty chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7 }}>
          {(hospital.specialties || []).map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                borderRadius: "6px",
                bgcolor: `${SPEC_COLORS[s] || "#3b82f6"}12`,
                color: SPEC_COLORS[s] || "#3b82f6",
                border: `1px solid ${SPEC_COLORS[s] || "#3b82f6"}28`,
              }}
            />
          ))}
        </Box>

        {/* Stats + contact row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 0.5,
          }}
        >
          {[
            { icon: "👨‍⚕️", val: `${hospital.doctors}+ Doctors` },
            { icon: "🛏️", val: `${hospital.beds} Beds` },
            { icon: "🚨", val: "24/7 Emergency" },
          ].map((s) => (
            <Box
              key={s.val}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                px: 1.4,
                py: 0.5,
                borderRadius: 20,
                bgcolor: "#f4f7fb",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography sx={{ fontSize: 12 }}>{s.icon}</Typography>
              <Typography
                sx={{ fontSize: 12, fontWeight: 600, color: "#475569" }}
              >
                {s.val}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}
          >
            <PhoneIcon sx={{ fontSize: 14, color: "#0369a1" }} />
            <Typography
              sx={{ fontSize: 13, fontWeight: 700, color: "#0369a1" }}
            >
              {hospital.contact}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right CTA panel */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, sm: 3 },
          py: { xs: 2.5, sm: 0 },
          gap: 1.5,
          borderLeft: { sm: "1px solid #f0f4f8" },
          minWidth: { sm: 164 },
          flexShrink: 0,
          bgcolor: hov ? `${col}06` : "#fafbfc",
          transition: "background 0.25s",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: 11,
              color: "#94a3b8",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Available
          </Typography>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 900,
              color: col,
              fontFamily: "'Georgia',serif",
              lineHeight: 1.2,
            }}
          >
            Today
          </Typography>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => onView(hospital.id)}
          sx={{
            borderRadius: "10px",
            px: 2.5,
            py: 1.15,
            fontWeight: 800,
            fontSize: 13,
            textTransform: "none",
            whiteSpace: "nowrap",
            background: hov
              ? `linear-gradient(135deg,${col},${col}bb)`
              : "linear-gradient(135deg,#1e40af,#3b82f6)",
            boxShadow: hov
              ? `0 4px 18px ${col}45`
              : "0 4px 14px rgba(30,64,175,0.28)",
            transition: "all 0.25s",
            "&:hover": { transform: "scale(1.04)" },
          }}
        >
          View Doctors
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: "#10b981",
              boxShadow: "0 0 6px #10b981",
            }}
          />
          <Typography sx={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>
            Booking Open
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ── Collapsible sidebar section ───────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          py: 1.2,
          "&:hover .ftitle": { color: "#1d4ed8" },
        }}
      >
        <Typography
          className="ftitle"
          sx={{
            fontWeight: 700,
            fontSize: 12,
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            transition: "color 0.2s",
          }}
        >
          {title}
        </Typography>
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
        )}
      </Box>
      <Collapse in={open}>
        <Box sx={{ pb: 1.5 }}>{children}</Box>
      </Collapse>
      <Divider sx={{ borderColor: "#f1f5f9" }} />
    </Box>
  );
}

// ── Main page ─────────────────────────────────────────────────
const HospitalListing = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        established: s.established || 2020,
        type: s.type || "Clinic",
      })),
    ];
    setHospitals(merged);
  }, []);

  const locations = ["All", ...new Set(hospitals.map((h) => h.location))];
  const specialties = [
    "All",
    ...new Set(hospitals.flatMap((h) => h.specialties || [])),
  ];
  const types = ["All", ...new Set(hospitals.map((h) => h.type || "Hospital"))];

  const filtered = hospitals.filter((h) => {
    const ms = h.name.toLowerCase().includes(searchTerm.toLowerCase());
    const ml = locationFilter === "All" || h.location === locationFilter;
    const msp =
      specialtyFilter === "All" ||
      (h.specialties || []).includes(specialtyFilter);
    const mt = typeFilter === "All" || h.type === typeFilter;
    const mr = (h.rating || 0) >= minRating;
    return ms && ml && msp && mt && mr;
  });

  const activeCount =
    [locationFilter, specialtyFilter, typeFilter].filter((f) => f !== "All")
      .length + (minRating > 0 ? 1 : 0);
  const clearAll = () => {
    setLocationFilter("All");
    setSpecialtyFilter("All");
    setTypeFilter("All");
    setMinRating(0);
    setSearchTerm("");
  };

  // Hero inline select style
  const hSx = {
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
    <Box sx={{ minHeight: "100vh", background: "#f2f5fb" }}>
      {/* ════════════════ HERO — UNCHANGED ════════════════ */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg,#0c1445 0%,#0f2878 45%,#1565c0 80%,#0ea5e9 100%)",
          pt: 10,
          pb: 16,
          px: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
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

          <Typography
            sx={{
              fontFamily: "'Georgia',serif",
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
              sx={hSx}
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
              sx={hSx}
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
      {/* ════════════════ END HERO ════════════════ */}

      {/* ════════════════ MERODOCTOR LAYOUT ════════════════ */}
      <Container
        maxWidth="xl"
        sx={{
          mt: -5,
          position: "relative",
          zIndex: 2,
          pb: 12,
          px: { xs: 2, lg: 4 },
        }}
      >
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* ─── LEFT SIDEBAR ─── */}
          <Box
            sx={{
              width: sidebarOpen ? 272 : 52,
              flexShrink: 0,
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: 20,
              transition: "width 0.3s ease",
            }}
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "16px",
                border: "1px solid #e8edf2",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Sidebar header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarOpen ? "space-between" : "center",
                  px: sidebarOpen ? 2.5 : 0,
                  py: 2,
                  borderBottom: "1px solid #f1f5f9",
                  bgcolor: "#fafbfc",
                }}
              >
                {sidebarOpen && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterListIcon sx={{ fontSize: 17, color: "#1d4ed8" }} />
                    <Typography
                      sx={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}
                    >
                      Filters
                    </Typography>
                    {activeCount > 0 && (
                      <Box
                        sx={{
                          minWidth: 20,
                          height: 20,
                          borderRadius: 10,
                          bgcolor: "#1d4ed8",
                          color: "white",
                          fontSize: 11,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          px: 0.8,
                        }}
                      >
                        {activeCount}
                      </Box>
                    )}
                  </Box>
                )}
                <Tooltip
                  title={sidebarOpen ? "Collapse filters" : "Expand filters"}
                >
                  <IconButton
                    size="small"
                    onClick={() => setSidebarOpen((o) => !o)}
                    sx={{
                      color: "#64748b",
                      "&:hover": { color: "#1d4ed8", bgcolor: "#eff6ff" },
                      borderRadius: 1.5,
                    }}
                  >
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Filter body */}
              {sidebarOpen && (
                <Box sx={{ p: 2.5 }}>
                  {activeCount > 0 && (
                    <Button
                      fullWidth
                      size="small"
                      startIcon={<ClearIcon />}
                      onClick={clearAll}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#ef4444",
                        bgcolor: "#fff1f2",
                        border: "1px solid #fecdd3",
                        "&:hover": { bgcolor: "#ffe4e6" },
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}

                  {/* Location */}
                  <FilterSection title="Location">
                    {locations.map((loc) => (
                      <Box
                        key={loc}
                        onClick={() => setLocationFilter(loc)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 1.5,
                          py: 0.9,
                          borderRadius: 2,
                          cursor: "pointer",
                          mt: 0.5,
                          bgcolor:
                            locationFilter === loc ? "#eff6ff" : "transparent",
                          border:
                            locationFilter === loc
                              ? "1px solid #bfdbfe"
                              : "1px solid transparent",
                          "&:hover": { bgcolor: "#f8fafc" },
                          transition: "all 0.15s",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocationOnIcon
                            sx={{
                              fontSize: 13,
                              color:
                                locationFilter === loc ? "#1d4ed8" : "#94a3b8",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: locationFilter === loc ? 700 : 400,
                              color:
                                locationFilter === loc ? "#1d4ed8" : "#475569",
                            }}
                          >
                            {loc}
                          </Typography>
                        </Box>
                        {locationFilter === loc && (
                          <CheckIcon sx={{ fontSize: 13, color: "#1d4ed8" }} />
                        )}
                      </Box>
                    ))}
                  </FilterSection>

                  {/* Specialty */}
                  <FilterSection title="Specialty" defaultOpen={false}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.7,
                        mt: 1,
                      }}
                    >
                      {specialties.map((sp) => (
                        <Chip
                          key={sp}
                          label={sp}
                          size="small"
                          onClick={() => setSpecialtyFilter(sp)}
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            bgcolor:
                              specialtyFilter === sp
                                ? `${SPEC_COLORS[sp] || "#1d4ed8"}18`
                                : "#f8fafc",
                            color:
                              specialtyFilter === sp
                                ? SPEC_COLORS[sp] || "#1d4ed8"
                                : "#64748b",
                            border:
                              specialtyFilter === sp
                                ? `1.5px solid ${SPEC_COLORS[sp] || "#1d4ed8"}40`
                                : "1px solid #e2e8f0",
                            borderRadius: 1.5,
                            "&:hover": {
                              bgcolor: `${SPEC_COLORS[sp] || "#1d4ed8"}10`,
                            },
                            transition: "all 0.15s",
                          }}
                        />
                      ))}
                    </Box>
                  </FilterSection>

                  {/* Facility type */}
                  <FilterSection title="Facility Type" defaultOpen={false}>
                    {types.map((t) => (
                      <Box
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 1.5,
                          py: 0.9,
                          borderRadius: 2,
                          cursor: "pointer",
                          mt: 0.5,
                          bgcolor: typeFilter === t ? "#eff6ff" : "transparent",
                          border:
                            typeFilter === t
                              ? "1px solid #bfdbfe"
                              : "1px solid transparent",
                          "&:hover": { bgcolor: "#f8fafc" },
                          transition: "all 0.15s",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocalHospitalIcon
                            sx={{
                              fontSize: 13,
                              color: typeFilter === t ? "#1d4ed8" : "#94a3b8",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: typeFilter === t ? 700 : 400,
                              color: typeFilter === t ? "#1d4ed8" : "#475569",
                            }}
                          >
                            {t}
                          </Typography>
                        </Box>
                        {typeFilter === t && (
                          <CheckIcon sx={{ fontSize: 13, color: "#1d4ed8" }} />
                        )}
                      </Box>
                    ))}
                  </FilterSection>

                  {/* Rating slider */}
                  <FilterSection title="Minimum Rating" defaultOpen={false}>
                    <Box sx={{ px: 1, mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                          Any
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                          }}
                        >
                          <StarIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {minRating > 0 ? `${minRating}+` : "All"}
                          </Typography>
                        </Box>
                      </Box>
                      <Slider
                        value={minRating}
                        onChange={(_, v) => setMinRating(v)}
                        min={0}
                        max={5}
                        step={0.5}
                        sx={{
                          color: "#1d4ed8",
                          "& .MuiSlider-thumb": { width: 16, height: 16 },
                          "& .MuiSlider-rail": { bgcolor: "#e2e8f0" },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography sx={{ fontSize: 11, color: "#cbd5e1" }}>
                          0
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "#cbd5e1" }}>
                          5.0 ★
                        </Typography>
                      </Box>
                    </Box>
                  </FilterSection>
                </Box>
              )}
            </Box>
          </Box>
          {/* ─── END SIDEBAR ─── */}

          {/* ─── RIGHT: results list ─── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Results topbar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 2.5,
                px: 3,
                py: 2,
                bgcolor: "white",
                borderRadius: "14px",
                border: "1px solid #e8edf2",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}
                >
                  {filtered.length}{" "}
                  <Box
                    component="span"
                    sx={{ color: "#64748b", fontWeight: 400 }}
                  >
                    hospital{filtered.length !== 1 ? "s" : ""} found
                  </Box>
                </Typography>
                {activeCount > 0 && (
                  <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.2 }}>
                    {activeCount} active filter{activeCount > 1 ? "s" : ""}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {locationFilter !== "All" && (
                  <Chip
                    size="small"
                    label={`📍 ${locationFilter}`}
                    onDelete={() => setLocationFilter("All")}
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                )}
                {specialtyFilter !== "All" && (
                  <Chip
                    size="small"
                    label={specialtyFilter}
                    onDelete={() => setSpecialtyFilter("All")}
                    sx={{
                      bgcolor: `${SPEC_COLORS[specialtyFilter] || "#6366f1"}12`,
                      color: SPEC_COLORS[specialtyFilter] || "#6366f1",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                )}
                {typeFilter !== "All" && (
                  <Chip
                    size="small"
                    label={typeFilter}
                    onDelete={() => setTypeFilter("All")}
                    sx={{
                      bgcolor: "#f0fdf4",
                      color: "#059669",
                      border: "1px solid #bbf7d0",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                )}
                {minRating > 0 && (
                  <Chip
                    size="small"
                    label={`⭐ ${minRating}+`}
                    onDelete={() => setMinRating(0)}
                    sx={{
                      bgcolor: "#fffbeb",
                      color: "#d97706",
                      border: "1px solid #fde68a",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                )}
                {activeCount > 0 && (
                  <Chip
                    size="small"
                    label="Clear all"
                    onClick={clearAll}
                    onDelete={clearAll}
                    sx={{
                      bgcolor: "#f1f5f9",
                      color: "#64748b",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Cards or empty state */}
            {filtered.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 14,
                  bgcolor: "white",
                  borderRadius: "16px",
                  border: "1px solid #e8edf2",
                }}
              >
                <Typography sx={{ fontSize: 52 }}>🔍</Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#0f172a",
                    mt: 2,
                  }}
                >
                  No hospitals found
                </Typography>
                <Typography sx={{ color: "#64748b", mt: 1, mb: 3 }}>
                  Try clearing filters or a different search
                </Typography>
                <Button
                  variant="outlined"
                  onClick={clearAll}
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              filtered.map((h) => (
                <HospitalCard
                  key={h.id}
                  hospital={h}
                  onView={(id) => navigate(`/hospital/${id}/doctors`)}
                />
              ))
            )}
          </Box>
          {/* ─── END RIGHT ─── */}
        </Box>
      </Container>
      {/* ════════════════ END MERODOCTOR LAYOUT ════════════════ */}
    </Box>
  );
};

export default HospitalListing;
