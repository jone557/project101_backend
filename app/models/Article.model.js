const mongoose = require("mongoose");

const Article = mongoose.model(
  "Article",
  new mongoose.Schema(
    {
      title: {
        type: String,
      required:true
          },
      description: String,
      author: {
        type: String,
        required:true
          },
      publication_date: {
        type: Date,
        required:true
           },
      image: String,
      slug: String,
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Article;
