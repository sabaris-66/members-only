const bcrypt = require("bcryptjs");
require("dotenv").config();
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const passport = require("passport");

exports.getIndex = async (req, res) => {
  const messages = await db.getAllMessages();
  res.render("index", { user: req.user, messages: messages });
};

exports.getSignUp = (req, res) => {
  res.render("signUp");
};

const validateUser = [
  body("fullName")
    .trim()
    .isAlpha()
    .withMessage("Only alphabetic characters")
    .isLength({ min: 5, max: 40 })
    .withMessage("Name less than 40 characters"),
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage("User Id - only alphaNumeric characters")
    .isLength({ min: 8, max: 18 })
    .withMessage("User Id more than 8 and less than 18 characters")
    .custom(async (value) => {
      const existingUser = await db.findByUsername(value);
      if (existingUser && existingUser.username == value) {
        throw new Error("A user already exists with this username");
      }
    }),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Not a strong password"),
  body("confirmPassword").custom((value, { req }) => {
    if (value === req.body.password) {
      return true;
    }
    throw new Error("Password and confirm password must be same");
  }),
  body("membershipPassword")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.status === "user") {
        return true;
      }
      if (req.body.status === "member") {
        if (value !== process.env.MEMBER_PASSWORD) {
          throw new Error("Wrong Password for membership status");
        }
        return true;
      }
      if (req.body.status === "admin") {
        if (value !== process.env.ADMIN_PASSWORD) {
          throw new Error("Wrong password for admin membership");
        }
        return true;
      }
    }),
];

exports.postSignUp = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUp", {
        errors: errors.array(),
      });
    }
    const { username, fullName, status, password } = req.body;
    console.log(username, fullName, status, password);
    console.log(req.body.username, req.body.status, "in post controller");
    //password bcrypt and push it into database
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        throw new Error(err);
      } else {
        await db.pushMember(username, fullName, hashedPassword, status);
      }
    });

    res.redirect("/logIn");
  },
];

exports.getLogIn = (req, res) => {
  res.render("logIn");
};

exports.postLogIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/logIn",
});

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.getCreate = (req, res) => {
  res.render("create");
};

exports.postCreate = async (req, res) => {
  const date = new Date();
  await db.addMessage(req.body.message, date, req.user.username);
  res.redirect("/");
};

exports.postDeleteMessage = async (req, res) => {
  await db.deleteMessage(req.query.messageid);
  res.redirect("/");
};
