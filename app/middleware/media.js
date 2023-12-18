require('dotenv').config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require('@aws-sdk/client-s3')
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})

const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

const imageUpload = multer({
    imageFilter,
    storage: multerS3({
        acl: process.env.S3_PERMISSION,
        s3: s3Client,
        bucket: function(req, file,cb){
            cb(null, process.env.S3_BUCKET )
        },
        metadata: function(req, file, cb) {
            cb(null, { fieldName: "TESTING_METADATA" });
        },
        key: function(req, file, cb) {
            var ext = file.originalname.split('.').pop();
            var uniqueV = `image-${Date.now()}`
            const filename = uniqueV + '.' + ext;
            cb(null, filename); 
        }
    }),
});
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

  const documentUpload = multer({
    fileFilter,
    storage: multerS3({
      acl: process.env.S3_PERMISSION,
      s3: s3Client,
      bucket: function (req, file, cb) {
        cb(null, process.env.S3_BUCKET);
      },
      metadata: function (req, file, cb) {
        cb(null, { fieldName: 'TESTING_METADATA' });
      },
      key: function (req, file, cb) {
        var ext = file.originalname.split('.').pop();
        var uniqueV = `document-${Date.now()}`;
        const filename = `books/${uniqueV}.${ext}`;
        cb(null, filename);
      },
    }),
  });




const mediaUpload = {
    imageUpload,
    documentUpload,
};
module.exports = mediaUpload;