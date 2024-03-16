const sendResponse = require("../../utils/response.js");
const service = require("./user.service.js");
const redis = require("redis");
const authUtils = require("../../common/contants.js");
const User = require("../../models/userModal.js");

// Create Redis Client
const client = redis.createClient({
  password: process.env.PASSWORD,
  socket: {
    host: process.env.HOST,
    port: process.env.REDIS_PORT,
  },
});

client.connect();

const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const findUser = await service.findUser(email);
    if (findUser) {
      return next({ code: 6006, status: 400 });
    }

    const passwordHash = await authUtils.getPasswordHash(password);
    const randomPassword = authUtils.generateRandomPassword();
    const randomPasswordHash = await authUtils.getPasswordHash(randomPassword);
    const user = await service.addUser({
      name,
      email,
      phone,
      role,
      password: passwordHash === undefined ? randomPasswordHash : passwordHash,
    });

    const data = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: randomPassword,
    };
    //adding data to redis it will retain for 1 min
    await service.addDataToRedis({ user, url: req.originalUrl });
    return sendResponse(req, res, 2000, data);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page, limit, order } = req.query;
    const user = await service.findAllUser({ page, limit, order });

    const totalCount = await User.countDocuments();
    const data = {
      count: totalCount,
      users: user,
    };

    return sendResponse(req, res, 2000, data);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const user = await service.getUserById(userId);
    if (!user) {
      return next({ code: 6004, status: 400 });
    }
    //adding data to redis it will retain for 1 min
    await service.addDataToRedis({ user, url: req.originalUrl });
    return sendResponse(req, res, 2001, user);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id, name, email, phone } = req.body;
    const findUser = await service.getUserById(id);
    if (!findUser) {
      return next({ code: 6004, status: 400 });
    }
    const updatedUser = await service.editUser({ id, name, email, phone });
    return sendResponse(req, res, 2002, updatedUser);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

const removeUser = async (req, res, next) => {
  try {
    const { id } = req.query;
    const findUser = await service.getUserById(id);
    if (!findUser) {
      return next({ code: 6004, status: 400 });
    }
    const user = await service.detetUser(id);
    return sendResponse(req, res, 2003, user);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  removeUser,
};
