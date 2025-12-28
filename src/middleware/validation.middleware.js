const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Validation middleware to check for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    throw new ValidationError('Validation failed', formattedErrors);
  }

  next();
};

module.exports = {
  validate
};
