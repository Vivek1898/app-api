const router = require("express").Router();
const {catchErrors} = require("../handlers/errorHandlers");

const jobController = require("../controllers/jobsControlller")

const auth = require("../middlewares/auth");
const {isUser, isEmployer} = require("../middlewares/roles");

router.post("/list", auth, catchErrors(jobController.getJobs));

router.post("/create", auth, isEmployer, catchErrors(jobController.postJob));

router.put("/update", auth, isEmployer, catchErrors(jobController.updateJob));

router.get("/details/:id", auth, catchErrors(jobController.getJobDetails))

router.post("/delete", auth, isEmployer, catchErrors(jobController.deleteJob));

router.post("/list-user", auth, isUser, catchErrors(jobController.listJobsForUser));

router.post("/swipe", auth, isUser, catchErrors(jobController.onJobSwipe));

router.post("/list/recommended", auth, isUser, catchErrors(jobController.listRecommended));

router.post("/list/recommended/employer", auth, catchErrors(jobController.listRecommendedUsersForEmployer));

router.post("/swipe/employer", auth, catchErrors(jobController.onEmployerSwipe));


module.exports = router;









