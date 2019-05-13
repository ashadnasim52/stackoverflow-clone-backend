const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//importing routes
const authjs = require("./routes/api/auth");

//importing
const utilsMongoose = require("./utils/mongoose");

const app = express();
const PORT = process.env.PORT || 8000;

//connecting mongoDB
mongoose
  .connect(utilsMongoose.urlOfMonogDb, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to DB`);
  })
  .catch(err => console.log(err));

//using bodyparser for parsing incoming request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//using routes
app.use("/api/auth", authjs);

//listing to the port
app.listen(PORT, err => {
  if (err) {
    throw err;
  }
  console.log(`server is running at ${PORT}`);
});
