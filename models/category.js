var mongoose = require('mongoose')

var CategorySchema = new mongoose.Schema({
    name: String,
    icon_url: String
})

var Category = mongoose.model("Category", CategorySchema)
