const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const meetController = require("../controllers/meetController");

const auth = require("../middlewares/auth");

router.post("/create", auth, catchErrors(meetController.createGoogleMeet));

module.exports = router;