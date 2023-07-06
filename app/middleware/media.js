require('dotenv').config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require('@aws-sdk/client-s3')
const s3Client = new S3Client({
    region: process.env.S3_ORIGIN,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_SECRET,
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

const imageUpload = multer({
    fileFilter,
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

// const imageDelete = s3Client.deleteObject({ Bucket: process.env.S3_BUCKET,
//      Key:   function(req, file,cb){
//         cb(null, file.key )
//     }}, 
//      (err, data) => {
//     if (err) {
//       console.error('Error deleting image:', err);
     
//     } else {
//       console.log('Image deleted successfully');
    
//     }
//   });


const mediaUpload = {
    imageUpload,
};
module.exports = mediaUpload;