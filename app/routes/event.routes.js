const controller = require("../controller/event.controller");
const authJwt = require("../middleware/authJwt");
const mediaUpload = require("../middleware/cloudneryUpload"); 
const upload = mediaUpload.uploadStorage.single('image')
const ImageUpload = mediaUpload.uploadImage;
const formDataMiddleware = require('../middleware/formDataMiddleware'); 
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/image-upload", [authJwt.verifyToken,  upload, ImageUpload]);
  app.post("/api/add-event", [authJwt.verifyToken, formDataMiddleware], controller.addEvent);
  app.get("/api/event/:id", controller.getSingleEvent);
  app.get("/api/event", controller.getEventList);
  app.put("/api/event/update/:id", [authJwt.verifyToken, formDataMiddleware], controller.updateEvent);
  app.delete("/api/event/delete/:id", [authJwt.verifyToken], controller.deleteEvent);
};
