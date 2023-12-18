const controller = require("../controller/notice.controller");
const authJwt = require("../middleware/authJwt");
const formDataMiddleware = require('../middleware/formDataMiddleware'); 
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-notice", [authJwt.verifyToken, formDataMiddleware], controller.addNotice);
  app.get("/api/notice/:id", controller.getSingleNotice);
  app.get("/api/notice", controller.getNoticeList);
  app.put("/api/notice/update/:id", [authJwt.verifyToken, formDataMiddleware], controller.updateNotice);
  app.delete("/api/notice/delete/:id", [authJwt.verifyToken], controller.deleteNotice);
  
};
