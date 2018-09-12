const express = require("express"),
  bodyParser = require("body-parser"),
  exphbs = require('express-handlebars'),
  logger = require("morgan"),
  mongoose = require("mongoose");
// Initialize APp
const app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

//setting up handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const config = require("./config/database");
mongoose.Promise = Promise;
mongoose.connect(config.database)
  .then(result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(err => console.log('There was an error with your connection:', err));

// Routes
// require("./controllers/controller")(app);
//setting up routes
require('./controllers/index')(app),
require('./controllers/articles')(app),
require('./controllers/notes')(app),
require('./controllers/scrape')(app);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
