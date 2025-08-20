import { Paper, Typography, Stack } from "@mui/material";

export default function Dashboard() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Dashboard</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>
          Your dashboard is live. Wire real widgets and API data next.
        </Typography>
      </Paper>
    </Stack>
  );
}
