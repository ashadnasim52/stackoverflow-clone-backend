const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "person"
  },
  userName: {
    type: String,
    required: true,
    max: 50
  },
  website: {
    type: String
  },
  Country: {
    type: String
  },
  languages: {
    type: [String],
    required: true
  },
  portfolio: {
    type: String
  },
  workrole: [
    {
      role: {
        type: String,
        required: true,
        max: 100
      },
      company: {
        type: String,
        max: 50
      },
      country: {
        type: String,
        max: 50
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      details: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    insta: {
      type: String
    }
  }
});

module.exports = profile = mongoose.model("profile", ProfileSchema);
