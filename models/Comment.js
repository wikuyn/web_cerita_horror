const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  komentar: {
    type: String,
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  pengguna: {
    penggunaId: String,
    profileUrl: String,
    username: String,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
