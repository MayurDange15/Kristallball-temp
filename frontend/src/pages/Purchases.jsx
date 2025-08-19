import { Container, Typography } from "@mui/material";

export default function Purchases() {
  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5">Purchases</Typography>
      <Typography sx={{ mt: 2 }}>
        (Coming up) Table of purchases + form to add a purchase.
      </Typography>
    </Container>
  );
}
