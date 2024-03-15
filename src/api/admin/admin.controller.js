const sendResponse = require("../../utils/response.js");
const service = require("./admin.service.js");
const authUtils = require("../../common/contants.js");

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const findUser = await service.findUserByEmail(email);
    if (findUser) {
      return next({ code: 7000, status: 400 });
    }
    const passwordHash = await authUtils.getPasswordHash(password);
    const admin = await service.signUp({
      name,
      email,
      phone,
      password: passwordHash,
    });

    const responseData = { ...admin.toObject() };
    delete responseData.password;

    return sendResponse(req, res, 8001, responseData);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if admin exits or not
    const findUser = await service.findUserByEmail(email);
    if (!findUser) {
      return next({ code: 7001, status: 400 });
    }

    const isMatch = await authUtils.matchPassword(password, findUser.password);
    console.log("isMatch==", isMatch);

    if (isMatch == false) {
      return next({ code: 1503, status: 400 });
    }
    const payload = {
      user: {
        userId: findUser._id,
        email: findUser.email,
        role: findUser.role,
      },
    };

    const token = await authUtils.getToken({ payload, expiresIn: "5 days" });
    // Delete password field from user object
    const responseData = { ...findUser.toObject() };
    delete responseData.password;

    const data = {
      token: token,
      user: responseData,
    };
    await service.addDataToRedis({ data, url: req.originalUrl });
    return sendResponse(req, res, 8000, data);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

module.exports = { createAdmin, signin };
