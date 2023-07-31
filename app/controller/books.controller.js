const db = require("../models");
const { ObjectId } = require("mongodb");
const Book = db.Books;



exports.addBook = (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      no_of_pages: req.body.no_of_pages,
      file: req.body.file,
      image: req.body.image,
      author: req.body.author,
      slug: req.body.slug,
      published_on: req.body.published_on
    });
    book.save((err, book) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      res.status(200).send({ message: "Book is Saved successfully!" });
    });
  } catch (error) {
    res.status(500).send({ message: error.message});
  }
  
};
exports.updateBook = (req, res) => {
  const requestObj = req.body;
  const id = req.params.id;
  Book.findById(id)
  .exec((err, book) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!book) {
      return res.status(404).send({ message: "No book found with the given ID" });
    }
  Book.findOneAndUpdate({
          _id: new ObjectId(id)
      }, {...requestObj }, { new: true })
      .exec((err, book) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          return res.status(200).send({
              ...book._doc
          });
      })
    });
}

exports.deleteBook = (req, res) => {
  const id = req.params.id;
  Book.findByIdAndDelete({
          _id: new ObjectId(id)
      })
      .exec((err, book) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          if (!book) {
            return res.status(404).send({ message: "No item found with the given ID" });
        }
          return res.status(200).send({
            message:"book delated successfully!"
          });
      })
}

exports.getSingleBook = (req, res) => {
  const id = req.params.id;
  try {
    Book.findById({
            _id: new ObjectId(id)
        })
        .exec((err, book) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if(!book){
              return res.status(404).send({ message: "No item found with the given ID" });
            }
            return res.status(200).send({
                ...book._doc
            });
        })
  } catch (error) {
    res.status(500).send({message: error.message})
  }
 
}

exports.getBookList = async(req, res) => {
  let query = []
  query.push({ "$sort": { "order": -1 } })
  try {
      const items = await Book.aggregate(query);
      return res.status(200).send({
          items,
          total: items.length
      }); 
  } catch (error) {
      return res.status(500).send({message :error.message})
  }
 
}

