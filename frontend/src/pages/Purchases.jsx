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

export default function Purchases() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newPurchase, setNewPurchase] = useState({
    name: "",
    type: "",
    quantity: "",
    base: "",
  });
  const [bases, setBases] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [formError, setFormError] = useState("");

  const fetchPurchases = async () => {
    try {
      // setLoading(true);
      const response = await api.get("/purchases");
      setPurchases(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();

    const fetchFilterData = async () => {
      try {
        const [basesRes, assetTypesRes] = await Promise.all([
          api.get("/bases"),
          api.get("/purchases/types"),
        ]);
        setBases(basesRes.data);
        setAssetTypes(assetTypesRes.data);
      } catch (err) {
        console.error("Failed to fetch filter data", err);
      }
    };
    fetchFilterData();
  }, []);

  const handleInputChange = (e) => {
    setNewPurchase({ ...newPurchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !newPurchase.name ||
      !newPurchase.type ||
      !newPurchase.quantity ||
      !newPurchase.base
    ) {
      setFormError("All fields are required.");
      return;
    }
    try {
      await api.post("/purchases", newPurchase);
      setNewPurchase({ name: "", type: "", quantity: "", base: "" });
      fetchPurchases();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add purchase.");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      {["admin", "logistics"].includes(user.role) && (
        <>
          <Typography variant="h5">Add Purchase</Typography>
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
            <TextField
              name="name"
              label="Asset Name"
              value={newPurchase.name}
              onChange={handleInputChange}
              required
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={newPurchase.type}
                onChange={handleInputChange}
                required
                label="Type"
              >
                {assetTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              value={newPurchase.quantity}
              onChange={handleInputChange}
              required
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Base</InputLabel>
              <Select
                name="base"
                value={newPurchase.base}
                onChange={handleInputChange}
                required
                label="Base"
              >
                {bases.map((base) => (
                  <MenuItem key={base._id} value={base._id}>
                    {base.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">
              Add Purchase
            </Button>
          </Box>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
        </>
      )}

      <Typography variant="h5">Purchase History</Typography>
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
                <TableCell>Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Base</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase._id}>
                  <TableCell>{purchase.asset.name}</TableCell>
                  <TableCell>{purchase.asset.type}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>{purchase.toBase.name}</TableCell>
                  <TableCell>
                    {new Date(purchase.date).toLocaleDateString()}
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
