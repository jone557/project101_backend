const db = require("../models");
const Admin = db.Admin;

checkDuplicateAdminnameOrEmail = (req, res, next) => {
  // Adminname
  Admin.findOne({
    name: req.body.name,
  }).exec((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (admin) {
      res.status(400).send({ message: "Failed! Adminname is already in use!" });
      return;
    }

    // Email
    Admin.findOne({
      email: req.body.email,
    }).exec((err, admin) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (admin) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateAdminnameOrEmail,
};

module.exports = verifySignUp;
