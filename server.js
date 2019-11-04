const express = require("express");
// const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const app = express();
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
  console.log("App running: " + PORT + "!");
});

app.get("/scrape", function(req, res) {
  axios.get("https://old.reddit.com/r/cars/").then(function(response) {
  let newArticleCount = 0;
  let $ = cheerio.load(response.data);
  $("p.title").each(function(i, element) {
      let result = {};
      result.title = $(this).text();
      result.link = $(this).children().attr("href");
      db.Article.findOne({link: result.link})
      .then(function(dbArticleFound) {
        if (!dbArticleFound) {
          db.Article.create(result)
          .then(function(dbArticle) {
              console.log(dbArticle);
              newArticleCount++;
          })
          .catch(function(err) {
              console.log(err);
          });  
        } else {
          console.log("Article already exists.  Moving onto next.");
        }
      });
  });
  res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
      res.json(dbArticle);
  })
  .catch(function(err) {
      res.json(err);
  });
});

app.get("/notes/:id", function(req, res) {
  db.Note.find({ articleID: req.params.id })
  .then(function(dbArticle) {
      res.json(dbArticle);
  })
  .catch(function(err) {
      res.json(err);
  });
});

app.post("/notes/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
      res.json(dbArticle);
  })
  .catch(function(err) {
      res.json(err);
  });
});

app.get("/notes/delete/:id", function(req, res) {
db.Note.findOneAndDelete({ _id: req.params.id })
  .then(function() {
    console.log("Delete should be complete...");
  }, function(){
    console.log("Delete failed.");
  })
  .catch(function(err) {
    res.json(err);
  });
});
