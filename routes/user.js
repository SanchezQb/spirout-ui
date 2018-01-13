var express = require('express')
var bcrypt = require('bcryptjs')
var router = express.Router()
var fs = require('fs')
var Category = require('../models/category')
var Content = require('../models/content')
var User = require('../models/user')
var Session = require('../models/session')
var Token = require('../models/token')
var sendMail = require('../middleware/mailer')
var http = require('http')
var S3FS = require('s3fs')
var multiparty = require('connect-multiparty')
var multipartyMilddleware = multiparty()

var s3fsImpl = new S3FS('truggurban', {
    accessKeyId: 'AKIAJ367LDQ27Q37QQJQ' ,
    secretAccessKey: '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'
});


//  ================ HELPER FUNCTIONS =============================================================

function encrypt(text) {
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(text, salt);
return hash }


function sessionize(id) {
Session.findById(id, function(err, currentsession){
if(err)
{ console.log(err)}
else {
console.log(currentsession)
if(session !== null) {
//check for the user currently logged in
User.findOne({username: currentsession.user_id}, function(err, currentuser){
if(err){
console.log(err) }
else {
//return the current user
var object = {currentsession: currentsession, currentuser: currentuser}
return currentobject }})}
else {return null}}})}


function hashCode(str){
var hash = 0;
if (str.length == 0) return hash;
for (i = 0; i < str.length; i++) {
char = str.charCodeAt(i);
hash = ((hash<<5)-hash)+char;
hash = hash & hash;}
return hash;}


function generateLink(baseurl, user) {
let url
console.log('Hello')
var auth = hashCode(user.forgot_password)
console.log('this is auth' + ' ' + auth)
url = baseurl + "/" + user._id + '/change/password' + '?' + 'user' + '=' +  user.forgot_password + "&" + 'auth' + '=' + auth + '&' + 'forgot' + '=' + 'TRUE'
return url }

// ========================================================================================================






//  ====================== SIGN UP AND LOGIN LOGIC ============================

//Sign up logic
router.post('/users/signup', function(req, res){
//new user object
const newuser = { username: req.body.username.toLowerCase().trim(),firstname: req.body.firstname.trim(),lastname: req.body.lastname.trim(), email: req.body.email.trim(),
password: encrypt(req.body.password),isAdmin: false,confirmed_email: false,passwordcount: 1}
//Check if the username and email are available
User.find({username: newuser.username}, function(err, unavailableusers){
if(err){
console.log(err)}
else {
if(unavailableusers.length !== 0 ){
//if the username is unavailable
res.json({status:607, message: 'username is unavailable'})}
else {
User.find({email: newuser.email}, function(err, users_unav){
if(err) {
console.log(err)}
else {
if(users_unav.length !== 0){
res.json({status:608, message: 'email is already taken'}) }
else {
//create a new user
User.create(newuser, function(err, anewuser){
if(err) {
console.log(err) }
else{
//create a new session
Session.create({user_id: anewuser._id}, function(err, newsession){
if(err){
console.log(err)}
else {
//send the email to confirm email and then create the token
var string = `${anewuser._id}${anewuser.username}${anewuser.confirm_email}idontloveyoulikekanyeloveskanye`
var auth = hashCode(string)
var url = `http://localhost:5000/confirm/email?uid=${anewuser._id}&authKey=${auth}`
var message= `<div> <h6> Hello, here's the link to confirm your email </br> <strong> ${url} <strong> </h6><div>`
var plaintext = `hello please change your email => ${url}`
var subject = 'Confirm Email'
sendMail(anewuser.email, message, plaintext, subject)
var token = {value: auth,user_id: anewuser._id,content_id: null,type: 'Confirm-Email',valid: true,emailed: true,used: false,count: 1}
Token.create(token, function(err, newtoken){
if(err) {
console.log(err)}
else {res.json({user: anewuser, session_id: newsession._id, status:600, token:newtoken})}})}})}})}}})}}})})



//Login Logic ================================

router.post('/users/login', function(req, res){
var username = req.body.username.toLowerCase().trim()
var password = req.body.password.trim()
//check for the username
User.findOne({username: username}, function(err, user){
if(err) {
console.log(err)}
else {
if (user !== null) {
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
res.json({user: user, status: 506, message: 'The passwords do not match'})}}
else {
//ask to create account
res.json({status: 504, message: 'Nah we dont have anyone we that username'})}}})})


//  =========================================================================================================





//  ====================== GET USERS PROFILE ==========================

//Show a user ( RETURN THE CURRENT USER AND THE REQUESTED USER)
router.get('/users/:username/:sessionid', function(req, res){
User.findOne({username: req.params.username.toLowerCase().trim()}, function(err, user){
if(err) {
console.log(err)}
else {
if(user !== null) {
// gets all the content belonging to a user
Content.find({creator: user._id}, function(err, users_content){
if(err) {
console.log(err)}
else {
Session.findById(req.params.sessionid, function(err, currentsession){
if(err) {
console.log(err)
} else {
if(currentsession == null) {
res.json({status: 500, requested_user: user, req_users_content: users_content, currentuser:null, currentsession: null})}
else {
User.findById(currentsession.user_id, function(err, currentuser){
if(err){
console.log(err)
}
else {
res.json({status: 500, requested_user: user, req_users_content: users_content, currentuser: session.currentuser, currentsession: session.currentsession })}})}}})}})}
else {
//do something if the user doesn't exist
res.json({status: 504, message: 'That user doesnt exist'})
}}})})

//  ========================================


//  ========================= UPDATE LOGIC ===========================

