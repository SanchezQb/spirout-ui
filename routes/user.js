var express = require('express')
var bcrypt = require('bcryptjs')
var router = express.Router()
var Category = require('../models/category')
var User = require('../models/user')
var Session = require('../models/session')


function encrypt(text) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(text, salt);
  return hash
}


function sessionize(id) {
  Session.findById(id, function(err, currentsession){
    if(err)
    { console.log(err)}
    else {
    if(session !== null) {
    //check for the user currently logged in
    User.findOne({username: currentsession.user_id}, function(err, currentuser){
    if(err){
    console.log(err) }
    else {
    //return the current user
    var object = {currentsession: currentsession, currentuser: currentuser}
    return currentobject }})}
      else {
    return null
}}})}


function generateLink(baseurl, user) {
  var salt = bcrypt.genSaltSync(15)
  User.findById(user._id, function(err, user){
    if(err) {
      console.log(err)
    } else {
      user.forgot_password = salt
      user.save()
      var url = baseurl + "/" + user._id + '/change/password' + "/" + user.forgot_password + "/" + bcrypt.genSaltSync(10)
      return url
    }})}

//INDEX ROUTE
// router.get('/', function(req, res){
//     Category.find({}, function(err, categories){
//       if(err){
//         console.log(err)
//       } else {
//         res.json({ categories: categories})
// }})})



//create a new user
router.post('/users/signup', function(req, res){

//new user object
  const newuser = {
    username: req.body.username.toLowerCase().trim(),
    firstname: req.body.firstname.trim(),
    lastname: req.body.lastname.trim(),
    email: req.body.email.trim(),
    password: encrypt(req.body.password),
    isAdmin: false }

//Check if the username and email are available
 User.find({username: newuser.username}, function(err, unavailableusers){
   if(err){
     console.log(err)
   } else {
  if(unavailableusers.length !== 0 ){
  //if the username is unavailable
  res.json({status:607, message: 'username is unavailable'})}
  else {
  User.find({email: newuser.email}, function(err, users_unav){
  if(err) {
      console.log(err)
    } else {
    if(users_unav.length !== 0){
    res.json({status:608, message: 'email is already taken'}) }
    else
     {
    //create a new user
    User.create(newuser, function(err, anewuser){
    if(err) { console.log(err) }
    else
    {
    //create a new session
     Session.create({user_id: anewuser._id}, function(err, newsession){
      if(err){ console.log(err)
              } else {
    res.json({user: anewuser, session_id: newsession._id, status:600})
    }})}})}}})}}})})



//Login Logic
router.post('/users/login', function(req, res){
  var username = req.body.username.toLowerCase().trim()
  var password = req.body.password.trim()

  //check for the username
  User.findOne({username: username}, function(err, user){
    if(err) {
      console.log(err)
    } else {
  if (user !== undefined && user !== null) {
    //the next line checks for password
  var validate = bcrypt.compareSync(password, user.password)
  if (validate) {
      //create a new session
  Session.create({user_id: user._id}, function(err, newsession){
  if(err) {
  console.log(err) }
  else {
    //successful login
  res.json({ session_id: newsession._id, user: user, status: 500})}})}
  else {
  //Do something if the passwords do not match || prompt a forgot password ting
  res.json({user: user, status: 506})}}
  else {
    //ask to create account
  res.json({status: 504})
    }}})})



//Show a user
router.get('/users/:username/:sessionid', function(req, res){
  User.findOne({username: req.params.username.toLowerCase().trim()}, function(err, user){
    if(err) {
      console.log(err)
    } else {
      if(user !== undefined && user !== null) {
        Content.find({creator: user._id}, function(err, users_content){
          if(err) {
            console.log(err)
          } else {
            var session = sessionize(req.params.sessionid)
            if (session == null) {
              res.json({requested_user: user, req_users_content: users_content, currentuser:null, currentsession: null})
            } else {
            res.json({requested_user: user, req_users_content: users_content, currentuser: session.currentuser, currentsession: session.currentsession })
}}})}}})})


router.get('/users/forgotpassword', function(req, res){
  User.findOne({username: req.body.email}, function(err, user){
    if(err) {
      console.log(err)
    } else {
      if(user !== null){
        res.json({user: user, status:400})
      } else {
    res.json({user: null, status: 407})}}})})



router.post('/users/:id/email/link', function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err) {
      console.log(err)
    } else {
      var link = generateLink(req.baseUrl, user)
}})})

module.exports = router
