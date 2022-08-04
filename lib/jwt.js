const jwt = require("jsonwebtoken");

exports.issueToken = (user) => {
  const opts = { expiresIn: "1d" };
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, opts);
  return token;
};
