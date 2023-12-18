const controller = require("../controller/books.controller");
const authJwt = require("../middleware/authJwt");
const mediaUpload = require("../middleware/localStorage");
const formDataMiddleware = require('../middleware/formDataMiddleware'); 
const singleFileUpload = mediaUpload.documentUpload.single('file');
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/api/add-file", [authJwt.verifyToken],
  function (req, res, next) {
   
      singleFileUpload(req, res, function (err, some) {
        if (err) {
          return res.status(422).send({ errors: [{ title: 'File Upload Error', detail: err.message }] });
        }
        const url = req.file?.path.split('uploads/books/')[1];
        return res.status(200).send(url);
      });
  })
  app.post("/api/add-book", [authJwt.verifyToken, formDataMiddleware], controller.addBook);
  app.get("/api/book/:id", controller.getSingleBook);
  app.get("/api/books", controller.getBookList);
  app.put("/api/book/update/:id", [authJwt.verifyToken, formDataMiddleware], controller.updateBook);
  app.delete("/api/book/delete/:id", [authJwt.verifyToken],
  controller.deleteBook);
  
};
