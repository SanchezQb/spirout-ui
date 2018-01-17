var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var fs = require('fs')
var sendMail = require('../middleware/mailer')
var Category = require('../models/category')
var User = require('../models/user')
var Content = require('../models/content')
var Session = require('../models/session')
var Token = require('../models/token')
var http = require('http')
var axios = require('axios')
var S3FS = require('s3fs')
var request = require('request')
var AWS = require('aws-sdk');
var s3 = require('s3');
var multiparty = require('connect-multiparty')
var multipartyMilddleware = multiparty()

var s3fsImpl = new S3FS('spirout', {
  accessKeyId: 'AKIAIDPB72QJUBEUDFXA',
  secretAccessKey: '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',
  region: 'us-east-2',
  signatureVersion: 'v4'
  });
// AWS.config.update(
// {accessKeyId: "AKIAJNTW5IJLMF3NCQGQ",secretAccessKey: "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",region: 'us-east-1'})

// var s3Options = {accessKeyId: "AKIAJNTW5IJLMF3NCQGQ",secretAccessKey: "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",region: 'us-east-1'}
// var awsS3Client = new AWS.S3(s3Options);

router.use(multipartyMilddleware)



//  ============ Helper functions =============

function encrypt(text, teststring) {
var salt = teststring;
var hash = bcrypt.hashSync(text, salt);
console.log(hash)
return hash }

function getContent(id) {
Content.findById(id, function(err, content){
if(err) {
console.log(err)}
else { return content }})}


function hashCode(str){
var hash = 0;
if (str.length == 0) return hash;
for (i = 0; i < str.length; i++) {
char = str.charCodeAt(i);
hash = ((hash<<5)-hash)+char;
hash = hash & hash; // Convert to 32bit integer
} return hash;}



//this function is supposed to get the current user from a session
function sessionize(id) {
Session.findById(id, function(err, currentsession){
if(err){
console.log(err) }
else {
console.log('i am' + ' ' + currentsession)
if(currentsession !== null) {
//check for the user currently logged in
User.findById(currentsession.user_id, function(err, currentuser){
if(err){console.log(err) }
else {
//return the current user
var object = {currentsession: currentsession, currentuser: currentuser}
return currentobject }})}
else {return null}}})}

  //  =======================================


//  ============ CRUD for Content ============

//Upload Logic -- CREATE CONTENT
router.post('/:sessionid/content/upload', function(req, res, next){
  console.log("called me")
Session.findById(req.params.sessionid, function(err, currentsession){
if(err) {
console.log(err)}
else {
if(currentsession == null) {
res.json({status: 304, message: 'you need to be logged in to do that'})}
else {
var file = req.files.file
var stream = fs.createReadStream(file.path)
return s3fsImpl.writeFile(file.originalFilename, stream).then(function(data){
fs.unlink(file.path, function(data){
User.findById(currentsession.user_id, function(err, currentuser){
if(err) {
console.log(err)}
else {
let filename
if(file.originalFilename.indexOf(' ') !== -1){
filename = file.originalFilename.replace(/ /g, '+')}
else { filename = file.originalFilename }
var content = {name: req.body.name,filename: file.originalFilename,category: req.body.category_name,type: req.body.type,
              creator: currentuser.name,description: req.body.description, price: req.body.price,download_url: `http://s3.us-east-2.amazonaws.com/spirout/${filename}` }}
Content.create(content, function(err, newcontent){
if(err) {
console.log(err)}
else {
res.json({status: 500, message: 'success', newcontent: newcontent, currentuser: currentuser})}})})})})}}})})


//hackable link to download shit without the auth shit
// router.get('/download/:contentid', function(req, res, next){
// Content.findById(req.params.contentid, function(err, content){
// if(err) {
// console.log(err)}
// else {
// console.log(content.download_url)
// http.get(content.download_url, function(file){
// res.setHeader(`content-disposition`, `attachment; filename=${content.filename}`)
// file.pipe(res)})}})});




