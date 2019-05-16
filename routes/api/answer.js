const express = require("express");
const passport = require("passport");

const Question = require("../../model/Question");
const Answer = require("../../model/Answer");

const router = express.Router();


router.get('/',(req,res)=>{
    res.send('helo')
})

//      @type       POST
//      @route      /api/answer/add/:q_id
//      @desc       FOR ADDING ANSWER TO THE QUESTION
//      @access     PRIVATE

router.post(
  "/add/:q_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
      console.log('inside');
      
    Answer.findOne({ QuestionId: req.params.q_id })
      .then(answer => {
          console.log(answer);
          
        if (!question)
          return res.status(404).json({ message: "no question asked" });

        //question exists
        const newAnswer = {
          answer: req.body.answer,
          authorName: req.body.authorName,
          authorId: req.user.id,
          authorProfilePic: req.user.profilepic
        };
        answer.answers.push(newAnswer);
        answer.save()
        .then((isSaved) => {
            if(!isSaved) return res.json({message:'unable to add answer'})
            return res.json(message:'answer added')
        }).catch((err) => {
            console.log(`error while saving ${err}`);
            
        });

      })
      .catch(err => {
        console.log(err);
      });
  }
);

module.exports = router;
