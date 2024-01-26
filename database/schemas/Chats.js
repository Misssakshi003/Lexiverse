const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  name: {
    types: mongoose.SchemaTypes.String,
  },
  num: {
    type: mongoose.SchemaTypes.Number,
  },
  message: {
    type: mongoose.SchemaTypes.String,
  },
});
const ChatSchema = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
  chats: {
    id: {
      type: mongoose.SchemaTypes.Number,
    },
    messages: messagesSchema,
  },
});

module.exports = mongoose.model("users", ChatSchema);
