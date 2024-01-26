const mongoose = require("mongoose");
require("dotenv").config();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(dbConnectionString)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
