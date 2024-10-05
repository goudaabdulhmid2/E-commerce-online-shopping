const redis = require('redis');

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Check Redis connection
client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
client
  .connect()
  .then(() => {
    console.log('Redis client connected');
  })
  .catch((err) => {
    console.error('Error connecting to Redis:', err);
  });

module.exports = client;
