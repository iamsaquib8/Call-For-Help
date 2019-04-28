const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const help = require('./routes/api/help');

const app = express();

//Body Parser Middlleware
 app.use(bodyParser.urlencoded({ extended : false }));
 app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());

//Passport Config
require('./config/auth')(passport);

//DB config
const db = require('./config/keys').mongoURI;

//MongoDB connection
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log(`MongoDB connected`))
    .catch(err => console.log(err));

//WebPage
app.use(express.static(__dirname + '/public'));

app.get('/hello', (req, res) => {
    res.send('Hello world')
})
//Use Routes
app.use('/api/users', users);
app.use('/api/help', help);

const port = process.env.PORT || 8080;

const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port;
    console.log("Express is working on port " + port);
  });

  module.exports = server;