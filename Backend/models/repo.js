const mongoose = require('mongoose');
const {Schama} = require('mongoose');
const { boolean, required } = require('yargs');



const reposchma = new Schama({
    reponame:{
        type:String,
        unique:true
    },
    desc: {
        type:String
    },
    content: {
        type:String
    },
    visibilty:{
        type:boolean
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

const Repo = new Model('Repo' , reposchma)

module.exports = Repo