var mongoose = require('mongoose')

var ContentSchema = new mongoose.Schema({
    name: String,
    category: mongoose.Schema.Types.ObjectId,
    creator: mongoose.Schema.Types.ObjectId,
    price: Number,
    download_url: String,
    preview_url: []
})

var Content = mongoose.model('Content', ContentSchema)

module.exports = Content
