const jwt = require("jsonwebtoken");

exports.issueToken = (user) => {
  const opts = { expiresIn: "1d" };
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, opts);
  return token;
};

// FORMAT OF TOKEN:
// Authorization: bearer <access_token>

// Middleware to read JWT Token data (given auth header exists & is valid)
exports.readToken = (req, res, next) => {
  // Get auth bearer token value
  const bearerToken = req.headers["authorization"].split(" ")[1];
  jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    if (authData) {
      req.userId = authData.id;
      next();
    }
  });
};
