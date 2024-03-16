// Middleware file
const redis = require("redis");
const sendResponse = require("../utils/response");
const client = redis.createClient({
  password: process.env.PASSWORD,
  socket: {
    host: process.env.HOST,
    port: process.env.REDIS_PORT,
  },
});

client.connect();

async function redisMiddleware(req, res, next) {
  const { userId } = req.query;

  const includesPath = [`/api/user?userId=${userId}`, `/api/admin/signin`];

  if (includesPath.includes(req.originalUrl)) {
    const cacheKey = `${req.originalUrl}_userData`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("Data found in cache");
      return sendResponse(req, res, 2000, JSON.parse(cachedData));
    } else {
      console.log("Data not found in cache, fetching from DB");
      next();
    }
  } else {
    next();
  }
}

module.exports = redisMiddleware;
