const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");

router.get("/", async (req, res, next) => {
  return res.status(200).json({ message: "Successfully pinged api." });
});

router.use("/auth", authRoutes);

module.exports = router;
