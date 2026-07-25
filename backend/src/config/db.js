const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const DEFAULT_ATLAS_URL = "mongodb+srv://ruchitaugalmugle70_db_user:GymPass2026@cluster0.022gsma.mongodb.net/fitness_platform?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        mongoose.set("bufferCommands", false);

        const mongoUrl = (process.env.MONGO_URL && process.env.MONGO_URL.startsWith("mongodb+srv://")) 
            ? process.env.MONGO_URL 
            : DEFAULT_ATLAS_URL;

        console.log("Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        await seedDatabase();
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    }
};
module.exports = connectDB;
