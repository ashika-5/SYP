import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const SPECIALTY_COLORS = {
  Cardiology: "#ef4444",
  Neurology: "#8b5cf6",
  Pediatrics: "#f59e0b",
  Orthopedics: "#10b981",
  Dermatology: "#ec4899",
  ENT: "#06b6d4",
  Gynecology: "#f43f5e",
  Oncology: "#7c3aed",
  "General Surgery": "#059669",
  "Internal Medicine": "#2563eb",
  Urology: "#0891b2",
  Physiotherapy: "#16a34a",
};

const HOSPITAL_ICONS = [
  "🏥",
  "🏨",
  "🏩",
  "🏦",
  "⚕️",
  "🩺",
  "💊",
  "🫀",
  "🧬",
  "🩻",
];

const defaultHospitals = [
  {
    id: 1,
    name: "Dharan Health Clinic",
    location: "Dharan",
    specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
    contact: "01-6678899",
  },
  {
    id: 2,
    name: "Carewell Medical Hospital",
    location: "Itahari",
    specialties: ["Gynecology", "Oncology", "General Surgery"],
    contact: "01-7894567",
  },
  {
    id: 3,
    name: "City Care Hospital",
    location: "Kathmandu",
    specialties: ["Cardiology", "Neurology", "Pediatrics"],
    contact: "01-5551234",
  },
  {
    id: 4,
    name: "Green Valley Medical Center",
    location: "Pokhara",
    specialties: ["Orthopedics", "Dermatology", "ENT"],
    contact: "061-456789",
  },
  {
    id: 5,
    name: "Sunrise Hospital",
    location: "Lalitpur",
    specialties: ["Gynecology", "Oncology", "General Surgery"],
    contact: "01-7894567",
  },
  {
    id: 6,
    name: "Himalayan Health Clinic",
    location: "Bhaktapur",
    specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
    contact: "01-6678899",
  },
  {
    id: 7,
    name: "Global Health Clinic",
    location: "Bhaktapur",
    specialties: ["Orthopedics", "Dermatology", "ENT"],
    contact: "01-6678899",
  },
  {
    id: 8,
    name: "Noble Health Clinic",
    location: "Pokhara",
    specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
    contact: "01-6678899",
  },
  {
    id: 9,
    name: "Trusted Hand Hospital",
    location: "Dharan",
    specialties: ["Gynecology", "Oncology", "General Surgery"],
    contact: "01-7894567",
  },
];

const HospitalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [hospitals, setHospitals] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hospitals") || "[]");
    setHospitals([
      ...defaultHospitals,
      ...saved.map((s) => ({
        ...s,
        specialties: s.specialties || [],
        contact: s.contact || "N/A",
      })),
    ]);
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
      (h.specialties && h.specialties.includes(specialtyFilter));
    return ms && ml && msp;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8faff 0%, #eef4ff 50%, #f0f7ff 100%)",
        pb: 10,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1565c0 100%)",
          pt: 10,
          pb: 14,
          px: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorations */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
              width: [400, 300, 500, 200, 350, 250][i],
              height: [400, 300, 500, 200, 350, 250][i],
              top: [-100, 50, -80, 200, 100, 300][i],
              left: [-80, 300, 600, -100, 500, 800][i],
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
              sx={{ width: 40, height: 3, bgcolor: "#60a5fa", borderRadius: 2 }}
            />
            <Typography
              sx={{
                color: "#60a5fa",
                fontWeight: 600,
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
              fontFamily: "'Georgia', serif",
              fontSize: { xs: 36, md: 56 },
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              mb: 2,
              maxWidth: 680,
            }}
          >
            Find the Right{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
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
              mb: 6,
              maxWidth: 520,
            }}
          >
            Browse {hospitals.length} hospitals across Nepal. Find specialists,
            book appointments, and get care — all in one place.
          </Typography>

          {/* Stats row */}
          <Stack direction="row" spacing={4} sx={{ mb: 6 }}>
            {[
              { num: `${hospitals.length}+`, label: "Hospitals" },
              { num: "150+", label: "Doctors" },
              { num: "10+", label: "Cities" },
              { num: "24/7", label: "Support" },
            ].map((s) => (
              <Box key={s.label}>
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: 24,
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13, mt: 0.5 }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>

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
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2.5,
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                },
                "& input::placeholder": { color: "rgba(255,255,255,0.5)" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255,255,255,0.6)" }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ flex: "1 1 150px", minWidth: 140 }}>
              <Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                displayEmpty
                renderValue={(v) => (v === "All" ? "📍 All Cities" : `📍 ${v}`)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2.5,
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.4)",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.6)" },
                }}
              >
                {locations.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: "1 1 170px", minWidth: 160 }}>
              <Select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                displayEmpty
                renderValue={(v) =>
                  v === "All" ? "🩺 All Specialties" : `🩺 ${v}`
                }
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2.5,
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.4)",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.6)" },
                }}
              >
                {specialties.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                flex: "0 0 auto",
                borderRadius: 2.5,
                py: 1.8,
                px: 3.5,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                fontWeight: 700,
                fontSize: 15,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(59,130,246,0.5)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
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

      {/* Cards Section */}
      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 2 }}>
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
              sx={{ fontWeight: 700, fontSize: 20, color: "#0f172a" }}
            >
              {filtered.length} Hospital{filtered.length !== 1 ? "s" : ""} Found
            </Typography>
            {(searchTerm ||
              locationFilter !== "All" ||
              specialtyFilter !== "All") && (
              <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.5 }}>
                Filtered results —{" "}
                <Box
                  component="span"
                  sx={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}
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
          <Box sx={{ display: "flex", gap: 1 }}>
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
              py: 12,
              bgcolor: "white",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography fontSize={60}>🔍</Typography>
            <Typography variant="h6" fontWeight={700} mt={2} color="#0f172a">
              No hospitals found
            </Typography>
            <Typography color="#64748b" mt={1}>
              Try adjusting your search or filters
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 3, borderRadius: 3 }}
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
                <Card
                  onMouseEnter={() => setHoveredCard(hospital.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border:
                      hoveredCard === hospital.id
                        ? "1.5px solid #3b82f6"
                        : "1.5px solid #e2e8f0",
                    bgcolor: "white",
                    overflow: "hidden",
                    position: "relative",
                    transform:
                      hoveredCard === hospital.id ? "translateY(-6px)" : "none",
                    boxShadow:
                      hoveredCard === hospital.id
                        ? "0 20px 60px rgba(59,130,246,0.18)"
                        : "0 2px 16px rgba(0,0,0,0.06)",
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {/* Card Top Color Bar */}
                  <Box
                    sx={{
                      height: 5,
                      width: "100%",
                      background: `linear-gradient(90deg, ${SPECIALTY_COLORS[hospital.specialties?.[0]] || "#3b82f6"}, ${SPECIALTY_COLORS[hospital.specialties?.[1]] || "#6366f1"})`,
                    }}
                  />

                  <CardContent sx={{ p: 3, flex: 1 }}>
                    {/* Hospital icon + name */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2.5,
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${SPECIALTY_COLORS[hospital.specialties?.[0]] || "#3b82f6"}22, ${SPECIALTY_COLORS[hospital.specialties?.[0]] || "#3b82f6"}11)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 26,
                          border: `1px solid ${SPECIALTY_COLORS[hospital.specialties?.[0]] || "#3b82f6"}22`,
                        }}
                      >
                        {HOSPITAL_ICONS[idx % HOSPITAL_ICONS.length]}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#0f172a",
                            lineHeight: 1.3,
                            mb: 0.5,
                          }}
                        >
                          {hospital.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocationOnIcon
                            sx={{ fontSize: 14, color: "#64748b" }}
                          />
                          <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                            {hospital.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Specialties */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.8,
                        mb: 2.5,
                      }}
                    >
                      {(hospital.specialties || []).map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          sx={{
                            fontSize: 11,
                            height: 22,
                            fontWeight: 600,
                            bgcolor: `${SPECIALTY_COLORS[s] || "#3b82f6"}15`,
                            color: SPECIALTY_COLORS[s] || "#3b82f6",
                            border: `1px solid ${SPECIALTY_COLORS[s] || "#3b82f6"}30`,
                          }}
                        />
                      ))}
                    </Box>

                    {/* Contact */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        py: 1.5,
                        px: 2,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                      <Typography
                        sx={{ fontSize: 13, color: "#475569", fontWeight: 500 }}
                      >
                        {hospital.contact || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() =>
                        navigate(`/hospital/${hospital.id}/doctors`)
                      }
                      sx={{
                        borderRadius: 2.5,
                        py: 1.4,
                        fontWeight: 700,
                        fontSize: 14,
                        background:
                          hoveredCard === hospital.id
                            ? "linear-gradient(135deg, #1d4ed8, #4f46e5)"
                            : "linear-gradient(135deg, #2563eb, #3b82f6)",
                        boxShadow:
                          hoveredCard === hospital.id
                            ? "0 6px 20px rgba(37,99,235,0.45)"
                            : "none",
                        transition: "all 0.3s",
                      }}
                    >
                      View Doctors
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HospitalListing;
