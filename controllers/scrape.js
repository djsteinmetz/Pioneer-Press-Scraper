//Dependencies
const express = require('express'),
    cheerio = require('cheerio'),
    db = require('../models');
    rp = require("request-promise");

//route to scrape new articles
//route to scrape new articles
module.exports = app => {
    app.get("/articles", (req, res) => {
        //configuring options object for request-promist
        const options = {
            uri: 'https://www.twincities.com/tag/minnesota/',
            transform: body => {
                return cheerio.load(body);
            }
        };
        //calling the database to return all saved articles
        db.Article
            .find({})
            .then(savedArticles => {
                // console.log(`saved articles: ${savedArticles}`)
                //creating an array of saved article headlines
                let savedHeadlines = savedArticles.map(article => article.title);
                //calling request promist with options object
                rp(options)
                    .then($ => {
                        let newArticleArr = [];
                        //iterating over returned articles, and creating a newArticle object from the data
                        $('.landing article.tag-search-view').each((i, element) => {
                            // Images are small ... make them bigger
                            let url = $(element).children('figure').children('a').children('div.image-wrapper').find('img').attr('data-src')
                            url = url.slice(0, -3);
                            url+=1200;
                            let newArticle = new db.Article({
                                link: $(element).find('.article-title').attr('href'),
                                title: $(element).find('a.article-title').text().trim(),
                                imgUrl: url,
                                byLine: $(element).children('figure').children('a').children('div.image-wrapper').find('img').attr('title')
                            });
                            // console.log(newArticle)
                            //checking to make sure newArticle contains a storyUrl
                            if (newArticle.title) {
                                //checking if new article matches any saved article, if not add it to array
                                //of new articles
                                if (!savedHeadlines.includes(newArticle.title)) {
                                    newArticleArr.push(newArticle);
                                }
                            }
                        });//end of each function
                        // console.log(newArticleArr)
                        //adding all new articles to database
                        db.Article
                            .create(newArticleArr)
                            .then((result) => res.json(result))//returning count of new articles to front end
                            .catch(err => {console.log(err)});
                    })
                    .catch(err => console.log(err)); //end of rp method
            })
            .catch(err => console.log(err)); //end of db.Article.find()
    });// end of get request to /articles/new
}