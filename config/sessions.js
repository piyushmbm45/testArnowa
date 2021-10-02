const express = require("express");
const router = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const uri = process.env.DB_URL;

const sessionStore = MongoStore.create({
  mongoUrl: uri,
  collection: "sessions",
});

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60*60,
    },
  })
);

module.exports = router;