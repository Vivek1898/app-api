const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const ConstantService = require("./services/ConstantService");
const ResponseService = require("./services/ResponseService");
const SwipeService = require("./services/SwipeService");
const _ = require("lodash");
const Joi = require("joi");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Cross Origin
app.use(require("cors")());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Global Services
global.ResponseService = ResponseService;
global.ConstantService = ConstantService;
global.SwipeService = SwipeService;

//global Models
global.User = require("./models/User");
global.Jobs = require("./models/Jobs");
global.AppliedJobs = require("./models/AppliedJobs");
global.Chatroom = require("./models/Chatroom");
global.Message = require("./models/Message");
global.Resume = require("./models/Resume");

//global modules
global.Joi = Joi;
global._ = _;



//Bring in the routes
app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/chatroom"));
app.use("/jobs", require("./routes/jobs"));
app.use("/applied/jobs", require("./routes/appliedJobs"));
app.use("/meet", require("./routes/meet"));



//Setup Error Handlers
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
