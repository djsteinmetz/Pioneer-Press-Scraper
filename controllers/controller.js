// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("../models");
module.exports = (app) => {
    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        axios.get("https://www.twincities.com/tag/minnesota/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $("article h4").each(function (i, element) {
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
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
            });
            // Routes

            // Route for getting all Articles from the db
            app.get("/articles", function (req, res) {
                db.Article.find({}).then(function (dbArticle) {
                    res.send(dbArticle)
                        .catch(function (err) {
                            res.json(err);
                        });
                });
            });

            // Route for grabbing a specific Article by id, populate it with it's note
            app.get("/articles/:id", function (req, res) {
                // TODO
                // ====
                // Finish the route so it finds one article using the req.params.id,
                // and run the populate method with "note",
                // then responds with the article with the note included
                db.Article.findById(req.params.id)
                    .populate("note")
                    .then(function (dbArticle) {
                        res.send(dbArticle)
                    })
                    .catch(function (error) {
                        res.json(error)
                    });
            });

            // Route for saving/updating an Article's associated Note
            app.post("/articles/:id", function (req, res) {
                // TODO
                // ====
                // save the new note that gets posted to the Notes collection
                // then find an article from the req.params.id
                // and update it's "note" property with the _id of the new note
                db.Note.create(req.body)
                    .then(function (dbNote) {
                        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
                    })
                    .then(function (dbArticle) {
                        // If we were able to successfully update an Article, send it back to the client
                        res.json(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        res.json(err);
                    });
            });
            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
        });
    });
};