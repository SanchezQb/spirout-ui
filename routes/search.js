var express = require('express')
var Request = require('../models/request')
var Content = require('../models/content')
var Category = require('../models/category')
var Session = require('../models/session')
var User = require('../models/user')
var router = express.Router()

router.get('/search/:query', function(req, res){
  //check the querystring
  if(req.params.query.indexOf('-') == -1) {

    var phase = req.params.query.toLowerCase()
    var phase1 = phase.trim()
    var first = phase1.charAt(0).toUpperCase()
    var second = phase1.slice(1, phase1.length)
    var query = first.concat(second)}
else {
    var newquery = req.params.query.toLowerCase().trim()
    var newquery1 = newquery.replace(/-/g, ' ')
    var first = newquery1.charAt(0).toUpperCase()
    var second = newquery1.slice(1, newquery1.length)
    var query = first.concat(second)}

Content.find({}, function(err, contents){
if(err) {
console.log(err)}
else {
var results = contents.filter(content => content.filename.indexOf(query) !== -1 || content.name.indexOf(query) !== -1)
if(results.length > 0) {
res.json({status: 500, message: 'found a few things', results: results})}
else { //do something if the query doesnt exist
res.json({status: 504, message: 'content doesnt exist in the db', results: []})
}}})})




router.post('/:sessionid/request', function(req, res){
Session.findById(req.params.sessionid, function(err, session){
if(session !== null){
//find the user logged in and then get create the request
User.findById(session.user_id, function(err, user){
if(err) {
    console.log(err)}
else {
    //check if the user has confirmed his email
if(user.isAdmin ) {
  //creae user object for the new request
var ruser = {
    name: `${user.firstname}${user.lastname}`,
    email: user.email,
    phone_num: user.phone,
    username: user.username}

//create new request object
var request = {
  topic: req.body.topic,
  amount_of_words: req.body.amount_of_words,
  category: req.body.category,
  type: req.body.type,
  duration: req.body.duration,
  description: req.body.description,
  requesting_user: ruser }

//actually create
Request.create(request, function(err, newrequest){
if(err) {
console.log(err)}
else {
res.json({request: request, user: ruser, session: session })}}) }
else { //do something if the user isnt admin
res.json({ status: 506, message: 'You need to be an admin to do that'})}}})}
else { //do something if the user isn't logged in
res.json({ status: 504, message: 'You need to be logged in to do that', })}})})




router.get('/:sessionid/requests', function(req, res){
Session.findById(req.params.sessionid, function(err, session){
if(err){
console.log(err)}
else {
if(session == null){
res.json({status: 504, message: 'You need to be logged in to do that'})}
else {
User.findById(session.user_id, function(err, user){
if(err){
console.log(err)}
else {
if(user == null || !user.isAdmin){
  console.log(user)
res.json({status: 504, message: 'You do not have administrative duties'})
} else {
Request.find({}, function(err, requests){
if(err){
console.log(err)}
else { res.json({ status: 500, requests: requests})}})}}})}}})})

module.exports = router
