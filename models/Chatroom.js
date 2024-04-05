const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
  userOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
    userTwo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
