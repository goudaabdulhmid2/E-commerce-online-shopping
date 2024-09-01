const express = require("express");
const morgen = require("morgan");
const categoryRouter = require("./routes/categoryRouter");
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgen("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Mount Routes
app.use("/api/v1/categories", categoryRouter);
module.exports = app;
