var mongoose = require('mongoose')

var tokenSchema = new mongoose.Schema({
    value: String,
    user_id: mongoose.Schema.Types.ObjectId,
    content_id: mongoose.Schema.Types.ObjectId,
    type: String,
    valid: Boolean,
    emailed: Boolean,
    used: Boolean,
    count: Number
})

var Token = mongoose.model('Token', tokenSchema)

module.exports = Token
