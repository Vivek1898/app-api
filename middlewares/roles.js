
module.exports = {
    isAdmin: (req, res, next) => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(401).send({
                message: "You are not authorized to access this route"
            });
        }
    },
    isEmployer: (req, res, next) => {
        if (req.payload.role === 'employer') {
            next();
        } else {
            res.status(401).send({
                message: "You are not authorized to access this route"
            });
        }
    },
    isUser: (req, res, next) => {
        if (req.payload.role === 'user') {
            next();
        } else {
            res.status(401).send({
                message: "You are not authorized to access this route"
            });
        }
    }
}