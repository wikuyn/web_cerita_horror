const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    default: "",
  },
  instagramUrl: {
    type: String,
    default: "",
  },
  twitterUrl: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "Anonymous",
  },
  commentId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Pengguna", usersSchema);
