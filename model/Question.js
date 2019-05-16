const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  main: {
    type: String,
    required: true
  },
  upvote: [],
  authorId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  comments: [
    {
      message: {
        type: String,
        required: true
      },
      userName: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  },
  answers: [
    {
      id: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = Question = mongoose.model("question", QuestionSchema);
