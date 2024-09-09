const multer = require('multer');
const AppError = require('../utils/AppError');

const multerSettings = () => {
  // Multer storage
  const multerStorage = multer.memoryStorage();

  // Multer filter
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed!', 400), false);
    }
  };

  return multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
};
exports.uploadSingleImage = (fieldName) => multerSettings().single(fieldName);

exports.uploadMultipleImages = (arrayOfFileds) =>
  multerSettings().fields(arrayOfFileds);
