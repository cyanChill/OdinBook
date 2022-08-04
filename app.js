require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./lib/mongoConfig");
const app = express();
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === "development";

const indexRouter = require("./routes/index");

// Set Up Cors
const ALLOW_ORIGINS_LIST = [];
const corsOptions = {
  // Ignore Cors in development but restrict to URL in production
  origin: isDevelopment ? true : ALLOW_ORIGINS_LIST,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", indexRouter);

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
