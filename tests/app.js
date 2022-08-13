require("dotenv").config();
const express = require("express");

require("../utils/firebaseAdminConfig");
require("../utils/mongoConfigTest");
const app = express();
const PORT = process.env.PORT || 3000;
require("../utils/passportConfig");

const indexRouter = require("../routes/index");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", indexRouter);

module.exports = app;
