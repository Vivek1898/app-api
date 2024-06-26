const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(chatroomController.getAllChatrooms));
router.post("/", auth, catchErrors(chatroomController.createChatroom));
router.post("/create", auth, catchErrors(chatroomController.createRoomForTwoUsers));
router.post("/details", auth, catchErrors(chatroomController.getChatRoomDetails));


module.exports = router;
