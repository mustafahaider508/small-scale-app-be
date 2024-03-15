const express = require("express");
const { createAdmin, signin } = require("./admin.controller");
const router = express.Router();

// @route    POST /user/add
// @desc     Create a user
// @access   private
router.post("/signup", createAdmin);

// @route    POST /user/add
// @desc     Create a user
// @access   private
router.post("/signin", signin);

module.exports = router;
