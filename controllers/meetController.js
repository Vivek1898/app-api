const {google} = require('googleapis');
const joi = require('joi');

exports.createGoogleMeet = async (req, res) => {
    console.debug("============================ CREATE GOOGLE MEET =============================")

    const {startDateTime, endDateTime, attendeesList, summary, location, description} = req.body;
    console.log("Request Body: ", req.body);

    const schema = joi.object({
        startDateTime: joi.date().iso().required(),
        endDateTime: joi.date().iso().required(),
        attendeesList: joi.array().items(joi.string().email()).required(),
        summary: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required()
    });

    const {error} = schema.validate(req.body);

    if (error) {
        return ResponseService.jsonResponse(res, ConstantService.responseCode.BAD_REQUEST, {
            message: error.message,
        });
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    const calendar = google.calendar({version: 'v3', auth: oauth2Client});

    // Construct event object using request body data
    const event = {
        summary,
        location,
        description,
        start: {
            dateTime: startDateTime,
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'America/Los_Angeles',
        },
        attendees: attendeesList.map(email => ({email})),
        reminders: {
            useDefault: true,
        },
        conferenceData: {
            createRequest: {
                requestId: "sample123",
                conferenceSolutionKey: {
                    type: "hangoutsMeet"
                },
            },
        },
    };

    try {
        const eventResponse = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: event,
            sendUpdates: 'all',
            conferenceDataVersion: 1
        });

        const meetLink = eventResponse.data.hangoutLink;

        return ResponseService.json(res, ConstantService.responseCode.SUCCESS,
            "Meeting created successfully", {
                eventLink: eventResponse.data.htmlLink,
                meetLink: meetLink
            });

    } catch (error) {
        console.error('There was an error contacting the Calendar service: ' + error);
        return ResponseService.jsonResponse(res, ConstantService.responseCode.INTERNAL_SERVER_ERROR, {
            message: "There was an error contacting the Calendar service",

        });
    }
};
