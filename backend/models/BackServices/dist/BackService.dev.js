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

var session = require('express-session');

var flash = require('connect-flash');

var passport = require('passport');

require('../passport')(passport);

var db = require('../mongoBase/db.js'); // EXPRESS SPECIFIC STUFF


app.use('/static', express["static"]('static')); // For serving static files

app.use(express.urlencoded()); // app.use(fileUpload());
// PUG SPECIFIC STUFF

app.set('view engine', 'pug'); // Set the template engine as pug

app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

var cookieParser = require('cookie-parser');

myrouter.use(cookieParser('secret'));
myrouter.use(flash());
myrouter.use(bodyparser.urlencoded({
  extended: true
}));
myrouter.use(session({
  secret: 'secret',
  maxAge: 3600000,
  resave: true,
  saveUninitialized: true
}));
myrouter.use(passport.initialize());
myrouter.use(passport.session());

var checkAuthenticated = function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    return next();
  } else {
    res.redirect('/login');
  }
};

myrouter.get('/Dashboard/OrderRequest', checkAuthenticated, function _callee3(req, res) {
  var regex;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          regex = new RegExp(req.query.type, 'i');
          email = req.user.email;
          skip2 = 0;
          next = parseInt(req.query.page);

          if (next >= 2) {
            skip2 = 50 * (next - 1);
            next = next + 1;
            previous = next - 2;
          } else {
            next = 2;
            previous = '/';
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").findOne({
            email: email
          }).then(function _callee(Employee_ID) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!Employee_ID) {
                      _context.next = 7;
                      break;
                    }

                    _context.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("OrderID").find({
                      $and: [{
                        Status: regex
                      }, {
                        "Owner_Details.Owner_email": email
                      }]
                    }).sort({
                      _id: -1
                    }).limit(50).skip(skip2).toArray());

                  case 3:
                    OrderID = _context.sent;
                    return _context.abrupt("return", OrderID);

                  case 7:
                    throw new Error("#");

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }).then(function _callee2(OrderID) {
            var params;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (OrderID) {
                      params = {
                        'newOBJ': OrderID,
                        'next': next,
                        'back': previous,
                        "procced_type": req.query.type
                      };
                      res.status(200).render('dashboard/Table.pug', params);
                    } else {
                      res.status(200).render('dashboard/underReview.pug', {
                        'result': 'No Orders Right Now'
                      });
                    }

                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(404).render('errorpage');
          }));

        case 7:
          Employee_ID = _context3.sent;

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
});
myrouter.post('/AddOffer', function (req, res) {
  OfferMaxPrice = req.body.OfferMaxPrice;
  DiscountPrice = req.body.DiscountPrice;
  CommisionPrice = req.body.CommisionPrice;
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("trial");
    var newvalues = {
      OfferMaxPrice: OfferMaxPrice,
      DiscountPrice: DiscountPrice,
      CommisionPrice: CommisionPrice
    };
    dbo.collection("OFFERS_TABLE").insertOne(newvalues, function (err, res) {
      if (err) throw err; // console.log("1 document updated");

      db.close();
    });
  });
  res.redirect("/Controlpanel");
});
module.exports = myrouter;