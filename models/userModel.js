const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
 fname:{
    type: String,
    require:true
 },
 lname:{
    type: String,
    require:true
 },
  email: {
    type: String,
    require:true,
    unique:true
  },
  password: {
    type:String,
    require:true
  }
});

userSchema.pre("save", function(next){
  let user = this;

  bcryptjs.genSalt()
    .then(salt=>{
      bcryptjs.hash(user.password,salt)
        .then(hashedPwd=>{
          user.password = hashedPwd;
          next();
        })
        .catch(err=>{
          console.log( `Error occured when salting ... ${err}`);
        });
    })
    .catch(err=>{
      console.log( `Error occured when salting ... ${err}`);
    });
});

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;
