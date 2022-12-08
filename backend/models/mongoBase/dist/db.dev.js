"use strict";

var MongoClient = require("mongodb").MongoClient;

var ObjectID = require('mongodb').ObjectID;

var dbname = "trial";
var url = "mongodb://0.0.0.0:27017";
var mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
var state = {
  db: null
};

var connect = function connect(cb) {
  if (state.db) cb();else {
    MongoClient.connect(url, mongoOptions, function (err, client) {
      if (err) cb(err);else {
        state.db = client.db(dbname);
        cb();
      }
    });
  }
};

var getPrimaryKey = function getPrimaryKey(_id) {
  return ObjectID(_id);
};

var getDB = function getDB() {
  return state.db;
};

module.exports = {
  getDB: getDB,
  connect: connect,
  getPrimaryKey: getPrimaryKey
};