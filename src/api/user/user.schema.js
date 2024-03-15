const { body, query } = require("express-validator");

const addUserSchema = [
  body("email").isString().notEmpty().withMessage(6001),
  body("name").isString().notEmpty().withMessage(6003),
  body("phone").isNumeric().notEmpty().withMessage(6002),
];

const getUserByIdSchema = [
  query("userId").isString().notEmpty().withMessage(6005),
];

const updateUserSchema = [
  body("id").isString().notEmpty().withMessage(6005),
  body("email").isString().notEmpty().withMessage(6001),
  body("name").isString().notEmpty().withMessage(6003),
  body("phone").isNumeric().notEmpty().withMessage(6002),
];

const deleteUserSchema = [query("id").isString().notEmpty().withMessage(6005)];

module.exports = {
  addUserSchema,
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
};
