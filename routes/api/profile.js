const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const Person = require("../../model/Person");
const Profile = require("../../model/Profile");
const router = express.Router();

//      @type       GET
//      @route      /api/profile/
//      @desc       route for personal profile of user
//      @access     PRIVATE

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //finding profile of user with the id which we get from jwt header in req
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(400).json({ message: "profile not found" });
        }
        return res.json(profile);
      })
      .catch(err => {
        throw err;
      });
  }
);

module.exports = router;
