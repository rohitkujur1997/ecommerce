const mongoose = require('mongoose'); //to create new schema for storing name email password
const crypto =require('crypto'); //core node module to hash the password
//const uuidv1 = require('uuid/v1') //to generate unique strings
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  email:{
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  hashed_password:{
    type: String,
    required: true
  },
  about:{
    type: String,
    trim: true
  },
  salt: String,
  role:{
    type: Number,
    default: 0
  },
  history:{
    type: Array,
    default: []
  }
},{timestamps: true});

//virtyal field
userSchema.virtual('password')
.set(function(password){
  this._passwrd=password;
  this.salt=uuidv1();
  this.hashed_password=this.encryptPassword(password);
})
.get(function(){
  return this._password;
})

userSchema.methods={
  encryptPassword: function(password){
    if(!password) return '';
    try{
      return crypto.createHmac('sha1',this.salt)
                      .update(password)
                      .digest('hex');
    }catch(err){
      return "";
    }
  }
};

module.exports=mongoose.model("User",userSchema);//later to create new user
