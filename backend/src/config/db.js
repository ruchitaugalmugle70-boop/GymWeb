const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error("⚠️ MONGO_URL environment variable is missing!");
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedDatabase();
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    }
};
module.exports = connectDB;
