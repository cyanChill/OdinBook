const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Preload Models
require("../models/Comment");
require("../models/Post");
require("../models/User");
