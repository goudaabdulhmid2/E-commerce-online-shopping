const mongoose = require("mongoose");

const DBcon = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const DB = () => {
  mongoose
    .connect(DBcon)
    .then(() => {
      console.log("DB connections successful!");
    })
    .catch((err) => {
      console.log(`DB Error: ${err}`);
    });
};

module.exports = DB;
