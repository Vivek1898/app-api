

exports.listAppliedJobs = async (req, res) => {
    try {
        console.debug("============  LIST APPLIED JOBS ============");

        const request = {
            userId: req.payload.id,
            skip: req.body.skip || 0,
            limit: req.body.limit || 10
        };
        const schema = Joi.object({
            userId: Joi.string().required(),
            skip: Joi.number().optional(),
            limit: Joi.number().optional()
        });
        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const appliedJobs = await AppliedJobs.find({
            user: request.userId,
            appliedByRole: {$ne: "employer"}
        })
            .populate("job")
            .populate({
                path: 'user',
                select: '-password -swipedJobs -swipedUsers'
            })
            .skip(request.skip)
            .limit(request.limit);

        if (_.isEmpty(appliedJobs)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "No applied jobs found",
            });
        }
        const count = await AppliedJobs.countDocuments({
            user: request.userId,
            appliedByRole: {$ne: "employer"}
        })

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Applied jobs fetched successfully",
            data: {
                count,
                appliedJobs
            }
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_LISTING);
    }
}

exports.applyJob = async (req, res) => {
    try {
        console.debug("============  APPLY JOB ============");
        const request = {
            jobId: req.body.jobId,
            userId: req.payload.id
        };
        console.log("REQUEST: ", request)
        const schema = Joi.object({
            jobId: Joi.string().required(),
            userId: Joi.string().required(),
        });

        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }
        // Check if job exists
        const job = await Jobs.findOne({
            _id: request.jobId
        });

        if (_.isEmpty(job)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "Job not found",
            });
        }
        const filter = {
            job: request.jobId,
            user: request.userId
        };

        const update = {
            job: request.jobId,
            user: request.userId,
            postedBy: request.postedBy,

        };

        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };

         await AppliedJobs.findOneAndUpdate(filter, update, options);


        // const appliedJob = new AppliedJobs({
        //     job: request.jobId,
        //     user: request.userId,
        //     postedBy: job.postedBy,
        //
        // });
        // await appliedJob.save();

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Job applied successfully",
        });

    } catch (e) {
        console.error(e);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_APPLYING);

    }
}

exports.updateJobStatus = async (req, res) => {
    try {

        const {appliedJobId, status} = req.body;
        console.log("REQUEST: ", req.body);
        const schema = Joi.object({
            appliedJobId: Joi.string().required(),
            status: Joi.string().required(),
        });

        const {error} = schema.validate(req.body);

        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const appliedJob = await AppliedJobs.findById(appliedJobId);

        if (_.isEmpty(appliedJob)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "Job or User Not found",
            });
        }

        appliedJob.status = status;
        await appliedJob.save();
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Job status updated successfully",
        });

    } catch (e) {
        console.error(e);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_UPDATE_STATUS);
    }
}

exports.getAppliedJobDetails = async (req, res) => {
    try {
        console.debug("============  APPLIED JOB DETAILS ============");
        const appliedJobId = req.params.id;
        console.log("REQUEST: ", req.params);
        const appliedJob = await AppliedJobs.findOne({
            _id: appliedJobId
        }).populate("job") .populate({
            path: 'user',
            select: '-password -swipedJobs -swipedUsers'
        });

        if (_.isEmpty(appliedJob)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "Applied job not found",
            });
        }
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Applied job fetched successfully",
            data: appliedJob
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_DETAILS);
    }
}


exports.listAppliedJobsForPostedJob = async (req, res) => {
    try {
        console.debug("============  LIST APPLIED JOBS FOR POSTED JOB ============");
      const request = {
            postedBy: req.body.postedBy
        };
        console.log("REQUEST: ", request);
        const schema = Joi.object({
            postedBy: Joi.string().required(),
        });
        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const appliedJobs = await AppliedJobs.find({
            postedBy: request.postedBy,
        })
            .populate("job")
            .populate({
                path: 'user',
                select: '-password -swipedJobs -swipedUsers'
            });


        if (_.isEmpty(appliedJobs)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "No applied jobs found",
            });
        }

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Applied jobs fetched successfully",
            data: appliedJobs
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_LIST_JOBS_FOR_USER);
    }

}

exports.listAllApplicantsForJob = async (req, res) => {
    try {
        console.debug("============  LIST ALL APPLICANTS FOR JOB ============");
        const request = {
            jobId: req.body.jobId
        };
        console.log("REQUEST: ", request);
        const schema = Joi.object({
            jobId: Joi.string().required(),
        });
        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const appliedJobs = await AppliedJobs.find({
            job: request.jobId,
        })
            .populate("job")
            .populate({
                path: 'user',
                select: '-password -swipedJobs -swipedUsers'
            });

        if (_.isEmpty(appliedJobs)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "No Applicants found for this job",
            });
        }

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Applicants fetched successfully",
            data: appliedJobs
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_LIST_JOBS_FOR_USER);
    }
}


exports.applyJobForUserByEmployer = async (req, res) => {
    try {
        console.debug("============  APPLY JOB FOR USER BY EMPLOYER ============");
        const request = {
            jobId: req.body.jobId,
            userId: req.body.userId,
            postedBy: req.payload.id
        };
        console.log("REQUEST: ", request)
        const schema = Joi.object({
            jobId: Joi.string().required(),
            userId: Joi.string().required(),
            postedBy: Joi.string().required(),
        });

        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }
        // Check if job exists
        const job = await Jobs.findOne({
            _id: request.jobId
        });

        if (_.isEmpty(job)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "Job not found",
            });
        }

        const filter = {
            job: request.jobId,
            user: request.userId
        };

        const update = {
            job: request.jobId,
            user: request.userId,
            postedBy: request.postedBy,
            appliedByRole: "employer"
        };

        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };

        const appliedJob = await AppliedJobs.findOneAndUpdate(filter, update, options);

        // Add this job to swiped jobs of user
        const user = await User.findById(request.userId);
        if(!user.swipedJobs.right.includes(request.jobId)){
            user.swipedJobs.right.push(request.jobId);
            await user.save();
        }

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Job applied successfully",
        });

    } catch (e) {
        console.error(e);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_APPLYING);

    }
}

exports.listInvitedJobsForUserByEmployer = async (req, res) => {
    try {
        console.debug("============  LIST INVITED JOBS FOR USER BY EMPLOYER ============");
        const request = {
            userId: req.payload.id,
            skip: req.body.skip || 0,
            limit: req.body.limit || 10
        };
        console.log("REQUEST: ", request);
        const schema = Joi.object({
            userId: Joi.string().required(),
            skip: Joi.number().optional(),
            limit: Joi.number().optional()
        });
        const {error} = schema.validate(request);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const appliedJobs = await AppliedJobs.find({
            user: request.userId,
            appliedByRole: {$ne: "user"}

        })
            .populate("job")
            .populate({
                path: 'user',
                select: '-password -swipedJobs -swipedUsers'
            })
            .skip(request.skip)
            .limit(request.limit);


        if (_.isEmpty(appliedJobs)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "No applied jobs found",
            });
        }
        const count = await AppliedJobs.countDocuments({
            user: request.userId,
            appliedByRole: {$ne: "user"}
        })




        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Applied jobs fetched successfully",
            data: {
                count,
                appliedJobs
            }
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_LIST_JOBS_FOR_USER);
    }
}


