const db = require("../models");
const BaseService = require("../core/base.service");
const { ObjectId } = require("mongodb");
const Gallery = db.Gallery;
const mediaUpload = require("../middleware/localStorage");
const mediaDelete = mediaUpload.deleteFile;
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
  
    res.send({ message: savedImages});
      });
    } catch (error) {
      res.send({ message: error.message});
    }
    
  };

exports.deleteGalleryImage = (req, res) => {
    const id = req.params.id;
    Gallery.findById(id)
    .exec((err, event) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!event) {
        return res.status(404).send({ message: "No event found with the given ID" });
      }
    imgUrl = event?.image
    filePath = `uploads/${imgUrl}`
    mediaDelete(filePath);
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
      });
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
        const totalCount = await Gallery.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        return res.status(200).send({
            items,
            total: totalCount,
            totalPages
   
        }); 
    } catch (error) {
        return res.status(500).send({message :error.message})
    }
   
  }