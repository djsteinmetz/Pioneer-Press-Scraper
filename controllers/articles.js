const express = require("express"),
    db = require("../models")

//get route to render savedArticles.handlebars and populate with saved articles
module.exports = app => {
    app.get('/articles', (req, res) => {
        db.Article
            .find({})
            .then(result => { console.log(result); res.render('index', { articles: result })})
            .catch(err => res.json(err));
    });
};