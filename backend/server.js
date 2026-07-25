const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

// Load environment variables
dotenv.config();

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const workoutRoutes = require("./src/routes/workoutRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const exerciseRoutes = require("./src/routes/exerciseRoutes");

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

// Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await connectDB();
});