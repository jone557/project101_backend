const controller = require("../controller/notice.controller");
const authJwt = require("../middleware/authJwt");
const mediaUpload = require("../middleware/media");
const singleImageUpload = mediaUpload.imageUpload.single('image');
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-notice", [authJwt.verifyToken], 
  function (req, res, next) {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      singleImageUpload(req, res, function (err, some) {
        if (err) {
          return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
        }
        req.body.image = req.file.location;
        next();
      });
    } else {
      next();
    }
  }, controller.addNotice);
  app.get("/api/notice/:id", controller.getSingleNotice);
  app.get("/api/notice", controller.getNoticeList);
  app.put("/api/notice/update/:id", [authJwt.verifyToken],function (req, res, next) {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      singleImageUpload(req, res, function (err, some) {
        if (err) {
          return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
        }
        req.body.image = req.file.location;
        next();
      });
    } else {
      next();
    }
  }, controller.updateNotice);
  app.delete("/api/notice/delete/:id", [authJwt.verifyToken], controller.deleteNotice);
  
};
