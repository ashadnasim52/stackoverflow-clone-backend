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

//      @type       POST
//      @route      /api/profile/
//      @desc       route for UPDATING/SAVING personal profile of user
//      @access     PRIVATE

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.userName) profileValues.userName = req.body.userName;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.languages !== undefined) {
      profileValues.languages = req.body.languages.split(",");
    }
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.insta) profileValues.social.insta = req.body.insta;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;

    // profileValues.workrole = [];

    // if (req.body.workrole.length > 0) {
    //   console.log(req.body.workrole);

    //   // profileValues.workrole = req.body.workrole;

    //   req.body.workrole.map(result => {
    //     console.log(result);
    //   });

    //   // for (const result of req.body.workrole) {
    //   //   console.log(result);

    //   //   const oneWorkRole = {};
    //   //   profileValues.workrole.push(oneWorkRole);
    //   // }
    //   // req.body.workrole.for(result => {

    //   // });
    // }

    console.log(profileValues);

    //mess wisth the database
    Profile.findOne({ userid: req.user.id })
      .then(profile => {
        if (profile) {
          //update it
          Profile.findOneAndUpdate(
            { userid: req.user.id },
            {
              $set: profileValues
            },
            { new: true }
          )
            .then(result => {
              return res.json(result);
            })
            .catch(err => {
              throw err;
            });
        } else {
          //save it
          Profile.findOne({ userName: profileValues.userName })
            .then(profile => {
              if (profile) {
                return res
                  .status(400)
                  .json({ message: "username aleray exists" });
              } else {
                //save user
                new Profile(profileValues)
                  .save()
                  .then(result => {
                    return res.json(result);
                  })
                  .catch(err => {
                    console.log("error in saving" + err);
                  });
              }
            })
            .catch(err => {
              console.log(`error in saving part ${err}`);
            });
        }
      })
      .catch(err => {
        throw err;
      });
  }
);

//      @type       GET
//      @route      /api/profile/:username
//      @desc       route for  profile of user
//      @access     PUBLIC

router.get("/:username", (req, res) => {
  Profile.findOne({ userName: req.params.username })
    .populate("user", ["name", "profilePic"])
    .then(profile => {
      if (!profile)
        return res.status(400).json({ profileError: "No profile Found" });
      return res.status(200).json({ profile: profile });
    })
    .catch(err => {
      console.log(`error in showing responce ${err}`);
    });
});

//      @type       GET
//      @route      /api/profile/:id
//      @desc       route for seeing public profile of user by id
//      @access     PUBLIC

router.get("/id/:id", (req, res) => {
  Profile.findOne({ user: req.params.id })
    .populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) return res.json({ profileError: "no profile found" });
      res.json({ profile: profile });
    })
    .catch(err => {
      console.log(`unable to the profile ${err}`);
    });
});

//      @type       GET
//      @route      /api/profile/all
//      @desc       route for seeing all profile of users
//      @access     PRIVATE

router.get(
  "/all/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find()
      .then(profiles => {
        if (!profiles)
          return res.status(404).json({ profileErrors: "no profile found" });
        return res.json({ profile: profiles });
      })
      .catch(err => {
        console.log(`error on finding all value ${err}`);
      });
  }
);

//      @type       DELETE
//      @route      /api/profile/:id
//      @desc       route for DELETE of profile of user by id
//      @access     PRIVATE

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile)
          return res.status(404).json({ delteError: "no user find" });
        profile
          .delete()
          .then(result => {
            if (!result) return res.json({ deleteError: "unable to delete" });
            return res.json({ delete: "deleted" });
          })
          .catch(err => {});
      })
      .catch(err => {
        console.log(`unbale to delete the profile`);
      });
  }
);

//      @type       POST
//      @route      /api/profile/workrole
//      @desc       route for adding of workrole
//      @access     PRIVATE

router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile)
          return res.status(404).json({ profileError: "no profile found" });
        const newRole = {
          role: req.body.role,
          company: req.body.company,
          country: req.body.country,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          details: req.body.details
        };

        profile.workrole.push(newRole);
        profile
          .save()
          .then(isSaved => {
            if (!isSaved) return res.json({ savingStatus: "not able to save" });
            return res.json({ savingStatus: "saved" });
          })
          .catch(err => {
            console.log(`error in saving workrolw ${err}`);
          });
      })
      .catch(err => {
        console.log(`unable to find the user ${err}`);
      });
  }
);

//      @type       DELETE
//      @route      /api/profile/workrole/delete/:w_id
//      @desc       route for DELETING  of workrole BASED ON ID
//      @access     PRIVATE

router.delete(
  "/workrole/delete/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const idDelete = req.params.w_id;
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) return res.json({ profileError: "no profile found" });
        console.log(profile);
        profile.workrole.filter(singleRole => {
          singleRole._id === idDelete;
        });
        profile
          .save()
          .then(isSaved => {
            if (!isSaved) return res.json({ profile: "unable to save" });
            return res.json({ profile: "saved" });
          })
          .catch(err => {
            console.log(`error on saving ${err}`);
          });
      })
      .catch(err => {
        console.log(`error on finding profile ${err}`);
      });
  }
);

module.exports = router;
