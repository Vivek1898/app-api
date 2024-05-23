const sha256 = require("js-sha256");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
    let {name, email, password, role} = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
    if (password.length < 6) throw "Password must be atleast 6 characters long.";
    // role can be user or employer
    const validRoles = ["user", "employer"]

    if (!validRoles.includes(role)) throw "Invalid role";

    const userExists = await User.findOne({
        email,
    });

    if (userExists) throw "User with same email already exits.";


    const user = new User({
        name,
        email: email.toString().toLowerCase(),
        password: sha256(password + process.env.SALT),
        role: role || "user"
    });

    await user.save();

    res.status(200).json({
        message: "User [" + name + "] registered successfully!",
    });
};

exports.login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({
        email,
        password: sha256(password + process.env.SALT),

    });

    if (!user) throw "Email and Password did not match.";

    if(!user.isOnboarded) throw "User not onboarded";

    const token = await jwt.sign({
        id: user.id,
        role: user.role,
        email: user.email,
    }, process.env.SECRET);
    user.password = undefined;

    res.status(200).json({
        message: "User logged in successfully!",
        token,
        role: user.role,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        id: user.id
    });
};

exports.Onboard = async (req, res) => {
    try {
        const {location, bio, profilePicture, jobProfile, education, experience, jobCategory ,userId} = req.body;
        // const userId = req.payload.id;

        const schema = Joi.object({
            location: Joi.string().required(),
            bio: Joi.string().required(),
            profilePicture: Joi.string().required(),
            jobProfile: Joi.string().required(),
            education: Joi.string().required(),
            experience: Joi.string().required(),
            jobCategory: Joi.string().required(),
            userId: Joi.string().required(),
        });

        const {error} = schema.validate(req.body);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        let user = await User.findOne({
            _id: userId
        }).select('name email location bio profilePicture jobProfile education experience jobCategory isOnboarded role')
        ;

        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
            });
        }

        if(user.isOnboarded) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User already onboarded",
            });
        }


        user.location = location;
        user.bio = bio;
        user.profilePicture = profilePicture;
        user.jobProfile = jobProfile;
        user.education = education;
        user.experience = experience;
        user.jobCategory = jobCategory;
        user.isOnboarded = true;


        await user.save();
        user.password = undefined;

        // Generate access token
        const token = await jwt.sign({
            id: user.id,
            role: user.role,
            email: user.email,
        }, process.env.SECRET);

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "User onboarded successfully",
            data: {
                user:user,
                token: token
            }
        });

    } catch (e) {
        console.log(e);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_ONBOARDING);

    }
}

exports.accessTokenLoginUser = async (req, res) => {
    try {
        console.debug("============================ ACCESS TOKEN LOGIN USER =============================")
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

        const user = await User.findOne({
            _id: request.userId
        }).select('name email location bio profilePicture jobProfile education experience jobCategory isOnboarded role');

        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
            });
        }

        // if user is not onboarded

        if (!user.isOnboarded) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not onboarded",
            });
        }

        user.password = undefined;

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "User fetched successfully",
            data: user
        });


    } catch (e) {
        console.log(e);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_ONBOARDING);

    }

}


exports.getUsersForEmployer = async (req, res) => {
    try {
        console.debug("============================ LIST USERS FOR EMPLOYER =============================")
        const users = await User.find({
            role: "user",
            isOnboarded: true
        }).select('name email location bio profilePicture jobProfile education experience jobCategory');
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "Users fetched successfully",
            data: users
        });

    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_LIST_USERS_FOR_EMPLOYER);
    }
};

exports.getUsersDetails = async (req, res) => {
    try {
        console.debug("============================ GET USER DETAILS =============================")
        const userId = req.body.userId;
        console.log("REQUEST: ", req.body);
        const schema = Joi.object({
            userId: Joi.string().required(),
        });

        const {error} = schema.validate(req.body);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }
            const user = await User.findOne({
                _id: userId,
                isOnboarded: true
            }).select('name email location bio profilePicture jobProfile education experience jobCategory');


        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
            });
        }
        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "User details fetched successfully",
            data: user
        });
    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_USER_DETAILS);
    }

}

exports.isUserOnboarded = async (req, res) => {
    try {
        console.debug("============================ IS USER ONBOARDED =============================")
        const email = req.body.email;
        console.log("REQUEST: ", req.body);
        const schema = Joi.object({
            email: Joi.string().required(),
        });

        const {error} = schema.validate(req.body);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }
        const user = await User.findOne({
            email: email.toString().toLowerCase()
        });

        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
            });
        }


        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "User details fetched successfully",
            data: {
                userId:user._id,
                isOnboarded: user.isOnboarded,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_USER_DETAILS);
    }
}

