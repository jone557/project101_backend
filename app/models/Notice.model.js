const mongoose = require("mongoose");

const Notice = mongoose.model(
  "Notice",
  new mongoose.Schema(
    {
      title: {
      type: String,
    required:true
    },
      description: String,
      image: String
  },
    {
      timestamps: true,
    }
  )
);

module.exports = Notice;
