const mongoose = require("mongoose");

const Gallery = mongoose.model(
  "Gallery",
  new mongoose.Schema(
    {
      image: {
      type: String,
    required:true
    }
  },
    {
      timestamps: true,
    }
  )
);

module.exports = Gallery;
