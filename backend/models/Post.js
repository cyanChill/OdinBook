const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const PostSchema = Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  imgUrl: { type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

PostSchema.virtual("formatted_time").get(function () {
  return format(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});

module.exports = mongoose.model("Post", PostSchema);
