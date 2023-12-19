require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({ 
  cloud_name: process.env.CLOUDENERY_NAME, 
  api_key: process.env.CLOUDENERY_API_KEY, 
  api_secret: process.env.CLOUDENERY_API_SECRETE 
});


const storage = multer.memoryStorage(); // Use memory storage for image uploads

const uploadStorage = multer({ storage });

const uploadImage = (req, res) => {
  try {
    const { file } = req;

    // Use a unique name for the image based on the current timestamp
    const uniqueName = `image-${Date.now()}`;

    // Upload the image to Cloudinary
    cloudinary.uploader.upload_stream({ 
      public_id: uniqueName,
      folder: '', 
    }, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading image' });
      } else {
        // The result object contains information about the uploaded image
        console.log(result);
        res.json({ message: 'Image uploaded successfully', imageUrl: result.secure_url });
      }
    }).end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

const uploadMultipleImage = (req, res) => {
  try {
    const { files } = req;

    // Use a unique name for each image based on the current timestamp
    const uniqueNames = files.map(file => `image-${Date.now()}-${file.originalname}`);

    // Upload each image to Cloudinary
    const promises = uniqueNames.map((uniqueName, index) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ 
          public_id: uniqueName,
          folder: '', // Specify the folder if needed
        }, (error, result) => {
          if (error) {
            console.error(error);
            reject(`Error uploading image ${index + 1}`);
          } else {
            console.log(result);
            resolve(result.secure_url);
          }
        }).end(files[index].buffer);
      });
    });

    Promise.all(promises)
      .then(imageUrls => {
        res.json({ message: 'Images uploaded successfully', imageUrls });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Error uploading images' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading images' });
  }
};

const mediaUpload = {
  uploadImage,
  uploadStorage,
  uploadMultipleImage
};
module.exports = mediaUpload;