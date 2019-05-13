const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userName: {
    type: String
  },
  profilePic: {
    type: String,
    default: "https://www.iamashad.tech"
  },
  date: {
    type: String,
    default: Date.now
  }
});

module.exports = Person = mongoose.model("person", PersonSchema);
