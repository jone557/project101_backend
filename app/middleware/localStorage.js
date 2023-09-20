require('dotenv').config();
const multer = require("multer");
const fs = require('fs');

// Define the storage for multer
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the folder where you want to save the images
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split('.').pop();
        var uniqueV = `image-${Date.now()}`
        const filename = uniqueV + '.' + ext;
        cb(null, filename); 
    }
});

const bookStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/books/'); // Specify the folder where you want to save the documents
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split('.').pop();
        var uniqueV = `document-${Date.now()}`;
        const filename = uniqueV + '.' + ext;
        cb(null, filename); 
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type, only PDF and Word document files are allowed!'
        ),
        false
      );
    }
  };
const imageUpload = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
});

const documentUpload = multer({
    storage: bookStorage,
    fileFilter: fileFilter,
});
const deleteFile = (filePath)=>{
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
            return false;
        }
        console.log('File deleted successfully');
        return true;
    });
}
const localMediaUpload = {
    imageUpload,
    documentUpload,
    deleteFile
};
module.exports = localMediaUpload;