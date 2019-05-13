const express = require("express");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const jsonWebToken = require("jsonwebtoken");

const router = express.Router();

//      @type       get
//      @route      /api/auth
//      @desc       just for testing
//      @access     PUBLIC

router.get("/", (req, res) => {
  res.json({ message: "auth completed" });
});

//      @type       get
//      @route      /api/auth
//      @desc       just for testing
//      @access     PUBLIC

module.exports = router;
