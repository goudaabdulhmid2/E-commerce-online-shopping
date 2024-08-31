const express = require("express");
const morgen = require("morgan");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgen("dev"));
}
app.use("/", (req, res) => {
  res.send("welcome");
});
module.exports = app;
