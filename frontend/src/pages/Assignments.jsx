import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Assignments() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [assignForm, setAssignForm] = useState({
    assetId: "",
    quantity: "",
    assignedTo: "",
  });
  const [expendForm, setExpendForm] = useState({ assetId: "", quantity: "" });
  const [assets, setAssets] = useState([]);
  const [formError, setFormError] = useState({ assign: "", expend: "" });

  const fetchHistory = async () => {
    try {
      // setLoading(true);
      const response = await api.get("/assignments/history");
      setHistory(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await api.get("/assets");
      setAssets(response.data);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchAssets();
  }, []);

  const handleAssignChange = (e) => {
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  };

  const handleExpendChange = (e) => {
    setExpendForm({ ...expendForm, [e.target.name]: e.target.value });
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setFormError({ ...formError, assign: "" });
    try {
      await api.post("/assignments/assign", assignForm);
      setAssignForm({ assetId: "", quantity: "", assignedTo: "" });
      fetchHistory();
      fetchAssets(); // refetch assets to update quantities
    } catch (err) {
      setFormError({
        ...formError,
        assign: err.response?.data?.message || "Failed to assign asset.",
      });
    }
  };

  const handleExpendSubmit = async (e) => {
    e.preventDefault();
    setFormError({ ...formError, expend: "" });
    try {
      await api.post("/assignments/expend", expendForm);
      setExpendForm({ assetId: "", quantity: "" });
      fetchHistory();
      fetchAssets(); // refetch assets to update quantities
    } catch (err) {
      setFormError({
        ...formError,
        expend: err.response?.data?.message || "Failed to expend asset.",
      });
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      {["admin", "commander"].includes(user.role) && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Assign Asset</Typography>
            <Box
              component="form"
              onSubmit={handleAssignSubmit}
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Asset</InputLabel>
                <Select
                  name="assetId"
                  value={assignForm.assetId}
                  onChange={handleAssignChange}
                  required
                  label="Asset"
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset._id} value={asset._id}>
                      {asset.name} ({asset.base.name}) - Qty: {asset.quantity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={assignForm.quantity}
                onChange={handleAssignChange}
                required
              />
              <TextField
                name="assignedTo"
                label="Assign to"
                value={assignForm.assignedTo}
                onChange={handleAssignChange}
                required
              />
              <Button type="submit" variant="contained">
                Assign
              </Button>
              {formError.assign && (
                <Alert severity="error">{formError.assign}</Alert>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Expend Asset</Typography>
            <Box
              component="form"
              onSubmit={handleExpendSubmit}
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Asset</InputLabel>
                <Select
                  name="assetId"
                  value={expendForm.assetId}
                  onChange={handleExpendChange}
                  required
                  label="Asset"
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset._id} value={asset._id}>
                      {asset.name} ({asset.base.name}) - Qty: {asset.quantity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={expendForm.quantity}
                onChange={handleExpendChange}
                required
              />
              <Button type="submit" variant="contained" color="secondary">
                Expend
              </Button>
              {formError.expend && (
                <Alert severity="error">{formError.expend}</Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      <Typography variant="h5" sx={{ mt: 4 }}>
        History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.asset.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.assignedTo || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
