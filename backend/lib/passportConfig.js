const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/User");
const { verifyPassword } = require("../lib/hash.js");

const IncorCredsInfo = { message: "Incorrect username or password." };

/* Validate Local Credentials */
const LocalStrategyOpts = {
  usernameField: "email",
  passwordField: "password",
};
passport.use(
  new LocalStrategy(LocalStrategyOpts, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email }, "+password");
      if (!user) return done(null, false, IncorCredsInfo);
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) return done(null, false, IncorCredsInfo);
      // Found User in Database
      return done(null, user, { message: "Logged in successfully." });
    } catch (err) {
      return done(err);
    }
  })
);

/* Validate Facebook Credentials */
const FacebookStrategyOpts = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ["id", "picture.type(large)", "email", "name"],
};
passport.use(
  new FacebookStrategy(
    FacebookStrategyOpts,
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Find user in database
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
          // Create new User
          user = await User.create({
            first_name: profile._json.first_name,
            last_name: profile._json.last_name,
            email: profile._json.email,
            profilePicUrl: profile.photos[0] ? profile.photos[0].value : "",
            facebookId: profile.id,
          });
        }
        return cb(null, user, { message: "Logged in successfully." });
      } catch (err) {
        return cb(err);
      }
    }
  )
);

/* Validate JWT Token */
const JWTStrategyOpts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};
passport.use(
  new JWTStrategy(JWTStrategyOpts, async (jwt_payload, done) => {
    try {
      return cb(null, jwt_payload.user);
    } catch {
      return cb(err, false);
    }
  })
);
