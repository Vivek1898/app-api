const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is required!",
    },
    description: {
        type: String,
        required: "Description is required!",
    },
    location: {
        type: String,
        required: "Location is required!",
    },
    salary: {
        type: Number,
        required: "Salary is required!",
    },
    company: {
        type: String,
        ref: "Company",
    },
    jobCategory: {
        type: String,
        required: "Job Category is required!",
    },
    jobType: {
        type: String,
        required: "Job Type is required!",
    },
    experience: {
        type: String,
        required: "Experience is required!",
    },
    qualification: {
        type: String,
        required: "Qualification is required!",
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

});

module.exports = mongoose.model("Job", jobSchema);