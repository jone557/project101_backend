var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { validateEmail } = require("../core/base.service");
const db = require("../models");
const config = require("../config/auth.config.js");
const Admin = db.Admin;

exports.signup = async (req, res) => {
  try {
    const isValid = await validateEmail(req.body.email);
    if (!isValid) {
        return res.send({ message: "A valid e-mail address is requred" });
    }
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
  
    admin.save((err, Admin) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      res.send({ message: "Admin is registered successfully!" });
    });
  } catch (error) {
    res.send({ message: error.message});
  }
 
};

exports.signin = (req, res) => {
  try {
    Admin.findOne({
      name: req.body.name,
    }).exec((err, admin) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!admin) {
        return res.status(404).send({ message: "Admin Not found." });
      }
  
      var passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);
  
      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }
  
      var token = jwt.sign({ id: admin.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
  
      req.session.token = token;
  
      res.status(200).send({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        token,
      });
    });
  } catch (error) {
    res.send({ message: error.message});
  }
 
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
