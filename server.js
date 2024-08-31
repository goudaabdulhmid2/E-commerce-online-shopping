const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: `${__dirname}/config.env` });

const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connections successful!");
  })
  .catch((err) => {
    console.log(`DB Error: ${err}`);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
