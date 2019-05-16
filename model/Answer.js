const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const answerSchema = new Schema({
  QuestionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  authorId: {
    type: String
  },
  answers: [
    {
      answer: {
        type: String,
        required: true
      },
      authorName: {
        type: String
      },
      authorId: {
        type: String,
        required: true
      },
      authorProfilePic: {
        type: String
      },
      vote: {
        sum: {
          type: Number
        },
        upvote: [],
        downvote: []
      },
      comments: [
        {
          authorId: {
            type: String,
            required: true
          },
          authorName: {
            type: String
          },
          message: {
            type: String,
            required: true
          }
        }
      ]
    }
  ]
});

module.exports = Answer = mongoose.model("answer", answerSchema);
