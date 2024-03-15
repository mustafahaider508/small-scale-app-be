const { glob } = require("glob");
const fs = require("fs");
const _ = require("lodash");

console.info("error messages are loading ...");
let routePath = "src/**/**/*.errors.json";
// initialising with common error message objects
var errors = {};

glob.sync(routePath).forEach(function (file) {
  _.extend(errors, JSON.parse(fs.readFileSync(file, "utf-8")));
  console.info(file + " is loaded");
});
module.exports = errors;
