const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const employeeRoutes = require("./routes/employee");

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL if different
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add any other methods if necessary
  allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers if needed
}));

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));
