const express = require("express");
const router = express.Router();
const passport = require("passport");

const Question = require("../../model/Question");

/**
 * question
 * //ask
 * update
 * see all question
 * delete one question
 *
 * ame apply for answer and comment
 *  */

//      @type       POST
//      @route      /api/question/ask
//      @desc       route for posting question
//      @access     PRIVATE

router.post(
  "/ask",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title, main } = req.body;
    Question.findOne({ title })
      .then(question => {
        if (question) return res.json({ question: "question already asked" });
        const newQuestion = new Question({
          title,
          main
        });
        newQuestion
          .save()
          .then(isSaved => {
            if (!isSaved)
              return res.json({ question: "error in saving  in database" });
            return res.json({ question: "question saved in database" });
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

module.exports = router;
