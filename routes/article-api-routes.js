const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

// A GET route for scraping the echoJS website
module.exports = function (app) {
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.theonion.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".headline").each(function (i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.redirect("/")

    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (data) {
      res.json(data);
    })
  });
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
      _id: req.params.id
    }).populate("note").then(function (data) {
      res.json(data);
    })
  
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, {
  
            note: dbNote._id
          }, {
            new: true
          });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  })

  app.delete("/articles/:id", function (req, res) {
    db.Note.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
  })
};

