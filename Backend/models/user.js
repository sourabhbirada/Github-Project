const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userschema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User', 
        },
    ],
    repositories: [
        {
            type: Schema.Types.ObjectId,
            ref: "Repo",
        },
    ],
});

const User = model("User", userschema);

module.exports = User;
