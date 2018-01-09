var mongoose = require('mongoose')

var sessionSchema = new mongoose.Schema({
      user_id: mongoose.Schema.Types.ObjectId,
      cart: []
})

var Session = mongoose.model('Session', sessionSchema)
module.exports = Session
