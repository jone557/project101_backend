const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema(
    {
      title: {
        type: String,
      required:true
          },
      description: String,
      location: {
        type: String,
        required:true
          },
      date: {
        type: Date,
        required:true
           },
      image: String,
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Event;
