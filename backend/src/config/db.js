const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);

        console.log(
            `MongoDB Connected:${conn.connection.host}`
        );

        // Run seeding script
        await seedDatabase();
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }

};
module.exports = connectDB;
