const express = require("express");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const jsonWebToken = require("jsonwebtoken");

const key = require("../../utils/mongoose");

//importing schema for person to register

const Person = require("../../model/Person");

const router = express.Router();

//      @type       GET
//      @route      /api/auth
//      @desc       just for testing
//      @access     PUBLIC

router.get("/", (req, res) => {
  res.json({ message: "auth is being tested" });
});

//      @type       POST
//      @route      /api/auth/register
//      @desc       route for reqistered for user
//      @access     PUBLIC

router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        return res.status(400).json({
          emailError: "Email already registered"
        });
      } else {
        //creating new user object
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        //encrypting the password
        bcryptjs.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcryptjs.hash(newPerson.password, salt, (err, hash) => {
            if (err) throw err;
            newPerson.password = hash;

            //saving user in DB
            newPerson
              .save()
              .then(person => {
                console.log(`user is saved...`);
                return res.json(person);
              })
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => {
      throw err;
    });
});

//      @type       POST
//      @route      /api/auth/login
//      @desc       route for login for user
//      @access     PUBLIC

router.post("/login", (req, res) => {});

module.exports = router;
