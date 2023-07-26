const controller = require("../controller/notice.controller");
const authJwt = require("../middleware/authJwt");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-notice", [authJwt.verifyToken], controller.addNotice);
  app.get("/api/notice/:id", controller.getSingleNotice);
  app.get("/api/notice", controller.getNoticeList);
  app.put("/api/notice/update/:id", [authJwt.verifyToken], controller.updateNotice);
  app.delete("/api/notice/delete/:id", [authJwt.verifyToken], controller.deleteNotice);
  
};
