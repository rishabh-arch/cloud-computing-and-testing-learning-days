"use strict";

var express = require('express');

var dotenv = require("dotenv");

var app = express();

var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');

app.use(cookieParser());
app.use(express.json());
dotenv.config({
  path: './config.env'
});
PORT = process.env.PORT;
app.use(express.urlencoded({
  extended: true
}));
mongoose.connect('mongodb://localhost:27017/oxygen', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function () {
  console.log('successfully connected to database');
});

var userRouter = require('./routes/User');

app.use('/', userRouter);

if (process.env.NODE_ENV == "production") {
  app.use(express["static"]("frontend/build")); // const path = require("path");
  // app.get("*", (req, res) => {
  //     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  // })
}

app.listen(PORT, function () {
  console.log("connected to database, app listening on port ".concat(PORT));
});