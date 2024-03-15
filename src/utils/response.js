const messages = require("../../config/messages.js");

const sendResponse = (req, res, code, data) => {
  console.log("success -------->>>>>> ", req.originalUrl);
  if (code && typeof code === "number") {
    var message = messages[code];
  }

  return res.status(200).send({
    success: 1,
    message: message || "success",
    data: data || {},
  });
};

module.exports = sendResponse;
