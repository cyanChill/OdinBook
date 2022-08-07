const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../models/User");

exports.issueToken = (user) => {
  const opts = { expiresIn: "1d" };
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, opts);
  return token;
};

// FORMAT OF TOKEN:
// Authorization: bearer <access_token>

// Middleware to read JWT token data (we know the "authorization" header
// exists and is valid from the passport check)
exports.readToken = [
  passport.authenticate("jwt", { session: false }),

  async (req, res, next) => {
    // Get auth bearer token value
    const bearerToken = req.headers["authorization"].split(" ")[1];
    try {
      const authData = jwt.verify(bearerToken, process.env.SECRET_KEY);
      if (!authData)
        return res.status(403).json({ message: "Unknown payload." });
      // Validate Id in Token:
      const user = await User.findById(authData.id);
      if (!user) throw new Error("Invalid token."); // Goto catch block
      req.userId = authData.id;
      return next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
  },
];
