const mongoose = require("mongoose");
// const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
    const {name, email, password, role} = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
    if (password.length < 6) throw "Password must be atleast 6 characters long.";

    const userExists = await User.findOne({
        email,
    });

    if (userExists) throw "User with same email already exits.";

    const user = new User({
        name,
        email,
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

    const token = await jwt.sign({id: user.id}, process.env.SECRET);
    user.password = undefined;

    res.status(200).json({
        message: "User logged in successfully!",
        token,
        role: user.role,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
    });
};

exports.Onboard = async (req, res) => {
    try {
        const {location, bio, profilePicture, jobProfile, education, experience, jobCategory} = req.body;
        const userId = req.payload.id;

        const schema = Joi.object({
            location: Joi.string().required(),
            bio: Joi.string().required(),
            profilePicture: Joi.string().required(),
            jobProfile: Joi.string().required(),
            education: Joi.string().required(),
            experience: Joi.string().required(),
            jobCategory: Joi.string().required(),
        });

        const {error} = schema.validate(req.body);
        if (error) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: error.message,
            });
        }

        const user = await User.findOne({
            _id: userId
        });

        if (_.isEmpty(user)) {
            return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
                message: "User not found",
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

        return ResponseService.jsonResponse(res, ConstantService.responseCode.SUCCESS, {
            message: "User onboarded successfully",
            data: user
        });

    } catch (e) {
        console.log(e);
        return ResponseService.json(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, ConstantService.responseMessage.ERR_OOPS_SOMETHING_WENT_WRONG_IN_ONBOARDING);

    }
}
