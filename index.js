const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const userRouter = require('./routes/UserRouter');


const app = express();


// allow all origins
app.use(cors({origin: '*'}));
app.use(morgan('tiny'));
// Increase size limit for URL encoded data
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '15mb'
}));

// Increase size limit for JSON data
app.use(bodyParser.json({
    limit: '15mb'
}));

//Limit and Protection For DDOS Attack
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000000,
        },
        abortOnLimit: true,
    }),
);
app.use(bodyParser.json());

app.use('/user', userRouter);


const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});

