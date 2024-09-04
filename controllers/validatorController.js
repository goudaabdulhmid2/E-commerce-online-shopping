const { validationResult } = require('express-validator');

// @desc Finds the validation errors in the requset and warps them in an object with handy function
exports.catchError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
