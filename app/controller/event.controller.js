const db = require("../models");
const { ObjectId } = require("mongodb");
const Event = db.Event;

exports.addEvent = (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      image: req.body.image,
      category: req.body.category,
      videoUrl: req.body.videoUrl
    });
    event.save((err, Event) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      res.send({ message: "Event is Saved successfully!" });
    });
  } catch (error) {
    res.send({ message: error.message});
  }

};
exports.updateEvent = (req, res) => {
  const requestObj = req.body;
  const id = req.params.id;
  Event.findById(id)
  .exec((err, event) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!event) {
      return res.status(404).send({ message: "No event found with the given ID" });
    }
  Event.findOneAndUpdate({
          _id: new ObjectId(id)
      }, {...requestObj }, { upsert: true, new: true })
      .exec((err, event) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          return res.status(200).send({
              ...event._doc
          });
      })
    });
}

exports.deleteEvent = (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete({
          _id: new ObjectId(id)
      })
      .exec((err, event) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          if (!event) {
            return res.status(404).send({ message: "No event found with the given ID" });
          }
          return res.status(200).send({
              message:"event delated successfully!"
      });
      })
}

exports.getSingleEvent = (req, res) => {
  try {
    const id = req.params.id;
    Event.findById({
            _id: new ObjectId(id)
        })
        .exec((err, event) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if(!event){
              return res.status(404).send({ message: "No event found with the given ID" });
            }
              return res.status(200).send({
                  ...event._doc
              });
        })
  } catch (error) {
    res.send({message: error.message})
  }
 
}

exports.getEventList = async(req, res) => {
  let query = [];
  query.push({ "$sort": { "order": -1 } });
  try {
    const items = await Event.aggregate(query).exec();
    const count = await Event.countDocuments();
  
    return res.status(200).send({
      items,
      total: count
    });
  } catch (error) {
    return res.status(500).send({ error: "An error occurred while fetching events." });
  }
  
}
