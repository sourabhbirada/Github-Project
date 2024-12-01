const mongoose = require('mongoose');
const { Schema} = mongoose




const userschema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String
    },
    repositoties: {
        default : [],
        type: Schema.Types.ObjectId,
        ref:"Repo"
    },
    followedusers:{
        default : [],
        type: Schema.Types.ObjectId,
        ref:"Repo"
    },
    starrepos:{
        default : [],
        type: Schema.Types.ObjectId,
        ref:"Repo"
    }

})

const User = new Model('User' , userschema)

module.exports = User