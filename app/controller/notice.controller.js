const db = require("../models");
const { ObjectId } = require("mongodb");
const Notice = db.Notice;

exports.addNotice = (req, res) => {
  try {
    const notice = new Notice({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image
    });
    notice.save((err, notice) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      res.send({ message: "Notice is Saved successfully!" });
    });
  } catch (error) {
    res.send({ message: error.message});
  }
  
};
exports.updateNotice = (req, res) => {
  const requestObj = req.body;
  const id = req.params.id;
  Notice.findById(id)
  .exec((err, event) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!event) {
      return res.status(404).send({ message: "No event found with the given ID" });
    }
  Notice.findOneAndUpdate({
          _id: new ObjectId(id)
      }, {...requestObj }, { new: true })
      .exec((err, notice) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          return res.status(200).send({
              ...notice._doc
          });
      })
    });
}

exports.deleteNotice = (req, res) => {
  const id = req.params.id;
  Notice.findByIdAndDelete({
          _id: new ObjectId(id)
      })
      .exec((err, notice) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          if (!notice) {
            return res.status(404).send({ message: "No item found with the given ID" });
        }
          return res.status(200).send({
            message:"notice delated successfully!"
          });
      })
}

exports.getSingleNotice = (req, res) => {
  const id = req.params.id;
  try {
    Notice.findById({
            _id: new ObjectId(id)
        })
        .exec((err, notice) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if(!notice){
              return res.status(404).send({ message: "No item found with the given ID" });
            }
            return res.status(200).send({
                ...notice._doc
            });
        })
  } catch (error) {
    res.status(500).send({message: error.message})
  }
 
}

exports.getNoticeList = async(req, res) => {
  let query = []
  query.push({ "$sort": { "order": -1 } })
  try {
      const items = await Notice.aggregate(query);
      return res.status(200).send({
          items,
          total: items.length
      }); 
  } catch (error) {
      return res.status(500).send({message :error.message})
  }
 
}

