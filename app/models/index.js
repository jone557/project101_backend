const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.Admin = require("./Admin.model");
db.Event = require("./Event.model");
db.Notice = require("./Notice.model");
db.Gallery = require("./Gallery.model");
db.Article = require("./Article.model");
db.Books = require("./Books.model");

module.exports = db;
