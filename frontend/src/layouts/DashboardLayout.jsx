import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link as RouterLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setOpen(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Kristalball
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user ? `Hi, ${user.username}` : ""}
          </Typography>
          <Button
            onClick={handleLogout}
            color="inherit"
            startIcon={<LogoutIcon />}
            aria-label="logout"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton
              component={RouterLink}
              to="/dashboard"
              onClick={() => setOpen(false)}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            {user && ["admin", "logistics"].includes(user.role) && (
              <>
                <ListItemButton
                  component={RouterLink}
                  to="/purchases"
                  onClick={() => setOpen(false)}
                >
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Purchases" />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  to="/transfers"
                  onClick={() => setOpen(false)}
                >
                  <ListItemIcon>
                    <SwapHorizIcon />
                  </ListItemIcon>
                  <ListItemText primary="Transfers" />
                </ListItemButton>
              </>
            )}
            {user && ["admin", "commander"].includes(user.role) && (
              <ListItemButton
                component={RouterLink}
                to="/assignments"
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Assignments" />
              </ListItemButton>
            )}
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
