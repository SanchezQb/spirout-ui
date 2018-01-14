const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cors = require('cors')
var Content = require('./models/content')
var Category = require('./models/category')
var Request = require('./models/request')
var Token = require('./models/token')
var User = require('./models/user')
var Session = require('./models/session')
var UserRoute = require('./routes/user')
var contentRoute = require('./routes/content')
var categoryRoute = require('./routes/category')
var searchRoute = require('./routes/search')
var getContent = require('./test')
var Seed = require('./seeds')


app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect("mongodb://localhost/spirout", {
    useMongoClient: true,
});

app.use(UserRoute);
app.use(contentRoute);
app.use(searchRoute);
app.use(categoryRoute);

// Seed()

const port = 5000;

app.listen(port, () => console.log(`server started on port ${port}`))
