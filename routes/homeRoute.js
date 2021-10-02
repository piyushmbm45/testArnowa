const express = require("express");
const router = express();
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../utils/userSchema");
const flash = require("express-flash");


const initializePassport = require("../middleware/passportLocalConfig");
initializePassport(passport);

router.use(flash());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);
// middleware to use ejs template engine
router.set("view engine", "ejs");
router.use(express.static("public"));

router.use(passport.initialize());
router.use(passport.session());


router.get('/register',(req,res)=>{
  res.render('register')
})

router.post("/register", async (req, res) => {
  console.log(req.body);
  const hash = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = await new User({
    name: req.body.name,
    username: req.body.username,
    password: hash,
  });
  newUser.save((err) => {
    if (!err) {
      req.flash("register", "You are registered Now You can login");
      res.redirect("/");
    } else {
      if (err.code === 11000) {
        req.flash("info", "User Already Exist");
        res.redirect("/");
      } else {
        res.redirect("/");
      }
    }
  });
});

// -----homepage route with login get and post request

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("home");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: true,
    session: true,
  }),
  (req, res) => {
    console.log(req.session);
    res.redirect("/secret");
  }
);

// --------logout route
router.post("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/");
});

// secret route
router.get("/secret", checkAuthenticated, (req, res) => {
  res.render("secret", { user: req.user });
});

// need authenticated user to see our secret route
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// if user already logged in then we dont want to show him register and login route
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/secret");
  }
  next();
}

module.exports = router;
