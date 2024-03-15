const express = require("express");
const router = express.Router();

const { createJob, getJob } = require("./job.controller");
const validate = require("../../utils/schema.validation.js");
const validationSchema = require("./job.schema.js");

const { createJobSchema, getJobByIdSchema } = validationSchema;

// @route    POST /job
// @desc     Create a Job
// @access   public
router.post("/job", validate(createJobSchema), createJob);

// @route    GET /job
// @desc     GET Job By Id
// @access   public
router.get("/job", validate(getJobByIdSchema), getJob);

module.exports = router;
