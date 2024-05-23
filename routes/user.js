const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const {isEmployer} = require("../middlewares/roles");

router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));
router.put("/onboard",auth, catchErrors(userController.Onboard));
router.post("/onboard/verify", catchErrors(userController.isUserOnboarded));
router.get("/accessTokenLogin",auth, catchErrors(userController.accessTokenLoginUser));
router.post("/employer/list",auth, isEmployer, catchErrors(userController.getUsersForEmployer));
router.post("/details",auth, catchErrors(userController.getUsersDetails));


module.exports = router;
