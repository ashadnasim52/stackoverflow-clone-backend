const express = require("express");
const passport = require("passport");

const Question = require("../../model/Question");
const Answer = require("../../model/Answer");

const router = express.Router();

/**
 * Answer task
 * //add answer for question
 * //update answer
 * //delete answer
 * //view all answer
 *
 * //add comment
 * //delete comment
 * //update comment
 *
 * upvote
 * downvote
 */

//      @type       POST
//      @route      /api/answer/add/:q_id
//      @desc       FOR ADDING ANSWER TO THE QUESTION
//      @access     PRIVATE

router.post(
  "/add/:q_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Answer.findOne({ QuestionId: req.params.q_id })
      .then(answer => {
        console.log(answer);

        if (!answer)
          return res.status(404).json({ message: "no question asked" });

        //question exists
        const newAnswer = {
          answer: req.body.answer,
          authorName: req.body.authorName,
          authorId: req.user.id,
          authorProfilePic: req.user.profilepic
        };
        answer.answers.push(newAnswer);
        answer
          .save()
          .then(isSaved => {
            if (!isSaved) return res.json({ message: "unable to add answer" });
            return res.json({ message: "answer added" });
          })
          .catch(err => {
            console.log(`error while saving ${err}`);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
);

//      @type       GET
//      @route      /api/answer/all/:q_id
//      @desc       FOR VIEWING ALL  ANSWER TO THE QUESTION
//      @access     PUBLIC

router.get("/all/:q_id", (req, res) => {
  Answer.findOne({ QuestionId: req.params.q_id })
    .then(answer => {
      if (!answer) return res.json({ message: "no answer available" });
      return res.json(answer.answers);
    })
    .catch(err => {
      console.log(err);
    });
});

//      @type       POST
//      @route      /api/answer/update/:q_id/:a_id
//      @desc       FOR UPDATING ANSWER TO THE QUESTION BY ID
//      @access     PRIVATE

router.post(
  "/update/:q_id/:a_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Answer.findOne({ QuestionId: req.params.q_id })
      .then(answer => {
        let action = "none";
        if (!answer)
          return res
            .status(404)
            .json({ message: "no answer for this question" });

        //their is answers
        if (answer.answers < 1) {
          //their is no single answer for this question
          return res.status(404).json({ message: "no answer for update" });
        } else {
          //thier is answer/answers

          answer.answers.map((oneAnswer, index) => {
            if (oneAnswer._id == req.params.a_id) {
              //the answer which you want to update is the this answer
              if (req.body.answer) {
                oneAnswer.answer = req.body.answer;
                action = "updated";
              }
            }
          });

          answer
            .save()
            .then(result => {
              if (!result) return res.json({ save: "error", action });
              return res.json({ save: "ssaved", action });
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
);

//      @type       DELETE
//      @route      /api/answer/delete/:q_id/:a_id
//      @desc       FOR DELETING ANSWER TO THE QUESTION BY ID
//      @access     PRIVATE

router.delete(
  "/delete/:q_id/:a_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Answer.findOne({ QuestionId: req.params.q_id })
      .then(answer => {
        let action = "none";
        if (!answer)
          return res.status(404).json({ message: "no answer found", action });
        if (answer.answers.length < 1) {
          //no answer present
          return res
            .status(404)
            .json({ message: "no answer for deleteing", action });
        } else {
          answer.answers.map((oneAnswer, index) => {
            if (oneAnswer._id == req.params.a_id) {
              //answer found which needs to delete
              if (oneAnswer.authorId == req.user.id) {
                //now delete it
                answer.answers.splice(index, 1);
                action = "deleted";
              }
            }
          });

          answer
            .save()
            .then(result => {
              if (!result)
                return res.json({ message: "unable to save", action });
              return res.json({ message: " saved", action });
            })
            .catch(err => {});
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
);

//      @type       POST
//      @route      /api/answer/comment/:q_id/:a_id
//      @desc       FOR ADDING comment for ANSWER TO THE QUESTION
//      @access     PRIVATE

router.post(
  "/comment/:q_id/:a_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let action = "none";
    Answer.findOne({ QuestionId: req.params.q_id })
      .then(answer => {
        if (answer.answers.length < 1) {
          //no answer present
          return res.json({ message: "no answer present" });
        } else {
          answer.answers.map(oneAnswer => {
            if (oneAnswer._id == req.params.a_id) {
              const newComment = {
                authorId: req.user.id,
                authorName: req.body.authorName,
                message: req.body.message
              };
              oneAnswer.comments.push(newComment);
              action = "added comment";
            }
          });
          answer
            .save()
            .then(result => {
              if (!result)
                return ress.json({ message: "not able to save", action });
              return ress.json({ message: " saved", action });
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        throw err;
      });
  }
);

//      @type       DELETE
//      @route      /api/answer/comment/:q_id/:a_id/:c_id
//      @desc       FOR DELETING comment for ANSWER TO THE QUESTION
//      @access     PRIVATE

router.delete(
  "/comment/:q_id/:a_id/:c_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let action = "none";
    Answer.findOne({ QuestionId: req.params.q_id })
      .then(answer => {
        if (!answer)
          return res.status(404).json({ message: "no answer found" });
        else {
          if (answer.answers.length < 1) {
            //no answer so no comment
            return res.status(404).json({ message: "no answer" });
          } else {
            //answer/answers available
            answer.answers.map(oneAnswer => {
              if (oneAnswer._id == req.params.a_id) {
                //answer found
                if (oneAnswer.comments.length < 1) {
                  //no comment
                  return res.status(404).json({ message: "no comment" });
                } else {
                  oneAnswer.comments.map((oneComment, index) => {
                    if (oneComment._id == req.params.c_id) {
                      //comment found which you want to delete
                      oneAnswer.comments.splice(index, 1);
                      action = "deleted";
                    }
                  });
                }
              }
            });
          }

          answer
            .save()
            .then(result => {
              if (!result)
                return res.json({ message: "not able to save" }, action);
              return res.json({ message: "save" }, action);
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
);

//      @type       POST
//      @route      /api/answer/update/:q_id/:a_id/:c_id
//      @desc       FOR UPDATING comment for ANSWER TO THE QUESTION
//      @access     PRIVATE

router.post(
  "/update/:q_id/:a_id/:c_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Answer.findOne({ QuestionId: req.params.q_id })
      .then(answer => {
        let action = "none";
        if (!answer) {
          return res.status(404).json({ message: "no answer found" });
        } else {
          if (answer.answers.length < 1) {
            return res.status(404).json("no answer available");
          } else {
            //their is answer/answers
            answer.answers.map(oneAnswer => {
              if (oneAnswer._id == req.params.a_id) {
                //answer found
                if (oneAnswer.comments.length < 1) {
                  //no comments
                  return res.status(404).json({ message: "no comment found" });
                } else {
                  //comments available
                  oneAnswer.comments.map((oneComment, index) => {
                    if (oneComment._id == req.params.c_id) {
                      //same comment which you want to update
                      if (req.body.message) {
                        oneComment.message = req.body.message;
                        action = "updated";
                      }
                    }
                  });
                }
              }
            });
          }

          answer
            .save()
            .then(result => {
              if (!result)
                return res.json({ message: "unable to save", action });
              return res.json({ message: "saved", action });
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
);

module.exports = router;
