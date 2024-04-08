
const Joi = require("joi");
exports.postJob = async (req, res) => {
    try {
        console.debug("============================ POST JOB =============================")
        const {title, description, salary, location, qualification, jobCategory, jobType, experience , company} = req.body;

        console.log("REQUEST: ", req.body);

        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            salary: Joi.string().required(),
            location: Joi.string().required(),
            qualification: Joi.string().required(),
            jobCategory: Joi.string().required(),
            jobType: Joi.string().required(),
            experience: Joi.string().required(),
            company: Joi.string().allow(""),
        });
        const {error} = schema.validate(req.body);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const job = new Jobs({
            title,
            description,
            salary,
            location,
            qualification,
            jobCategory,
            jobType,
            experience,
            company,
            postedBy: req.payload.id,
        });
        await job.save();
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Job posted successfully",
        });
    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_POSTING_JOB);
    }
}

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Jobs.find();
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Jobs fetched successfully",
            data: jobs
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_LIST_JOBS);
    }
}

exports.updateJob = async (req, res) => {
    try {
        console.debug("============================ UPDATE JOB =============================")
        const {title, description, salary, location, id: jobId} = req.body;
        console.log("REQUEST: ", req.body);
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            salary: Joi.string().required(),
            location: Joi.string().required(),
            id: Joi.string().required(),
        });

        const {error} = schema.validate(req.body);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }
        const job = await Jobs.findOne({
            _id: jobId
        });

        if (_.isEmpty(job)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "Job not found",
            });
        }

        job.title = title;
        job.description = description;
        job.salary = salary;
        job.location = location;
        await job.save();
        res.status(200).json({
            message: "Job updated successfully",
        });


    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_UPDATE_JOB);
    }
}

exports.deleteJob = async (req, res) => {
    try {
        console.debug("============================ DELETE JOB =============================")
        const jobId = req.params.id;
        console.log("REQUEST: ", req.params);
        const job = await Jobs.findOne({
            _id: jobId
        });
        if (_.isEmpty(job)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "Job not found",
            });
        }
        await job.remove();
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Job deleted successfully",
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_DELETE_JOB);
    }
}

exports.getJobDetails = async (req, res) => {
    try {
        console.debug("============================ GET JOB DETAILS =============================")
        const jobId = req.params.id;
        console.log("REQUEST: ", req.params);
        const job = await Jobs.findOne({
            _id: jobId
        });
        if (_.isEmpty(job)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "Job not found",
            });
        }
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Job details fetched successfully",
            data: job
        });
    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_JOB_DETAILS);
    }
}


exports.listJobsForUser = async (req, res) => {
    try {
        console.debug("============================ LIST JOBS FOR USER =============================")
        const userId = req.payload.id;
        const jobs = await Jobs.find({
            postedBy: userId
        });
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Jobs fetched successfully",
            data: jobs
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_LIST_JOBS_FOR_USER);
    }
}




