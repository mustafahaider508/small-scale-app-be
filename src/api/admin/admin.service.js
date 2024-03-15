const User = require("../../models/userModal.js");
const redis = require("redis");
const client = redis.createClient();
client.connect();
const signUp = ({ name, email, phone, password }) => {
  return User.create({
    name,
    email,
    phone,
    role: "admin",
    password,
  });
};

const findUserByEmail = (email) => {
  return User.findOne({
    email,
  });
};

const addDataToRedis = async ({ data, url }) => {
  const userDataString = JSON.stringify(data);
  const cacheKey = `${url}_userData`;
  const existingUserData = await client.get(cacheKey);

  if (existingUserData !== userDataString) {
    // data retain for 1 min in redis cache
    await client.setEx(cacheKey, 60, userDataString);
  }
};

module.exports = { signUp, findUserByEmail, addDataToRedis };
