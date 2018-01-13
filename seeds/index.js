var Category = require('../models/category')

const objects = [
  { name: 'Society', icon_url: 'https://res.cloudinary.com/laclic-services/image/upload/v1515666607/icons-07_pffghc.png'},
  {name: 'Social Media', icon_url: 'https://res.cloudinary.com/laclic-services/image/upload/v1515668865/icons-02_a32pka.png'},
  {name: 'Science', icon_url: 'https://res.cloudinary.com/laclic-services/image/upload/v1515668676/icons-06_aqhpvh.png'},
  {name: 'Business', icon_url: 'https://res.cloudinary.com/laclic-services/image/upload/v1515666567/icons-03_xqhtwv.png'},
  {name: 'Health Lifestyle', icon_url: 'https://res.cloudinary.com/laclic-services/image/upload/v1515668675/icons-05_sgdcoq.png'},
  {name: 'Relationship', icon_url: 'https://res.cloudinary.com/laclic-services/image/upload/v1515666575/icons-04_z275qv.png'},
]

function Seed() {
objects.forEach(object => {
Category.create(object, function(err, newobject){
if(err){
console.log(err)}
else {
console.log(`added ${object.name} to the db`)
}})})}

module.exports = Seed
