const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const purchasesRoutes = require("./routes/purchases");
const transfersRoutes = require("./routes/transfers");
const assignmentsRoutes = require("./routes/assignments");
const dashboardRoutes = require("./routes/dashboard");
const basesRoutes = require("./routes/bases");
const assetsRoutes = require("./routes/assets");

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("Military Asset Management API is running...");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/purchases", purchasesRoutes);
app.use("/api/transfers", transfersRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bases", basesRoutes);
app.use("/api/assets", assetsRoutes);

// Example protected route
const { protect } = require("./middleware/auth");
app.get("/api/protected", protect(["admin", "commander"]), (req, res) => {
  res.json({ message: `Hello ${req.user.role}, you have access!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
