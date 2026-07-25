const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: false   // Google OAuth users won't have a password
        },

        googleId: {
            type: String,
            required: false,
            unique: true,
            sparse: true      // allows multiple docs with no googleId (null/undefined)
        },

        role: {
            type: String,
            enum: ["member", "trainer", "admin"],
            default: "member"
        },

        age: Number,
        gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
        height: Number,        // in cm
        weight: Number,        // in kg
        goalWeight: Number,    // target weight in kg
        fitnessGoal: {
            type: String,
            enum: ["lose_weight", "build_muscle", "maintain", "improve_endurance", ""],
            default: ""
        },
        avatarColor: {
            type: String,
            default: "#a855f7"  // default purple
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);