// getting a user to be edited
router.get('/:sessionid/edit', function(req, res){
Session.findById(req.params.sessionid, function(err, currentsession){
if(err) {
console.log(err)}
else {
if(currentsession == null) {
res.json({currentuser: null, status: 508})}
else {
res.json({ currentuser: session.currentuser, status: 500})
}}})})

  //EDIT USER LOGIC
router.put('/:sessionid/edit', function(req, res){
var session = sessionize(req.params.sessionid)
if(session !== null) {
User.findByIdAndUpdate(session.currentuser._id, {$set:req.body}, function(err, updateduser){
if(err) {
console.log(err) }
else {
res.json({status: 500, message: 'successfully updated', currentuser: updateduser})}})}
else { res.json({ status: 506, message: "you're not authorized to do that", currentuser: null})}})


//  ==============================================================================





// LOGOUT AND DELETE USER LOGIC ===================================

//LOGGING OUT A USER
router.get('/:sessionid/logout', function(req, res){
Session.findById(req.params.sessionid, function(err, currentsession){
if(err){
console.log(err)
} else {
if(currentsession == null) {
res.json({ message: 'Theres no one in session', status: 504})
} else {
currentsession.remove()
res.json({status: 500})
}}})})


// DELETING A USER
router.get('/delete/account/:user_id', function(req, res, next){
User.findById(req.params.user_id, function(err, user){
  if(err) { console.log(err)}
else {
if( user == null){
  res.json({ message: 'This user doesnt exist', status: 504})
} else {
user.remove()
//Delete content by the user
Content.find({creator: req.params.user_id}, function(err, contents){
if(err) {
console.log(err) }
else {
contents.forEach(content => {
content.remove() })
//delete any session associated with user
Session.find({user_id: req.params.user_id}, function(err, sessions){
if(err) {
console.log(err) }
else {
sessions.forEach(session => {
session.remove()})
res.json({ status: 500})}})}})}}})})

//  =====================================










// ==================== FORGOT PASSWORD & EMAIL VALIDATION ======================================

router.get('/confirm/email', function(req, res){
User.findById(req.query.uid, function(err, user){
if(err){
console.log(err) }
else {
   if(user !== null) {
var string = `${req.query.uid}${user.username}${user.confirm_email}idontloveyoulikekanyeloveskanye`
var validator = hashCode(string)
if(validator == req.query.authKey){
Token.findOne({value: req.query.authKey}, function(err, token){
if(err) { console.log(err)}
else {
if(token !== null && token.emailed && !token.used && token.valid){
token.user = true
token.valid = true
token.remove() //you could remove this instead
user.confirmed_email = true
user.save()
res.json({status: 500, message: 'Nice one, thanks for confirming your email'})}
else { res.json({status: 504, message: 'This link might be broken'}) }}})}
else { //do something if the authkey is not the one expected
res.json({status: 504, message: 'This URL seems to be invalid'})}}
else { //do something if the user doesnt exist
res.json({status: 508, message: 'This user doesnt exist'})}}})})




router.get('/users/forgotpassword', function(req, res){
User.findOne({email: req.body.email}, function(err, user){
if(err) {
console.log(err)}
else {
if(user !== null){
res.json({user: user, status:500})}
else {
res.json({message: "Dont think we have anyone with this link", status: 407})}}})})




//send the email to the requesting fella
router.get('/changepassword/:user_id', function(req, res){
User.findById(req.params.user_id, function(err, user){
if(err){ console.log(err)}
else {
if(user !== null ) {
var auth = hashCode(`${user._id}${user.username}${user.passwordcount}idontloveyoulikekanyeloveskanye`)
var url = `http://localhost:5000/reset/password/?uid=${user._id}&authKey=${auth}`
var token = { value: auth, user_id: user._id, content_id: null, type: 'Password-Reset', valid: true, emailed: true, used: false, count: 1}
var message= `<div> <h6> Hello, here's the link to change your shit bihhhhh </br> <strong> ${url} <strong> </h6><div>`
var plaintext = `hello please change your password by clicking this => ${url}`
var subject = 'Change Password'
sendMail(user.email, message, plaintext, subject)
Token.create(token, function(err, newtoken){
if(err) { console.log(err)}
else { res.json({status: 'sent'})}})}
else { res.json({message: 'A new thing'})}}})})



//This route expects the id of the user and validates it by hashing it and the username of the guy
router.get('/reset/password', function(req, res){
User.findById(req.query.uid, function(err, user){
if(err) {
console.log(err)}
else {
if(user !== null) {
//validate the token
var string = `${req.query.uid}${user.username}${user.passwordcount}idontloveyoulikekanyeloveskanye`
var validator = hashCode(string)
if(validator == req.query.authKey){
Token.findOne({value: req.query.authKey}, function(err, token){
  if(err) { console.log(err) }
else {
if(token !== null && token.emailed && !token.used && token.valid){
token.used = true
token.valid = false
token.remove()
user.passwordcount = user.passwordcount + 1
user.save()
res.json({status: 500, message: 'feel free to render him the reset password form'})}
  else { //do something if the token has expired or doesnt exists
res.json({status: 506, message: 'hey man, the auth token might be wrong(might have been used up)'})}}})}
else { //do something if the validator is wrong
res.json({status: 504, message: 'hey man, this link might be broken'})}}
else { //do something if the user doesnt exists
res.json({status: 508, message: 'this user doesnt exists'})}}})})

//change the password actually
router.put('/reset/password/:userid', function(req, res){
var hash = encrypt(req.body.password)
User.findByIdAndUpdate(req.params.userid, {$set: {password: hash}},function(err, user){
if(err) { console.log(err) }
else { res.json({status: 500, user: user})}})})


//  =======================================================================


module.exports = router
