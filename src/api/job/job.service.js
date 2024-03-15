const Queue = require("bull");
const jobQueue = new Queue("myQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
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
