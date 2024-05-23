const mongoose = require("mongoose");

const appliedJobsSchema = new mongoose.Schema({
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            default: "Pending",
        },
        appliedOn: {
            type: Date,
            default: Date.now,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        appliedByRole: {
            type: String,
            default: "user",
            required: "Role is required!",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AppliedJobs", appliedJobsSchema);


