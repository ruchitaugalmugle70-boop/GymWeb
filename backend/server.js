const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Prompt for admin credentials if not set in env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
// Credentials are now sourced from .env; no interactive prompt needed.
// Ensure that ADMIN_EMAIL and ADMIN_PASSWORD are set for admin access.


// Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await connectDB();
});

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const workoutRoutes = require("./src/routes/workoutRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const exerciseRoutes = require("./src/routes/exerciseRoutes");
const seedDatabase = require("./src/config/seed");
// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.status(200).send("Fitness Platform Backend Running 🚀");
});

// API Routes (Support both /api/* and root /* paths)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/workouts", workoutRoutes);
app.use("/workouts", workoutRoutes);

app.use("/api/progress", progressRoutes);
app.use("/progress", progressRoutes);

app.use("/api/exercises", exerciseRoutes);
app.use("/exercises", exerciseRoutes);

// Handle Undefined Routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});