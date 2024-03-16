const sendResponse = require("../../utils/response.js");
const service = require("./job.service");
const { v4: uuidv4 } = require("uuid");
const Queue = require("bull");

const jobQueue = new Queue("myQueue", {
  redis: {
    host: process.env.HOST,
    port: process.env.REDIS_PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

//Job creation in the Redis job queue.
const createJob = async (req, res, next) => {
  try {
    const { data } = req.body;
    const jobId = uuidv4();
    const job = await service.addJob({ id: jobId, data });
    const formatedData = {
      uuid: jobId,
      id: job.id,
      data: job.data.data,
    };
    return sendResponse(req, res, 1000, formatedData);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

//Proccess Job Worker
jobQueue.process(async (job) => {
  console.log(`Processing job ${job.id} with data:`, job.data);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const result = `Processed job ${job.id}`;
  console.log("Job", result);
  return result;
});

//Get Specific Job by its ID.
const getJob = async (req, res, next) => {
  try {
    const { id } = req.query;
    const specificJob = await service.getJobById(id);
    if (!specificJob) {
      return next({ code: 5001, status: 400 });
    }

    // Get job result
    const result = await specificJob;

    return sendResponse(req, res, 1002, result);
  } catch (error) {
    return next({ code: 5000, status: 500, error: error.message });
  }
};

const controller = {
  createJob,
  getJob,
};

module.exports = controller;
