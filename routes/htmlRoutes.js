
const db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
      db.Article.find({})
      .then(function (dbArticle) {
        res.render("index", {
            msg: "Welcome!",
            articleData: dbArticle
          });
    })
    .catch(function (err) {
        res.json(err)
    });
      
   
  });

}