const multer = require('multer');

// Create a multer instance with the desired options
const upload = multer();

// Middleware function to handle FormData
const formDataMiddleware = (req, res, next) => {
  upload.none()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to process form data.' });
    }
    next();
  });
};

module.exports = formDataMiddleware;
