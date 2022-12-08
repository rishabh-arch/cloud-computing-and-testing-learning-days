"use strict";

var express = require('express');

var myrouter = express.Router();

var path = require("path");

var fs = require("fs");

var app = express();
var port = 80;

var bodyparser = require('body-parser');

var nodemailer = require('nodemailer');

var domain = require("domain").create();

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/"; // EXPRESS SPECIFIC STUFF

app.use('/static', express["static"]('static')); // For serving static files

app.use(express.urlencoded()); // app.use(fileUpload());
// PUG SPECIFIC STUFF

app.set('view engine', 'pug'); // Set the template engine as pug

app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

myrouter.post('/AddPromo', function (req, res) {
  name = req.body.name;
  Phone = req.body.Phone;
  Payment = req.body.Payment;
  email = req.body.email;
  promo = req.body.Promocode;
  promoCheck = {
    PromoCode: promo
  };
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("trial");
    dbo.collection("promocodes").find(promoCheck).toArray(function (err, result) {
      try {
        var data = JSON.stringify(result);
        newJsonObj = JSON.parse(data); // console.log(newJsonObj);

        data1 = newJsonObj[0].Promocode;
        res.send("Select Another PromoCode");
      } catch (err) {
        var newvalues = {
          name: name,
          Phone: Phone,
          Payment: Payment,
          email: email,
          PromoCode: promo,
          product: 0,
          Commision: 0
        };
        dbo.collection("promocodes").insertOne(newvalues, function (err, res) {
          if (err) throw err;
          db.close();
        });
        res.send("PromoCode");
      }
    });
  });
});
myrouter.post('/FindPromo', function (req, res) {
  phone = req.body.Phone;
  PhoneNum = {
    Phone: phone
  };
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("trial");
    dbo.collection("promocodes").find(PhoneNum).sort({
      _id: -1
    }).toArray(function (err, newJsonObj) {
      try {
        data1 = newJsonObj[0].PromoCode;
        Promo_name = newJsonObj[0].name;
        Phone = newJsonObj[0].Phone;
        Payment = newJsonObj[0].Payment;
        email = newJsonObj[0].email;
        product = newJsonObj[0].product;
        Commision = newJsonObj[0].Commision;
        console.log(data1);
        var params = {
          'YourPromo': data1,
          'name': Promo_name,
          'Phone': Phone,
          'Payment': Payment,
          'email': email,
          'product': product,
          'Commision': Commision
        };
        res.status(200).render('Promocode.pug', params);
      } catch (err) {
        var _params = {
          'YourPromo': "bhai nhi mila"
        };
        res.status(200).render('Promocode.pug', _params);
      }
    });
  });
});
myrouter.post('/DelPromo', function (req, res) {
  phone = req.body.Phone;
  PhoneNum = {
    Phone: phone
  };
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("trial");
    dbo.collection("promocodes").deleteOne(PhoneNum, function (err, obj) {
      try {
        var params = {
          'DELETE': "PROMO DELETED"
        };
        res.status(200).render('Promocode.pug', params);
      } catch (err) {
        var _params2 = {
          'DELETE': "NOT AVAILABLE"
        };
        res.status(200).render('Promocode.pug', _params2);
      }
    });
  });
});
module.exports = myrouter;