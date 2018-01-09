const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cors = require('cors')
var Content = require('./models/content')
var Category = require('./models/category')
var User = require('./models/user')
var Session = require('./models/session')
var UserRoute = require('./routes/user')


app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect("mongodb://localhost/spirout", {
    useMongoClient: true,
});

app.use(UserRoute);

const port = 5000;

app.listen(port, () => console.log(`server started on port ${port}`))
