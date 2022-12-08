"use strict";

var express = require('express');

var myrouter = express.Router();

var path = require("path");

var fs = require("fs");

var app = express();

var bodyparser = require('body-parser');

var domain = require("domain").create();

var session = require('express-session');

var flash = require('connect-flash');

var passport = require('passport');

require('../passport')(passport);

var db = require('../mongoBase/db.js'); //TO INSERT DATA IN MONGODB
// EXPRESS SPECIFIC STUFF


app.use('/static', express["static"]('static')); // For serving static files

app.use(express.urlencoded()); // app.use(fileUpload());
// PUG SPECIFIC STUFF

app.set('view engine', 'pug'); // Set the template engine as pug

app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

var _require = require('os'),
    type = _require.type;

myrouter.get('/', function _callee(req, res) {
  var Link1, Link2, Link3, Link4, params;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.isAuthenticated()) {
            username = req.user.username;
          } else {
            username = "";
          }

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

          _context.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").find().sort({
            _id: -1
          }).skip(skip2).limit(50).toArray()["catch"](function (err) {
            return console.log(err);
          }));

        case 6:
          productcodes = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(db.getDB().collection("Bumper").find().sort({
            address: 1
          }).toArray()["catch"](function (err) {
            return console.log(err);
          }));

        case 9:
          Bumper = _context.sent;
          Link1 = "", Link2 = "", Link3 = "", Link4 = ""; // if (Bumper && Bumper[0].link && Bumper[1].link && Bumper[2].link && Bumper[3].link) {
          //     Link1 = Bumper[0].link;
          //     Link2 = Bumper[1].link;
          //     Link3 = Bumper[2].link;
          //     Link4 = Bumper[3].link;
          // }

          params = {
            'newOBJ': productcodes,
            'next': next,
            'back': previous,
            "Link1": Link1,
            "Link2": Link2,
            "Link3": Link3,
            "Link4": Link4,
            "page_title": "DotMatrix.com: Easy Shopping Everywhere"
          };
          res.status(200).render('homenew.pug', params);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
});
myrouter.get('/checkkk', function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          res.send(req.user);

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
myrouter.get('/Accessories', function _callee3(req, res) {
  var _req$query, Categories, types, filter, sort, mongoOR, params;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          mongoOR = function _ref(choices, num) {
            var array;

            if (choices) {
              array = choices.split(","); //making an array of numbers

              array.pop();
            }

            if (typeof array != "undefined") {
              return cat_query = {
                $or: array.map(function (number) {
                  if (num == "Category") return {
                    Category: number
                  };else if (num == "types") return {
                    types: number
                  };else if (num == "Search") return {
                    Search: number
                  };
                })
              };
            } else return null;
          };

          _req$query = req.query, Categories = _req$query.Categories, types = _req$query.types, filter = _req$query.filter, sort = _req$query.sort;
          if (sort == "Rating") filterSort = {
            Rating: parseInt(filter)
          };else if (sort == "Oprice") filterSort = {
            Oprice: parseInt(filter)
          };else if (sort == "TotalOrders") filterSort = {
            TotalOrders: parseInt(filter)
          };else filterSort = null;
          type_array = mongoOR(types, "types");
          Category_array = mongoOR(Categories, "Category");

          if (req.isAuthenticated()) {
            username = req.user.username;
          } else {
            username = "";
          }

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

          _context3.next = 11;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").find(Category_array).sort(filterSort).skip(skip2).limit(50).toArray()["catch"](function (err) {
            return console.log(err);
          }));

        case 11:
          productcodes = _context3.sent;
          params = {
            'newOBJ': productcodes,
            "page_title": "DotMatrix.com: Accessories"
          };
          res.status(200).render('Accessories.pug', params);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  });
});
myrouter.get('/search', function _callee5(req, res) {
  var regex;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          skip2 = 0;
          next = parseInt(req.query.page);

          if (next >= 2) {
            skip2 = 50 * (next - 1);
            console.log(next);
            console.log(skip2);
            next = next + 1;
            previous = next - 2;
          } else {
            next = 2;
            previous = '/'; // skip2 = 50

            console.log(next);
            console.log(skip2);
          }

          regex = new RegExp(req.query.search, 'i');
          searchquery = {
            $or: [{
              name: regex
            }, {
              tag: regex
            }, {
              colour: regex
            }, {
              name: regex
            }, {
              Category: regex
            }]
          };
          _context5.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").find(searchquery).sort({
            TotalOrders: -1
          }).limit(50).skip(skip2).toArray().then(function _callee4(search_result) {
            var params;
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    params = {
                      'newOBJ': search_result,
                      'next': next,
                      'back': previous,
                      "page_title": "DotMatrix.com: search"
                    };
                    res.status(200).render('search.pug', params);

                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 7:
          search_result = _context5.sent;

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
});
myrouter.get('/market', function _callee6(req, res) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          res.status(200).render('market.pug');

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
});
module.exports = myrouter;