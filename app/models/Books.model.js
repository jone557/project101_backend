const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema(
    {
      title: {
        type: String,
      required:true
          },
      no_of_pages: Number,
      author: {
        type: String,
        required:true
          },
      published_on: {
        type: Date,
        required:true
           },
      file: String,
      slug: String,
      image: String
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Book;
