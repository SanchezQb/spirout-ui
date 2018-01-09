var express = require('express')
var router = express.Router()
var Category = require('../models/category')
var Content = require('../models/content')



router.get('/category/:contentid', function(req, res){
Content.findById(req.params.contentid, function(err, content){
if(err) {
console.log(err)
} else {
if(content !== null){
User.findById(content.creator, function(err, content_owner){
if(err) {
console.log(err)}
 else {
 if(content_owner !== null)
 res.json({ requested_content: content, content_owner: content_owner, status: 800 })}
 else {
  //for orphaned content if there be any
 res.json({ requested_content: content, content_owner: null, status: 804})}})}
else {
//do something if the content does not exist in the database
res.json({ requested_content: null, content_owner: null, status: 803})}}})})




router.get('/users/:sessionid/upload', function(req, res){
  Session.findById(req.params.sessionid, function(err, currentsession){
    if(err) {
      console.log(err)
    } else {
      if(session !== null){
        //get the logged in current user
  User.findById(currentsession.user_id, function(err, currentuser){
  if(err) {
    console.log(err) }
    else {
      //create a new content


    var newcontent = {
      name: req.body.name,
      category: req.body.category,
      creator: currentuser._id,
      price: req.body.price,
      download_url: req.body.download_url,
      preview_url: req.body.preview_url }
Content.create(newcontent, function(err, newcontent){
if(err) {
    console.log(err) }
else { res.json({newcontent: newcontent, currentuser: currentuser, status: 800})}})}})}
else { res.json({status: 804})}}})})

router.get()

module.exports = router 
