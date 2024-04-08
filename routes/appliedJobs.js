const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");

const appliedJobsController = require("../controllers/appliedJobsController");

const auth = require("../middlewares/auth");


router.post("/list", auth, catchErrors(appliedJobsController.listAppliedJobs));
router.post("/apply", auth, catchErrors(appliedJobsController.applyJob));
router.put("/update-status", auth, catchErrors(appliedJobsController.updateJobStatus));
router.get("/details/:id", auth, catchErrors(appliedJobsController.getAppliedJobDetails));
router.post("/list-employer", auth, catchErrors(appliedJobsController.listAppliedJobsForPostedJob));



module.exports = router;
