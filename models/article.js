const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  }

});


let Article = mongoose.model("Article", ArticleSchema);



module.exports = Article;