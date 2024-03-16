const Queue = require("bull");

const jobQueue = new Queue("myQueue", {
  redis: {
    host: process.env.HOST,
    port: process.env.REDIS_PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
const addJob = ({ jobId, data }) => {
  return jobQueue.add({ id: jobId, data });
};

const getJobById = (id) => {
  return jobQueue.getJob(id);
};

const service = {
  addJob,
  getJobById,
};

module.exports = service;
