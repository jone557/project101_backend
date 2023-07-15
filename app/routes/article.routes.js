const controller = require("../controller/article.controller");
const authJwt = require("../middleware/authJwt");
const mediaUpload = require("../middleware/media");
const singleImageUpload = mediaUpload.imageUpload.single('image');
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-article", [authJwt.verifyToken], 
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
  }, controller.addArticle);
  app.get("/api/article/:id", controller.getSingleArticle);
  app.get("/api/articles", controller.getArticleList);
  app.put("/api/article/update/:id", [authJwt.verifyToken],function (req, res, next) {
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
  }, controller.updateArticle);
  app.delete("/api/article/delete/:id", [authJwt.verifyToken], controller.deleteArticle);
  
};
