import React from "react";
import { useParams } from "react-router-dom";
import { doctors } from "../data/doctors";
import { hospitals } from "../data/hospitals";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

function DoctorsList() {
  const { hospitalId } = useParams();

  const hospital = hospitals.find((h) => h.id === parseInt(hospitalId));

  const hospitalDoctors = doctors.filter(
    (doc) => doc.hospitalId === parseInt(hospitalId),
  );

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Doctors at {hospital?.name}
      </Typography>

      <Grid container spacing={3}>
        {hospitalDoctors.map((doctor) => (
          <Grid item xs={12} md={4} key={doctor.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={doctor.image}
                alt={doctor.name}
              />

              <CardContent>
                <Typography variant="h6">{doctor.name}</Typography>

                <Typography color="text.secondary">
                  {doctor.specialty}
                </Typography>

                <Typography variant="body2">
                  Experience: {doctor.experience}
                </Typography>

                <Button variant="contained" fullWidth sx={{ mt: 2 }} disabled>
                   
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DoctorsList;
