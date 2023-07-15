const db = require("../models");
const { ObjectId } = require("mongodb");
const Article = db.Article;

exports.addArticle = (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      author: req.body.author,
      slug: req.body.slug,
      publication_date: req.body.publication_date
    });
    article.save((err, notice) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      res.send({ message: "Article is Saved successfully!" });
    });
  } catch (error) {
    res.send({ message: error.message});
  }
  
};
exports.updateArticle = (req, res) => {
  const requestObj = req.body;
  const id = req.params.id;
  Article.findById(id)
  .exec((err, article) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!article) {
      return res.status(404).send({ message: "No article found with the given ID" });
    }
  Article.findOneAndUpdate({
          _id: new ObjectId(id)
      }, {...requestObj }, { new: true })
      .exec((err, article) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          return res.status(200).send({
              ...article._doc
          });
      })
    });
}

exports.deleteArticle = (req, res) => {
  const id = req.params.id;
  Article.findByIdAndDelete({
          _id: new ObjectId(id)
      })
      .exec((err, article) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }
          if (!article) {
            return res.status(404).send({ message: "No item found with the given ID" });
        }
          return res.status(200).send({
            message:"article delated successfully!"
          });
      })
}

exports.getSingleArticle = (req, res) => {
  const id = req.params.id;
  try {
    Article.findById({
            _id: new ObjectId(id)
        })
        .exec((err, article) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if(!article){
              return res.status(404).send({ message: "No item found with the given ID" });
            }
            return res.status(200).send({
                ...article._doc
            });
        })
  } catch (error) {
    res.status(500).send({message: error.message})
  }
 
}

exports.getArticleList = async(req, res) => {
  let query = []
  query.push({ "$sort": { "order": -1 } })
  try {
      const items = await Article.aggregate(query);
      return res.status(200).send({
          items,
          total: items.length
      }); 
  } catch (error) {
      return res.status(500).send({message :error.message})
  }
 
}

