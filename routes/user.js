const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs",{showContainer2:false});
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ username, email });

    // ✅ correct way (auto hash)
    const registeredUser = await User.register(newUser, password);

    res.redirect("/login");
    req.flash("success","You are logged in!")
  } catch (err) {
    console.log(err);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login",{showContainer2:false});
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
     req.flash("success","You are logged in!")
    res.redirect("/");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success","You are logged out!")
    res.redirect("/");
  });
});

module.exports = router;