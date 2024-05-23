const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const meetController = require("../controllers/meetController");

const auth = require("../middlewares/auth");
const {isEmployer} = require("../middlewares/roles");

router.post("/create", auth,isEmployer, catchErrors(meetController.createGoogleMeet));

module.exports = router;