//GET THE DETAILS OF A CONTENT
// router.get('/category/:contentid', function(req, res){
// Content.findById(req.params.contentid, function(err, content){
// if(err) {
// console.log(err)
// } else {
// if(content !== null){
// User.findById(content.creator, function(err, content_owner){
// if(err) {
// console.log(err)}
// else {
// if(content_owner !== null){
// res.json({ requested_content: content, content_owner: content_owner, status: 500 }) }
// else {
// res.json({ requested_content: content, content_owner: null, status: 804})} }})}
// else {
// //do something if the content does not exist in the database
// res.json({ requested_content: null, content_owner: null, status: 803}) } }})})


//Delete content - remember to do it with sessions
router.delete('/content/:content_id', function(req, res){
Content.findByIdAndRemove(req.params.content_id, function(err, data){
if(err) {
console.log(err)}
else {
console.log('successfully popped off content')
res.json({status: 500})}})})

// ===================================




// ============= WORKING WITH CARTS ================
//add a product to cart
router.get('/addtocart/:sessionid/:contentid', function(req, res){
  console.log('hello here')
  Session.findById(req.params.sessionid, function(err, currentsession){
  if(err) {
  console.log(err)}
  else {
  
  if(currentsession !== null) {
  Content.findById(req.params.contentid, function(err, content){
   if(err){
     console.log(err)
     res.json({ status: 504, message: 'Something went wrong'})
   } else {
     currentsession.cart.push(content)
     currentsession.save()
     res.json({currentsession: currentsession, status: 500})
   }
  })
  }
  else {res.json({currentsession: null, status: 504, message: 'You need to be logged in to do that'})}}})})
  
  
   // removing an item from cart
  router.get('/removefromcart/:sessionid/:contentid', function(req, res){
  Session.findById(req.params.sessionid, function(err, currentsession){
  if(err) {
  console.log(err)}
  else {
  if(currentsession !== null) {
  //remember to test this shit
  Content.findById(req.params.contentid, function(err, content){
   if(err) {
     console.log(err)
     res.json({ status: 508, message: 'Sorry something went wrong'})
   } else {
     var index = currentsession.cart.indexOf(content)
     currentsession.cart.splice(index, 1)
     currentsession.save()
     res.json({status: 500})}})}
  
  else { res.json({status: 506, message: 'You need to be logged in first'})}}})})
  
  
  
  
  //  checking out || presents the items currently in cart
  router.get('/:sessionid/cart', function(req, res){
  Session.findById(req.params.sessionid, function(err, currentsession){
  if(err) {
  console.log(err)}
  else {
  if(currentsession !== null){
  res.json({cart: currentsession.cart, status: 500, currentuser: currentsession.user_id})}
  else {
  res.json({cart: null, status: 504, message: "Seems like there's nothing in the cart currently"})}}})})
  // ==============================================




 // TOKENIZED ROUUTES =========================================

//this route expects query keys 'uid'(user_id), 'cod',(content_id) and 'authKey'

router.get('/mail/content', function(req, res){
console.log('im here')
User.findById(req.query.uid, function(err, user){
if(err) {
console.log(err) }
else {
Content.findById(req.query.cod, function(err, content){
if(err) {
console.log(err)}
else {
if(content !== null && user !== null){
//main logic goes here
var string = `${req.query.uid}${content._id}idontloveyoulikekanyeloveskanye`
var validator = hashCode(string)
if(validator == req.query.authKey){
//check if that authentication key exists in the db
Token.findOne({value: validator, content_id: content._id},function(err, token){
if(err) {
console.log(err)}
else {
if(token == null || !token.emailed) {
//generate link
var link = `http://localhost:5000/download/content/?uid=${user._id}&cod=${content._id}&authKey=${validator}`
//then send the mail to the user
var message= `<div> <h6> Thanks for purchasing this material, please get the content by clicking the link below </br> <strong> ${link} <strong> </h6><div>`
var plaintext = `hello please change your password by clicking this => ${link}`
var subject = 'Change Password'
sendMail(user.email, message, plaintext, subject)
var token = {value: req.query.authKey,user_id: user._id,content_id: content._id,type: 'Content-Download',valid: true,emailed: true,used: false,count: 1 }
//create a new token || so that the link will be invalidated after its been used and
Token.create(token, function(err, newtoken){
if(err)
{ console.log(err)}
else {
console.log(newtoken)
res.json({status: 500, message: 'success, you should check your mail'})}})}
else {
//do something for already emailed ting.
res.json({status: 504, message: 'This link is broken'})}}})}
else {  //do something if there is a wrong validator
console.log('hello this went bad')
res.json({status: 504, message: 'This is an invalid url' })}}
else { //do something if the content or user dont exists
console.log('another error')
res.json({ status: 504, message: 'The content youre requesting doesnt exist'})}}})}})})


 // download logic
