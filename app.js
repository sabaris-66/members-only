require("dotenv").config();
const express = require("express");
const path = require("node:path");
const port = process.env.PORT || 3000;
const pool = require("./db/pool");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// app express
const app = express();

// for styles.css
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// for html ejs views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// for form req.body parameters
app.use(express.urlencoded({ extended: true }));

// for session, passport, localStrategy
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

// for Router
app.use("/", membersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

// listen port start
app.listen(port, () => console.log(`Started listening on port ${port}`));
