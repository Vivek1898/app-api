const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");

const appliedJobsController = require("../controllers/appliedJobsController");

const auth = require("../middlewares/auth");
const {isUser , isEmployer} = require("../middlewares/roles");


router.post("/list", auth, catchErrors(appliedJobsController.listAppliedJobs));
router.post("/employer/list/user", auth,isUser, catchErrors(appliedJobsController.listInvitedJobsForUserByEmployer));
router.post("/apply", auth,isUser, catchErrors(appliedJobsController.applyJob));
router.post("/employer/apply/user", auth,isEmployer, catchErrors(appliedJobsController.applyJobForUserByEmployer));
router.put("/update-status", auth,isEmployer, catchErrors(appliedJobsController.updateJobStatus));
router.get("/details/:id", auth, catchErrors(appliedJobsController.getAppliedJobDetails));
router.post("/list-employer", auth, catchErrors(appliedJobsController.listAppliedJobsForPostedJob));
router.post("/list/applicants", auth, catchErrors(appliedJobsController.listAllApplicantsForJob));




module.exports = router;
