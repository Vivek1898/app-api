const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
        resume: {
            type: Object,
            required: "Resume is required!",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Resume", resumeSchema);
