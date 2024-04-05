/*
* ConstantService js to store all constant values for this app
 */
module.exports = {
    responseCode: {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        INTERNAL_SERVER_ERROR: 500,
        FORBIDDEN: 403,
    },

    responseMessage: {
        //Applied Jobs
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_LISTING: "Oops! Something went wrong in applied jobs listing",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_APPLYING: "Oops! Something went wrong in applied jobs applying",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_UPDATE_STATUS: "Oops! Something went wrong in applied jobs update status",

        //Jobs
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_POSTING_JOB: "Oops! Something went wrong in posting job",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_LIST_JOBS: "Oops! Something went wrong in listing jobs",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_UPDATE_JOB: "Oops! Something went wrong in updating job",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_DELETE_JOB: "Oops! Something went wrong in deleting job",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_JOB_DETAILS: "Oops! Something went wrong in fetching job details",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_APPLIED_JOBS_DETAILS: "Oops! Something went wrong in fetching applied job details",

        ERR_OOPS_SOMETHING_WENT_WRONG_IN_CREATING_CHATROOM: "Oops! Something went wrong in creating chatroom",
        ERR_OOPS_SOMETHING_WENT_WRONG_IN_ONBOARDING: "Oops! Something went wrong in onboarding",
    },
};
