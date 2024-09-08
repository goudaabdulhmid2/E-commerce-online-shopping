const multer = require('multer');
const AppError = require('../utils/AppError');
exports.uploadSingleImage = (fieldName) => {
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

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  return upload.single(fieldName);
};

exports.uploadMultipleImages = (cover, images) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed!', 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload.fields([
    { name: cover, maxCount: 1 },
    { name: images, maxCount: 5 },
  ]);
};
