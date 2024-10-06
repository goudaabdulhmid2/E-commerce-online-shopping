const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/config.env` });
const DB = require('./config/dbConfig');
const client = require('./config/redisClient');
const app = require('./app');

// @desc Uncaught Exceptions: bugs ocure in syncchronous code
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('Uncaught Exceptions!');
  process.exit(1);
});

// @desc Connect with db
DB();

// Connect to Redis
client.connect().then(() => {
  console.log('Redis client connected');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// @desc Unhandled promise rejection: means that somewhere in our code there is a promise that gadrid got rejected. Event => litsen => callback
process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('UNHANDLER REJECTION!');
  // by doing this by srver we give server basically time to finsh all the requset that are still panding
  server.close(() => {
    process.exit(1);
  });
});
