const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Name is required!",
        },
        email: {
            type: String,
            required: "Email is required!",
        },
        password: {
            type: String,
            required: "Password is required!",
        },
        role: {
            type: String,
            default: "user",
        },
        location: {
            type: String,
        },
        bio: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        jobProfile: {
            type: String,
        },
        education: {
            type: String,
        },
        experience: {
            type: String,
        },
        jobCategory: {
            type: String,
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
