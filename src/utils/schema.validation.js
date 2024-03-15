const { validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const results = validationResult(req);
    if (results.isEmpty()) {
      return next();
    }

    let errors = results.array().map((error) => {
      return error.msg;
    });

    console.error(req.path, errors);
    const errCode = errors[1] === undefined ? 6000 : errors[1];

    return next({ code: errCode, status: 400 });
  };
};

module.exports = validate;
