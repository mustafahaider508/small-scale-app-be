const { glob } = require("glob");
const fs = require("fs");
const _ = require("lodash");

console.info("response messages are loading ...");
let routePath = "src/**/**/*.messages.json";
// initialising with common error message objects
var messages = {};

glob.sync(routePath).forEach(function (file) {
  _.extend(messages, JSON.parse(fs.readFileSync(file, "utf-8")));
  console.info(file + " is loaded");
});

module.exports = messages;
