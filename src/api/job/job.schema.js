const { body, query } = require("express-validator");

const createJobSchema = [body("data").isLength({ min: 1 }).withMessage(5002)];
const getJobByIdSchema = [query("id").isLength({ min: 1 }).withMessage(5003)];

const validationSchema = {
  createJobSchema,
  getJobByIdSchema,
};

module.exports = validationSchema;
