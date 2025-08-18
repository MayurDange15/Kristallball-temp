import { useContext } from "react";
import { Typography, Container } from "@mui/material";
import { AuthContext } from "../context/AuthContextDefinations";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5">Dashboard</Typography>
      <Typography sx={{ mt: 1 }}>
        Welcome, <b>{user?.username}</b> — role: <b>{user?.role}</b>
      </Typography>
      <Typography sx={{ mt: 2 }}>
        Next: we’ll pull real metrics from <code>/api/dashboard</code>.
      </Typography>
    </Container>
  );
}
