import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../api/axios";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    base: "",
    assetType: "",
  });
  const [bases, setBases] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard", { params: filters });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // Fetch filter options
  useEffect(() => {
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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Dashboard</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Base</InputLabel>
          <Select
            name="base"
            value={filters.base}
            onChange={handleFilterChange}
            label="Base"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {bases.map((base) => (
              <MenuItem key={base._id} value={base._id}>
                {base.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Asset Type</InputLabel>
          <Select
            name="assetType"
            value={filters.assetType}
            onChange={handleFilterChange}
            label="Asset Type"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {assetTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Opening</TableCell>
                <TableCell>Purchased</TableCell>
                <TableCell>Transfer In</TableCell>
                <TableCell>Transfer Out</TableCell>
                <TableCell>Assigned</TableCell>
                <TableCell>Expended</TableCell>
                <TableCell>Closing</TableCell>
                <TableCell>Net Movement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.asset}>
                  <TableCell>{row.asset}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.opening}</TableCell>
                  <TableCell>{row.purchased}</TableCell>
                  <TableCell>{row.transferIn}</TableCell>
                  <TableCell>{row.transferOut}</TableCell>
                  <TableCell>{row.assigned}</TableCell>
                  <TableCell>{row.expended}</TableCell>
                  <TableCell>{row.closing}</TableCell>
                  <TableCell>{row.netMovement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
