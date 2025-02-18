const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }
  next();
};

module.exports = validateRequest;