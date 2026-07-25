const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const MONGO_ATLAS_URL = "mongodb+srv://ruchitaugalmugle70_db_user:GymPass2026@cluster0.022gsma.mongodb.net/fitness_platform?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(MONGO_ATLAS_URL, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        await seedDatabase();
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        throw error;
    }
};

module.exports = connectDB;
