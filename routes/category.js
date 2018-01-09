var express = require('express')
var router = express.Router()
var Category = require('../models/category')
var Content = require('../models/content')

router.get('/category/:id', function(req, res){
  Category.findById(req.params.id, function(err, selectedcategory){
    if(err) {
      console.log(err)
    } else {
      if(selectedcategory !== null) {
    Content.find({category: selectedcategory._id}, function(err, category_content){
    if(err) {
    console.log(err)}
    else { res.json({category: selectedcategory, content: category_content, status: 500 })}})}
    else { res.json({ category:null, content: null, status:504 })}}})})
