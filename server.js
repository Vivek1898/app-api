require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected!");
});

//Bring in the models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");

const app = require("./app");
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log("Server listening on port 8000");
});

const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const jwt = require("jwt-then");

// const Message = mongoose.model("Message");
// const User = mongoose.model("User");

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (err) {
    }
});

io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);

    socket.on("disconnect", () => {
        // console.log("Disconnected: " + socket.LOuserId);
    });

    socket.on("joinRoom", async ({chatroomId}) => {
        socket.join(chatroomId);

        // console.log("A user joined chatroom: " + chatroomId);
        // const messages = await Message.find({ chatroom: chatroomId })
        //     .populate("user")
        //     .sort({
        //   createdAt: "asc",
        // });
        // socket.emit("history", messages);
        // console.log("messages", messages);

    });

    socket.on("chatRoomHistory", async ({chatroomId}) => {
        // console.log("chatroomId", chatroomId)
        const messages = await Message.find({chatroom: chatroomId})
            .populate("user")
            .sort({
                createdAt: "asc",
            });
        const result = messages.map((message) => {
            return {
                message: message.message,
                name: message.user.name,
                userId: message.user._id
            }
        });
        // console.log("result", result);
        socket.emit("history", result);

    });

    socket.on("leaveRoom", ({chatroomId}) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);
    });

    socket.on("chatroomMessage", async ({chatroomId, message}) => {
        if (message.trim().length > 0) {
            const user = await User.findOne({_id: socket.userId});
            const newMessage = new Message({
                chatroom: chatroomId,
                user: socket.userId,
                message,
            });
            io.to(chatroomId).emit("newMessage", {
                message,
                name: user.name,
                userId: socket.userId,
            });
            await newMessage.save();
        }
    });
});
