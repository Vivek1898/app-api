exports.createChatroom = async (req, res) => {
    const {name} = req.body;
    const userId = req.payload.id;

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

    const chatroomExists = await Chatroom.findOne({name});

    if (chatroomExists) throw "Chatroom with that name already exists!";

    const chatroom = new Chatroom({
        name,
        userOne: userId,
    });

    await chatroom.save();

    res.json({
        message: "Chatroom created!",
    });
};

exports.getAllChatrooms = async (req, res) => {
    console.debug("============================= CHATROOMS :LIST ===============================")
    const request = {
        userId: req.payload.id
    }
    console.log("REQUEST: ", request)

    const schema = Joi.object({
        userId: Joi.string().required(),
    });

    const {error} = schema.validate(request);
    if (error) {
        return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
            message: error.message,
        });
    }

    const chatrooms = await Chatroom.find({
        $or: [
            {userOne: request.userId},
            {userTwo: request.userId},
        ],
    });

    return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
        message: "Chatrooms fetched successfully",
        data: chatrooms
    });
};

exports.createRoomForTwoUsers = async (req, res) => {
  try {
    const {userOne, userTwo} = req.body;
    const schema = Joi.object({
      userOne: Joi.string().required(),
      userTwo: Joi.string().required()
    });

    const {error} = schema.validate(req.body);
    if (error) {
      return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
        message: error.message,
      });
    }
    // check if userOne and userTwo are same
    if (userOne === userTwo) {
      return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
        message: "UserOne and UserTwo cannot be same",
      });
    }

    // check if both user exist in the system
    const userOneExists = await User.findOne({
      _id: userOne
    });

    const userTwoExists = await User.findOne({
      _id: userTwo
    });

    if (_.isEmpty(userOneExists) || _.isEmpty(userTwoExists)) {
      return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
        message: "UserOne or UserTwo does not exist",
      });
    }

    // slice last 6 characters from userOne and userTwo
    const name = userOne.slice(-6) + userTwo.slice(-6);
    const chatroomExists = await Chatroom.findOne({
      name
    })
    if (!_.isEmpty(chatroomExists)) {
      return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
        message: "Chatroom already exists",
      });
    }
    const chatroom = new Chatroom({
      name,
      userOne,
      userTwo
    });
    await chatroom.save();

    return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
      message: "Chatroom created successfully",
      data: chatroom
    });

  } catch (e) {
    console.error(e);
    return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_CREATING_CHATROOM);

  }


}