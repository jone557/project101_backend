const controller = require("../controller/gallery.controller");
const authJwt = require("../middleware/authJwt");
const mediaUpload = require("../middleware/localStorage");
const multipleImageUpload = mediaUpload.imageUpload.array('images', 5);
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-gallery", [authJwt.verifyToken], 
  function (req, res, next) {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
        multipleImageUpload(req, res, function (err, some) {
        if (err) {
          return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
        }
        const path = req.files.map((file) => file.path.split('uploads/')[1]);
        req.body.images = path;
        next();
      });
    } else {
      next();
    }
  }, controller.addgallery);
  app.get("/api/gallery/:id", controller.getGalleryImage);
  app.get("/api/gallery", controller.getGalleryList);
  app.delete("/api/gallery/delete/:id", [authJwt.verifyToken], controller.deleteGalleryImage);
  
};
