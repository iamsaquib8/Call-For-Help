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

// app.set('views', __dirname + '/public');

//Use Routes
app.use('/api/users', users);
app.use('/api/help', help);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App is Running on ${port}`);
})