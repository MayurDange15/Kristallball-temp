import { Container, Typography } from "@mui/material";

export default function Assignments() {
  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5">Assignments & Expenditures</Typography>
      <Typography sx={{ mt: 2 }}>
        (Coming up) Assign asset to personnel / mark expended.
      </Typography>
    </Container>
  );
}
