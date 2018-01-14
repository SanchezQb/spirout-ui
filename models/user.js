var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    phone: Number,
    isAdmin: Boolean,
    forgot_password: String,
    purchased: [],
    passwordcount: Number
})

var User = mongoose.model('User', UserSchema)
module.exports = User
