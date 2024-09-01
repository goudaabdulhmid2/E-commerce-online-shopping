const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const DB = require("./config/dbConfig");
const app = require("./app");

// Connect with db
DB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
