require('dotenv').config();
const path = require('path');

module.exports.main = (req, res, next) => {
  let options = {
    root: path.join(__dirname, '/../public/')
  };
 res.sendFile('index.html', options, (err) => {
   if(err){
     next(err);
   } else {
     console.log("Ember is cool");
   }
 });
}
