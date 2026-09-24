require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseroutes");
const authRoutes = require("./routes/authroutes");
const paymentroutes = require("./routes/paymentroutes");
const chatroutes = require("./routes/chatRoutes");


const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  });
});

// API routes
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentroutes);
app.use("/api/chat", chatroutes);

// Invalid route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

const PORT = process.env.PORT || process.env.port || 5500;

// Create/update default admin from .env
const createDefaultAdmin = async () => {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.log("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    return;
  }

  let admin = await User.findOne({ email });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    console.log("Default admin created");
    return;
  }

  let changed = false;

  if (admin.role !== "admin") {
    admin.role = "admin";
    changed = true;
  }

  if (!admin.isVerified) {
    admin.isVerified = true;
    admin.otpHash = null;
    admin.otpExpiresAt = null;
    changed = true;
  }

  // Keep the default admin password synchronized with .env
  const samePassword = await bcrypt.compare(password, admin.password);
  if (!samePassword) {
    admin.password = await bcrypt.hash(password, 10);
    changed = true;
  }

  if (admin.name !== name) {
    admin.name = name;
    changed = true;
  }

  if (changed) {
    await admin.save();
  }
};

// Start server after MongoDB connection
const startServer = async () => {
  try {
    await connectDB();
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log("MongoDB connected successfully");
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();