const express = require("express"),
    db = require("../models")

//get route to render savedArticles.handlebars and populate with saved articles
module.exports = app => {
    app.get('/articles/:id', (req, res) => {
        db.Article
            .find({"_id" : req.params.id})
            .then(result => { 
                console.log(result); res.send(result)
            })
            .catch(err => res.json(err));
    });
};