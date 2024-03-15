const User = require("../../models/userModal.js");
// Create Redis Client
const redis = require("redis");
const client = redis.createClient();
client.connect();

const findUser = (email) => {
  return User.findOne({ email });
};
const addUser = ({ name, email, phone, role, password }) => {
  return User.create({
    name,
    email,
    phone,
    role: role == undefined ? "user" : role,
    password,
  });
};

const findAllUser = ({ page, limit, order }) => {
  return User.find()
    .sort({ name: order || "asc" })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
};

const addDataToRedis = async ({ user, url }) => {
  const userDataString = JSON.stringify(user);
  const cacheKey = `${url}_userData`;
  const existingUserData = await client.get(cacheKey);

  if (existingUserData !== userDataString) {
    // data retain for 1 min in redis cache
    await client.setEx(cacheKey, 60, userDataString);
  }
};

const getUserById = (userId) => {
  return User.findById(userId);
};

const editUser = ({ id, name, email, phone }) => {
  return User.findByIdAndUpdate(id, { name, email, phone }, { new: true });
};

const detetUser = (id) => {
  return User.findByIdAndDelete(id);
};

const service = {
  addUser,
  findUser,
  findAllUser,
  addDataToRedis,
  getUserById,
  editUser,
  detetUser,
};

module.exports = service;
