const controller = require("../controller/article.controller");
const authJwt = require("../middleware/authJwt");
const formDataMiddleware = require('../middleware/formDataMiddleware'); 
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-article", [authJwt.verifyToken, formDataMiddleware], controller.addArticle);
  app.get("/api/article/:id", controller.getSingleArticle);
  app.get("/api/articles", controller.getArticleList);
  app.put("/api/article/update/:id", [authJwt.verifyToken, formDataMiddleware],controller.updateArticle);
  app.delete("/api/article/delete/:id", [authJwt.verifyToken], controller.deleteArticle);
  
};
