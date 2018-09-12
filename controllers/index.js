//Dependencies
const express = require('express'),
    router = express.Router(),
    db = require("../models");

//get route to root, populating index.handlebars with articles
module.exports = app => {
    app.get('/', (req, res) => {
        db.Article
            .find({})
            .then(articles => {
                const hbsObj = {
                    articles: articles
                }
                res.render('index', hbsObj);
            })
            .catch(err => res.json(err));
    });
};