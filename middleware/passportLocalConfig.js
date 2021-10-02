const bcrypt = require("bcrypt");
const saltRounds = 10;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../utils/userSchema");

function initialize(passport) {
  const getUserByEmail = (username) => {
    return User.findOne({ username: username });
  };

  const authenticateUser = async (username, password, done) => {
    const user = await getUserByEmail(username);
    try {
      if (user === null) {
        return done(null, false, {
          message: "No user Found with this email id",
        });
      } else if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Not Match" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
