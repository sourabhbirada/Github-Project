const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reposchema = new Schema({
  reponame: {
    type: String,
    unique: true,
    required: true,
  },
  desc: {
    type: String,
  },
  visibility: {
    type: Boolean,
    default: true,
  },
  files: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
});

const Repo = model("Repo", reposchema);

module.exports = Repo;
