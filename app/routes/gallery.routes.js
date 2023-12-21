const controller = require("../controller/gallery.controller");
const authJwt = require("../middleware/authJwt");
const mediaUpload = require("../middleware/cloudneryUpload"); 
const upload = mediaUpload.uploadStorage.array('images', 5);
const ImageUpload = mediaUpload.uploadMultipleImage;
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-gallery", [authJwt.verifyToken, upload, ImageUpload],  controller.addgallery);
  app.get("/api/gallery/:id", controller.getGalleryImage);
  app.get("/api/gallery", controller.getGalleryList);
  app.delete("/api/gallery/delete/:id", [authJwt.verifyToken], controller.deleteGalleryImage);
  
};
