require("dotenv").config();
const express = require("express");
const path = require("node:path");
const port = process.env.PORT || 3000;

const app = express();

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", membersRouter);

app.listen(port, () => console.log(`Started listening on port ${port}`));
