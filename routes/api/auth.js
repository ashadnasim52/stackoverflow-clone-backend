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

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //finding email and password from database
  Person.findOne({ email })
    .then(person => {
      if (!person) {
        return res.json({ message: "email does not exists" });
      }

      //if email exists then go ahead
      //comparing plain password with hash one
      bcryptjs
        .compare(password, person.password)
        .then(result => {
          //if result is true then it means password matched
          if (!result) {
            //password does not matched
            return res.status(404).json({ message: "invalid password" });
          }

          //password matched then go ahead
          //   return res.status(200).json({ message: "access granted" });

          //making data or payload
          const data = {
            id: person.id,
            name: person.name,
            email: person.email
          };

          //assigning a token for the user ,when he /she signed in
          jsonWebToken.sign(
            data,
            key.secret,
            {
              expiresIn: 60 * 60
            },
            (err, token) => {
              if (err) throw err;
              return res.json({
                sucess: true,
                token: `brearer ${token}`
              });
            }
          );
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
});

//      @type       GET
//      @route      /api/auth/profile
//      @desc       route for profile of user
//      @access     PRIVATE

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
  }
);

module.exports = router;