router.get('/download/content', function(req, res, next){
  console.log('iim here')
User.findById(req.query.uid, function(err, user){
if(err) {
console.log(err)}
else {
Content.findById(req.query.cod, function(err, content){
if(err) {
res.json({})
} else {
if(content !== null && user !== null){
//check the validity of the token
var string = `${req.query.uid}${req.query.cod}idontloveyoulikekanyeloveskanye`
var validator = hashCode(string)
console.log(req.query.uid + " " + req.query.cod)
console.log( validator == req.query.authKey)
console.log(req.query.authKey)
console.log(validator)
if(validator == req.query.authKey){
Token.findOne({value: req.query.authKey, content_id: content._id}, function(err, token){
if(err){console.log(err)}
else {console.log(token)
if(token !== null && token.emailed && !token.used && token.valid){
http.get(content.download_url, function(file)  {
  res.setHeader(`content-disposition`, `attachment; filename=${content.filename}`)
  file.pipe(res)
  token.valid = false 
  token.used = true
  token.save()
})
  
}
else {//do something if the token is invalid
res.json({status: 504, message: 'this link is invalid(the access token either doesnt exist or has been used up)'})}}})}
else {res.json({status: 504, message: 'this link is definitely invalid'})}}
else {//do something if the user ids are invalid
res.json({status: 504, message: 'the content or user doesnt exist'})}}})}})})



router.get('/bulk/mail/content', function(req, res){
  User.findById(req.query.uid, function(err, user){
  if(err) {
  console.log(err)}
  else {
  if(user !== null) {
  //validate the authKey
  var cod = req.query.cods[req.query.position]
  var string = `${req.query.uid}${cod}idontloveyoulikekanyeloveskanye`
  var validator = hashCode(string)
  if(validator == req.query.authKey){
  //check if the validator is false
  var contents = req.query.cods
  contents.forEach(id => {
  Content.findById(id, function(err, content){
  if(err){ console.log(err) }
  else {
  if(content !== null){
  //the content exists
  Token.findOne({value: req.query.authKey, content_id: content._id},function(err, token){
  if(err) {
  console.log(err)}
  else {
  if(token == null || !token.emailed) {
  //generate link
  var string = `${req.query.uid}${content._id}idontloveyoulikekanyeloveskanye`
  var auth = hashCode(string)
  var link = `http://localhost:5000/download/content/?uid=${req.query.uid}&cod=${content._id}&authKey=${auth}`
  //then send the mail to the user
  var message= `<div> <h6> Thanks for purchasing ${content.name}, please get the content by clicking the link below </br> <strong> ${link} <strong> </h6><div>`
  var plaintext = `Thanks for buying, you can them by clicking the  => ${link}`
  var subject = 'Thank You for purchasing'
  console.log(user.email)
  sendMail(user.email, message, plaintext, subject)
  var token = { value: auth, user_id: user._id, content_id: content._id, type: 'Content-Download', valid: true, emailed: true, used: false, count: 1 }
  //create a new token || so that the link will be invalidated after its been used and
  Token.create(token, function(err, newtoken){
  if(err) { console.log(err)}
  else {
  console.log(newtoken)
  // res.json({status: 500, message: 'success, you should check your mail'})
  }})}
  else {
  //do something for already emailed ting.
  console.log('thats false')
  // res.json({})
  }}})}
  else {
  //the content doesnt exists
  console.log('a mood')}}})})
  res.json({ status: 400, message: 'This should work just fine if youre using this for the first time'}) }
  else { //do something if this validator is false
  res.json({message: 'validator doesnt exists', status: 400})}}
  else {//do something if the user thing doesnt exist
  res.json({ message: 'the user doesnt exists', status: 400})}}})})




module.exports = router
