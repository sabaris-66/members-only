const bcrypt = require("bcryptjs");
require("dotenv").config();
const express = require("express");
const path = require("node:path");
const port = process.env.PORT || 3000;
const pool = require("./db/pool");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const membersRouter = require("./routes/membersRouter");
const db = require("./db/queries");

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

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(username, password);
    try {
      const user = await db.findByUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await db.findByUsername(username);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post(
  "/logIn",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signUp",
  })
);

// for Router
app.use("/", membersRouter);

// error response
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

// listen port start
app.listen(port, () => console.log(`Started listening on port ${port}`));
