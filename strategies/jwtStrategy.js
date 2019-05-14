const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Person = require("../model/Person");
const myKey = require("../utils/mongoose");

//creating option object and adding secrects and other things
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;

//exporting passport
module.exports = passport => {
  //creating new passport strategy
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //findding person
      Person.findById(jwt_payload.id)
        .then(person => {
          if (person) {
            //if user exists then making a promise and passing no error and person
            return done(null, person);
          }
          //if user DOES NOT  exists then making a promise and passing  error and FALSE

          return done(null, false);
        })
        .catch(err => {
          throw err;
        });
    })
  );
};
