const express = require("express");
const router = express.Router();
const validate = require("../../utils/schema.validation.js");
const {
  addUserSchema,
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
} = require("./user.schema.js");
const {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  removeUser,
} = require("./user.controller.js");

const resource = "/user";

// @route    POST /user/add
// @desc     Create a user
// @access   private
router.post(`${resource}/add`, validate(addUserSchema), createUser);

// @route    POST /user/all
// @desc     Get all users with pagination and sorting
// @access   private
router.get(`${resource}/all`, getUsers);

// @route    POST /user
// @desc     get a user by id
// @access   private

router.get(`${resource}`, validate(getUserByIdSchema), getSingleUser);

// @route    PATCH /user
// @desc     Update a user
// @access   private
router.patch(`${resource}`, validate(updateUserSchema), updateUser);

// @route    DELETE /user
// @desc     Delete a user
// @access   private
router.delete(`${resource}`, validate(deleteUserSchema), removeUser);

module.exports = router;
