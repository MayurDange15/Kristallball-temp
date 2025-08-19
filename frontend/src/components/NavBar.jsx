import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Military Asset Management
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/purchases">
            Purchases
          </Button>
          <Button color="inherit" component={RouterLink} to="/transfers">
            Transfers
          </Button>
          <Button color="inherit" component={RouterLink} to="/assignments">
            Assignments
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout ({user.role})
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
