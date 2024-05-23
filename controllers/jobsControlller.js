const Joi = require("joi");
exports.postJob = async (req, res) => {
    try {
        console.debug("============================ POST JOB =============================")
        const {
            title,
            description,
            salary,
            location,
            qualification,
            jobCategory,
            jobType,
            experience,
            company
        } = req.body;

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
        console.debug("============================ LIST JOBS =============================")
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


exports.onJobSwipe = async (req, res) => {
    try {
        console.debug("============================ SWIPE  JOB =============================")
        const request = {
            jobId : req.body.jobId,
            swipe : req.body.swipe,
            userId : req.payload.id
        }

        const schema = Joi.object({
            jobId: Joi.string().required(),
            swipe: Joi.string().required().valid("left", "right"),
            userId: Joi.string().required(),
        });

        const {error} = schema.validate(request);

        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }


        const user = await User.findOne({
            _id: request.userId
        });

        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
            });
        }

        switch (request.swipe) {
            case "left":
                SwipeService.onJobSwipeLeft(user, request.jobId);
                break;
            case "right":
                SwipeService.onJobSwipeRight(user, request.jobId);
                break;
            default:
                console.log("Invalid swipe");
        }


        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Job swiped successfully",
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_SWIPE_LEFT_JOB);
    }
};


exports.onEmployerSwipe = async (req, res) => {
    try {
        console.debug("============================ SWIPE EMPLOYER =============================")
        const request = {
            userId: req.body.userId,
            swipe: req.body.swipe,
            employerId: req.payload.id,
        }

        const schema = Joi.object({
            userId: Joi.string().required(),
            swipe: Joi.string().required().valid("left", "right"),
            employerId: Joi.string().required(),
        });

        const {error} = schema.validate(request);

        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const employer = await User.findOne({
            _id: request.employerId
        });

        if (_.isEmpty(employer)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "employer not found",
            });
        }

        switch (request.swipe) {
            case "left":
                SwipeService.onEmployerSwipeLeft(employer, request.userId);
                break;
            case "right":
                SwipeService.onEmployerSwipeRight(employer, request.userId);
                break;
            default:
                console.log("Invalid swipe");
        }

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Employer swiped successfully",
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_SWIPE_LEFT_EMPLOYER);
    }

}

exports.listRecommended = async (req, res) => {
    try {
        console.debug("============================ SWIPE RIGHT JOB =============================")
        const {
            skip = 0,
            limit = 10,
            location = "",
            jobCategory ="",
            jobType = "",
            experience="",
            qualification=""
        } = req.body;

        const userId = req.payload.id;

        console.log("REQUEST: ", req.body);
        const request = {
            ...req.body,
            userId
        }

        const schema = Joi.object({
            skip: Joi.number().allow(0),
            limit: Joi.number().allow(0),
            location: Joi.string().allow(""),
            jobCategory: Joi.string().allow(""),
            jobType: Joi.string().allow(""),
            experience: Joi.string().allow(""),
            qualification: Joi.string().allow(""),
            userId: Joi.string().required(),
        });

        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const user = await User.findOne({
            _id: userId,
            isOnboarded: true
        }).select("-password");

        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
            });
        }

        const swipedLeftJobs = user.swipedJobs.left;
        const swipedRightJobs = user.swipedJobs.right;

        let query = {
            _id: {$nin: [...swipedLeftJobs, ...swipedRightJobs]},
            isOnboarded: true
        };

        if (location) query.location = location;
        if (jobCategory) query.jobCategory = jobCategory;
        if (jobType) query.jobType = jobType;
        if (experience) query.experience = experience;
        if (qualification) query.qualification = qualification;

        // Query jobs with pagination and filtering
        const jobs = await Jobs.find(query)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .exec();

        const totalJobs = await Jobs.countDocuments(query).exec();

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Recommended jobs fetched successfully",
            data: {
                jobs,
                totalJobs
            }
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_SWIPE_RIGHT_JOB);
    }
}


exports.listRecommendedUsersForEmployer = async (req, res) => {
    try {
        console.debug("============================ RECOMMENDED USERS FOR EMPLOYER =============================")
        const {
            skip = 0,
            limit = 10,
            location = "",
            jobCategory = "",
            jobType = "",
            experience = "",
            qualification = ""
        } = req.body;

        const userId = req.payload.id;

        console.log("REQUEST: ", req.body);
        const request = {
            ...req.body,
            userId
        }


        const schema = Joi.object({
            skip: Joi.number().allow(0),
            limit: Joi.number().allow(0),
            location: Joi.string().allow(""),
            jobCategory: Joi.string().allow(""),
            jobType: Joi.string().allow(""),
            experience: Joi.string().allow(""),
            qualification: Joi.string().allow(""),
            userId: Joi.string().required(),
        });

        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const user = await User.findOne({
            _id: userId

        }).select("-password");

        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
            });
        }

        const swipedLeftUsers = user.swipedUsers.left;
        const swipedRightUsers = user.swipedUsers.right;


        let query = {
            _id: {$nin: [...swipedLeftUsers, ...swipedRightUsers]},
            isOnboarded: true
        };

        if (location) query.location = location;
        if (jobCategory) query.jobCategory = jobCategory;

        // Query users with pagination and filtering
        const users = await User.find(query)
            .select("-password -swipedJobs -swipedUsers")
            .skip(parseInt(request.skip))
            .limit(parseInt(request.limit))
            .exec();

        const totalUsers = await User.countDocuments(query).exec();

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Recommended users fetched successfully",
            data: {
                users,
                totalUsers
            }
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_RECOMMENDED_USERS);
    }
}

