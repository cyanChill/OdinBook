const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const CommentSchema = Schema({
  post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  comment: { type: String, required: true },
  timestamp: { type: Date, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

CommentSchema.virtual("formatted_time").get(function () {
  return format(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});

module.exports = mongoose.model("Comment", CommentSchema);
