const express = require("express");
const router = express.Router();
const passport = require("passport");

// P16721

const Question = require("../../model/Question");
const Answer = require("../../model/Answer");

/**
 * question
 * //ask
 * //update
 * //see all question
 * //delete one question
 *
 * same apply for answer and comment
 *  */

//      @type       POST
//      @route      /api/question/ask
//      @desc       route for posting question
//      @access     PRIVATE

router.post(
  "/ask",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title, main, authorName } = req.body;
    const authorId = req.user.id;
    Question.findOne({ title })
      .then(question => {
        if (question) return res.json({ question: "question already asked" });
        const newQuestion = new Question({
          title,
          main,
          authorName,
          authorId
        });
        newQuestion
          .save()
          .then(isSaved => {
            if (!isSaved)
              return res.json({ question: "error in saving  in database" });
            const newAnswer = new Answer({
              QuestionId: newQuestion._id,
              authorId: authorId
            });
            newAnswer
              .save()
              .then(result => {
                if (!result)
                  return res.json({
                    question: "question not saved in database"
                  });

                return res.json({ question: "question saved in database" });
              })
              .catch(err => {});
          })
          .catch(err => {
            console.log(`error occured ${err}`);
          });
      })
      .catch(err => {
        console.log(`not able to find ${err}`);
      });
  }
);

//      @type       DELETE
//      @route      /api/question/delete/:id
//      @desc       route for deleting question
//      @access     PRIVATE

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //authenticated user and finding question by id which is provided in the url
    Question.findOne({ _id: req.params.id })
      .then(question => {
        if (!question) return res.json({ question: "no question exists" });
        //go ahead ,question found
        if (question.authorId == req.user.id) {
          //the person who wants to delete this question is SAME PERSON who asked the question
          question
            .delete()
            .then(isDeleted => {
              //question deleted or not checking and sending response
              if (!isDeleted)
                return res.json({ question: "unable to delete this question" });
              return res.json({ question: "question deleted" });
            })
            .catch(err => {
              console.log(`something wrong ${err}`);
            });
        } else {
          console.log(question.authorId);
          console.log(req.user.id);

          //the person who wants to delete this question is  NOT SAME PERSON who asked the question
          return res.json({
            question:
              "Since you had not asked the question, So you cannot delete it"
          });
        }
      })
      .catch(err => {
        console.log(`unable to find question ${err}`);
      });
  }
);

//      @type       UPDATE
//      @route      /api/question/update/:id
//      @desc       route for UPDATING question
//      @access     PRIVATE

router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title, main } = req.body;
    //authenticated user and finding question by id which is provided in the url

    Question.findOne({ _id: req.params.id })
      .then(question => {
        if (!question)
          return res.status(404).json({ question: "no question found" });
        //go ahead question found
        if (question.authorId == req.user.id) {
          //the person who wants to UPDATE this question is SAME PERSON who asked the question
          if (title) question.title = title;
          if (main) question.main = main;
          question
            .save()
            .then(isSaved => {
              if (!isSaved) return res.json({ message: "unbale to update" });
              return res.json(question);
            })
            .catch(err => {
              console.log(`error while saving ${err}`);
            });
        } else {
          //the person who wants to UPDATE this question is  NOT SAME PERSON who asked the question
          return res.status(400).json({
            message:
              "you are not the person who had asked this question,so no update"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
);

//      @type       GET
//      @route      /api/question/all
//      @desc       route for GETTING ALL  questions
//      @access     PRIVATE

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.find()
      .then(questions => {
        if (!questions)
          return res.status(404).json({ question: "no question found" });
        //yeah questions avaliable
        res.json({ questions: questions });
      })
      .catch(err => {
        console.log(`error on querying question`);
      });
  }
);

//      @type       GET
//      @route      /api/question/one/:id
//      @desc       route for GETTING ONE   question by its id
//      @access     PRIVATE

router.get(
  "/one/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findOne({ _id: req.params.id })
      .then(question => {
        if (!question)
          return res
            .status(404)
            .json({ question: "thier has been no question by this id" });
        return res.json({ question: question });
      })
      .catch(err => {
        console.log(`erro on querying question`);
      });
  }
);

//      @type       POST
//      @route      /api/question/one/:id/upvote
//      @desc       route for UPVOTING  ONE   question by its id
//      @access     PRIVATE

router.post(
  "/one/:id/upvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findOne({ _id: req.params.id })
      .then(question => {
        let action = "none";
        if (!question) return res.json({ question: "no question found" });
        //question available then upvote

        if (question.upvote.length < 1) {
          //no upvote before
          question.upvote.push(req.user.id);
          action = "upvote";
        } else {
          question.upvote.map((idOfUpvoter, index) => {
            if (idOfUpvoter == req.user.id) {
              //user already upvoted
              //so downvote this time
              question.upvote.splice(index, 1);
              action = "downvote";
            } else {
              question.upvote.push(req.user.id);
              action = "upvote";
            }
          });
        }

        question
          .save()
          .then(isSaved => {
            if (!isSaved)
              return res.json({ question: "unable to save", action });
            return res.json({ question: " save", action });
          })
          .catch(err => {
            console.log(`error while saving ${err}`);
          });
      })
      .catch(err => {
        console.log("error in querying question ${err");
      });
  }
);

//      @type       POST
//      @route      /api/question/one/:id/downvote
//      @desc       route for DOWNVOTING  ONE   question by its id
//      @access     PRIVATE
// ! forget this route need to design from base

router.post(
  "/one/:id/downvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findOne({ _id: req.params.id })
      .then(question => {
        let action = "none";
        if (!question) return res.json({ question: "no question found" });
        //question available then downvote

        if (question.upvote.length < 1) {
          //no upvote before,so leave him
          action = "none";
        } else {
          question.upvote.map((idOfUpvoter, index) => {
            if (idOfUpvoter == req.user.id) {
              //user already upvoted
              //so downvote this time
              question.upvote.splice(index, 1);
              action = "downvote";
            } else {
              question.upvote.push(req.user.id);
              action = "upvote";
            }
          });
        }

        question
          .save()
          .then(isSaved => {
            if (!isSaved)
              return res.json({ question: "unable to save", action });
            return res.json({ question: " save", action });
          })
          .catch(err => {
            console.log(`error while saving ${err}`);
          });
      })
      .catch(err => {
        console.log("error in querying question ${err");
      });
  }
);

//      @type       POST
//      @route      /api/question/one/:id/comment
//      @desc       route for adding comment to a   question by its id
//      @access     PRIVATE

router.post(
  "/one/:id/comment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { message, userName } = req.body;
    const userId = req.user.id;
    Question.findOne({ _id: req.params.id })
      .then(question => {
        if (!question)
          return res.status(404).json({ message: "no question find" });
        //question finded , now add commnet
        let action = "none";
        const newComment = {
          message,
          userName,
          userId
        };
        if (question.comments.length < 1) {
          //their is no comment before

          question.comments.push(newComment);
          action = "pushed";

          question
            .save()
            .then(result => {
              return res.json({ comment: action });
            })
            .catch(err => {
              return res.json({ comment: action });
            });
        }
      })
      .catch(err => {
        console.log(`Unable to query Question ${err}`);
      });
  }
);

module.exports = router;
