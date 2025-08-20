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
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Transfers() {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTransfer, setNewTransfer] = useState({
    assetId: "",
    quantity: "",
    fromBase: "",
    toBase: "",
  });
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [formError, setFormError] = useState("");

  const fetchTransfers = async () => {
    try {
      // setLoading(true);
      const response = await api.get("/transfers");
      setTransfers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();

    const fetchFormData = async () => {
      try {
        const [assetsRes, basesRes] = await Promise.all([
          api.get("/assets"),
          api.get("/bases"),
        ]);
        setAssets(assetsRes.data);
        setBases(basesRes.data);
      } catch (err) {
        console.error("Failed to fetch form data", err);
      }
    };
    fetchFormData();
  }, []);

  const handleInputChange = (e) => {
    setNewTransfer({ ...newTransfer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !newTransfer.assetId ||
      !newTransfer.quantity ||
      !newTransfer.fromBase ||
      !newTransfer.toBase
    ) {
      setFormError("All fields are required.");
      return;
    }
    if (newTransfer.fromBase === newTransfer.toBase) {
      setFormError("From and To bases cannot be the same.");
      return;
    }
    try {
      await api.post("/transfers", newTransfer);
      setNewTransfer({ assetId: "", quantity: "", fromBase: "", toBase: "" });
      fetchTransfers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add transfer.");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      {["admin", "logistics"].includes(user.role) && (
        <>
          <Typography variant="h5">Initiate Transfer</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 2,
              mb: 4,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Asset</InputLabel>
              <Select
                name="assetId"
                value={newTransfer.assetId}
                onChange={handleInputChange}
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
              value={newTransfer.quantity}
              onChange={handleInputChange}
              required
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>From Base</InputLabel>
              <Select
                name="fromBase"
                value={newTransfer.fromBase}
                onChange={handleInputChange}
                required
                label="From Base"
              >
                {bases.map((base) => (
                  <MenuItem key={base._id} value={base._id}>
                    {base.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>To Base</InputLabel>
              <Select
                name="toBase"
                value={newTransfer.toBase}
                onChange={handleInputChange}
                required
                label="To Base"
              >
                {bases.map((base) => (
                  <MenuItem key={base._id} value={base._id}>
                    {base.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">
              Transfer
            </Button>
          </Box>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
        </>
      )}

      <Typography variant="h5">Transfer History</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>From Base</TableCell>
                <TableCell>To Base</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer._id}>
                  <TableCell>{transfer.asset.name}</TableCell>
                  <TableCell>{transfer.quantity}</TableCell>
                  <TableCell>{transfer.fromBase.name}</TableCell>
                  <TableCell>{transfer.toBase.name}</TableCell>
                  <TableCell>
                    {new Date(transfer.date).toLocaleDateString()}
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
