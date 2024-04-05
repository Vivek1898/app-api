const router = require("express").Router();
const {catchErrors} = require("../handlers/errorHandlers");

const jobController = require("../controllers/jobsControlller")

const auth = require("../middlewares/auth");

router.post("/list", auth, catchErrors(jobController.getJobs));

router.post("/create", auth, catchErrors(jobController.postJob));

router.put("/update", auth, catchErrors(jobController.updateJob));

router.get("/details/:id", auth, catchErrors(jobController.getJobDetails))

router.post("/delete", auth, catchErrors(jobController.deleteJob));

module.exports = router;









