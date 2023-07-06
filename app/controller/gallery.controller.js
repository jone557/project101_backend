const db = require("../models");
const BaseService = require("../core/base.service");
const { ObjectId } = require("mongodb");
const Gallery = db.Gallery;

exports.addgallery = (req, res) => {
    try {
        const images = req.body.images; 

        const galleryImages = images.map((imageName) => {
          return new Gallery({ image: imageName });
        });
    
    Gallery.insertMany(galleryImages, (err, savedImages) => {
        if (err) {
        res.status(500).send({ message: err });
        return;
        }
  
    res.send({ message: "Images are saved successfully!" });
      });
    } catch (error) {
      res.send({ message: error.message});
    }
    
  };

exports.deleteGalleryImage = (req, res) => {
    const id = req.params.id;
    Gallery.findByIdAndDelete({
            _id: new ObjectId(id)
        })
        .exec((err, image) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!image) {
              return res.status(404).send({ message: "No item found with the given ID" });
          }
            return res.status(200).send({
              message:"Image delated successfully!"
            });
        })
  }
  

  exports.getGalleryImage = (req, res) => {
    const id = req.params.id;
    try {
      Gallery.findById({
              _id: new ObjectId(id)
          })
          .exec((err, image) => {
              if (err) {
                  res.status(500).send({ message: err });
                  return;
              }
              if(!image){
                return res.status(404).send({ message: "No item found with the given ID" });
              }
              return res.status(200).send({
                  ...image._doc
              });
          })
    } catch (error) {
      res.status(500).send({message: error.message})
    }
   
  }

  exports.getGalleryList= async(req, res) => {
    let query = []
    let { page, size } = req.query
    if (!page) page = 1;
    if (!size) size = 10;
    const limit = parseInt(size)
    const skip = BaseService.getSkipValue(limit, page)
    
    query.push({ "$sort": { "order": -1 } })
    query.push({ "$skip": skip })
    query.push({ "$limit": limit })
    try {
        const items = await Gallery.aggregate(query);
        return res.status(200).send({
            items,
            total: items.length
        }); 
    } catch (error) {
        return res.status(500).send({message :error.message})
    }
   
  }