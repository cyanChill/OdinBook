const { readToken } = require("./jwt");

/* 
  ***********************************************************
                      For "/users" Routes
  ***********************************************************
*/
// Checks if userId of accessor of route is equal to :userId of route
exports.isProfileOwner = [
  // Set req.userId to "id" value found in JWT token
  readToken,
  async (req, res, next) => {
    if (req.userId === req.params.userId) return next();
    // User isn't owner of profile
    return res.status(403).json({
      message: "User cannot modify profile of a different user.",
    });
  },
];
