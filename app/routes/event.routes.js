const controller = require("../controller/event.controller");
const authJwt = require("../middleware/authJwt");
const mediaUpload = require("../middleware/media");
const singleImageUpload = mediaUpload.imageUpload.single('image');
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/image-upload", [authJwt.verifyToken], function (req, res, next) {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      singleImageUpload(req, res, function (err, some) {
        if (err) {
          return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
        }
        const url = req.file?.location;
        return res.status(200).send(url);
      });
    } else {
     return res.status(401).send("no Image value detected")
    }
  },)
  app.post("/api/add-event", [authJwt.verifyToken], controller.addEvent);
  app.get("/api/event/:id", controller.getSingleEvent);
  app.get("/api/event", controller.getEventList);
  app.put("/api/event/update/:id", [authJwt.verifyToken], controller.updateEvent);
  app.delete("/api/event/delete/:id", [authJwt.verifyToken], controller.deleteEvent);
};
