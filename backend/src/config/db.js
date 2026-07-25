const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const DEFAULT_ATLAS_URL = "mongodb+srv://ruchitaugalmugle70_db_user:1YqIjw9oIHuThVjV@cluster0.022gsma.mongodb.net/fitness_platform?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        const mongoUrl = (process.env.MONGO_URL && !process.env.MONGO_URL.includes("127.0.0.1")) 
            ? process.env.MONGO_URL 
            : DEFAULT_ATLAS_URL;

        const conn = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedDatabase();
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    }
};
module.exports = connectDB;
