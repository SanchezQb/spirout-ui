var Session = require('./models/session')
var Content = require('./models/content')
var User = require('./models/user')


// sessionize = function (id){
//   if (id){
//     console.log('called')
//    Session.findOne({_id: id}, function(err, currentsession){
//     if(err)
//     { console.log(err)}
//     else {
//       console.log(currentsession)
//     if(currentsession !== null) {
//     //check for the user currently logged in
//     User.findOne({username: currentsession.user_id}, function(err, currentuser){
//     if(err){
//     console.log(err) }
//     else {
//     //return the current user
//     var object = {currentsession: currentsession, currentuser: currentuser}
//     return object }})}
//       else {
//     return null
// }}})
// } else {
//   return null
// }}

let slopps
function getContent(id, callback) {
  Content.findById(id, function(err, content){
  if(err) {
  console.log(err)}
  else {
   slopps = content
   return callback(null, content)
 }})}

  module.exports = getContent
