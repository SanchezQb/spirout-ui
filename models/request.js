var mongoose = require('mongoose')

var requestSchema = new mongoose.Schema({
    topic: String,
    amount_of_words: Number,
    category: String,
    type: String,
    duration: String,
    description: String,
    requesting_user: {}
})

var Request = mongoose.model('Request', requestSchema)

module.exports = Request
