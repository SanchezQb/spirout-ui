var mongoose = require('mongoose')


var ContentSchema = new mongoose.Schema({
    name: String,
    description: String,
    filename: String,
    category: String,
    type: String, 
    creator: String,
    price: Number,
    download_url: String,
    preview_url: []
})

var Content = mongoose.model('Content', ContentSchema)

module.exports = Content
