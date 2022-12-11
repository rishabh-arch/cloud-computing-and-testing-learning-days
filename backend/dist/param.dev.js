"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var path = require("path");

var fs = require("fs");

var app = express();
var port = 5000;

var bodyparser = require('body-parser');

var nodemailer = require('nodemailer');

var HOME = require('./models/HOME/HOME.js');

var ProductHome = require('./models/HOME/ProductHome.js');

var Bumper = require('./models/HOME/Bumper.js');

var Shoppers = require('./models/ShopperSec/Shoppers.js');

var BackService = require('./models/BackServices/BackService.js');

var PromoService = require('./models/BackServices/PromoService.js');

var ShopIDService = require('./models/BackServices/ShopIDService.js');

var ProductService = require('./models/ShopperSec/ProductService.js');

var routes = require('./models/routes');

var db = require('./models/mongoBase/db.js');

var sharp = require('sharp');

var session = require('express-session');

var flash = require('connect-flash');

var passport = require('passport');

require('./models/passport')(passport);

var fileUploadCtrl = require('./models/FileUp.js').Emp_Address_Upload;

var profile_photo = require('./models/FileUp.js').P_P_Upload;

var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "prernagarg0509@gmail.com",
    pass: '9650199842p'
  }
}); // EXPRESS SPECIFIC STUFF

app.use('/static', express["static"]('static')); // For serving static files

app.use(express.urlencoded()); // PUG SPECIFIC STUFF

app.set('view engine', 'pug'); // Set the template engine as pug

app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory
// ENDPOINTS

var cookieParser = require('cookie-parser');

var _require = require("assert"),
    rejects = _require.rejects;

var _require2 = require("http"),
    request = _require2.request;

routes.use(cookieParser('secret'));
routes.use(session({
  secret: 'secret',
  secure: true,
  maxAge: 3600000,
  resave: false,
  saveUninitialized: false
})); // using passport for authentications 

routes.use(passport.initialize());
routes.use(passport.session()); // using flash for flash messages 

routes.use(flash()); // MIDDLEWARES
// Global variable

var checkAuthenticated = function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
  } else {
    res.redirect('/login');
  }
};

app.use('/', HOME);
app.use('/', Shoppers);
app.use('/', BackService);
app.use('/', PromoService);
app.use('/', ShopIDService);
app.use('/', ProductService);
app.use('/', ProductHome);
app.use('/', Bumper);
app.get('/register', routes);
app.get('/forEmpPage', routes);
app.post('/register', routes);
app.get('/login', routes);
app.post('/login', routes);
app.get('/success', routes);
app.get('/logout', routes);
app.post('/addmsg', routes);
app.get('/contact', function (req, res) {
  res.status(200).render('contact.pug');
});
app.get('/aboutus', function (req, res) {
  res.status(200).render('aboutus.pug');
});
app.get('/product', function (req, res) {
  res.status(200).render('productpage.pug');
});
app.get('/Controlpanel', function (req, res) {
  res.status(200).render('ControlPanel.pug');
});
app.get('/AddPromo', function (req, res) {
  res.status(200).render('Promocode.pug');
});
app.get('/AddOffer', function (req, res) {
  res.status(200).render('Offer.pug');
  co;
});
app.get('/Dashboard', function _callee4(req, res) {
  var dateFrom, dateTo, ddmmyyyyFROM, ddmmyyyyTO, months, TotalRevenue, Completed_Orders, Order_left, Cancel_Orders, OnWay_Orders, Clients, count1, count2, count3, count4, count5, Rating1, Rating2, Rating3, Rating4, Rating5;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          dateFrom = new Date("January 01, 2021 01:15:00");
          dateTo = new Date();
          daterange = req.query.daterange;
          ddmmyyyyFROM = "01/01/2021";
          ddmmyyyyTO = "".concat(dateTo.getDate(), "/0").concat(dateTo.getMonth() + 1, "/").concat(dateTo.getFullYear());
          months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

          if (daterange) {
            console.log(daterange);
            fromDate = parseInt(daterange.substr(0, 2));
            fromMonth = months[parseInt(daterange.substr(3, 2)) - 1];
            fromYear = parseInt(daterange.substr(6, 4));
            toDate = parseInt(daterange.substr(13, 2));
            toMonth = months[parseInt(daterange.substr(16, 2)) - 1];
            toYear = parseInt(daterange.substr(19, 4));
            dateFrom = new Date("".concat(fromMonth, " ").concat(fromDate, ", ").concat(fromYear));
            dateTo = new Date("".concat(toMonth, " ").concat(toDate, ", ").concat(toYear));
            ddmmyyyyFROM = daterange.substr(0, 10);
            ddmmyyyyTO = daterange.substr(12, 11);
          }

          TotalRevenue = 0, Completed_Orders = 0, Order_left = 0, Cancel_Orders = 0, OnWay_Orders = 0, Clients = 0, count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0, Rating1 = 0, Rating2 = 0, Rating3 = 0, Rating4 = 0, Rating5 = 0;

          if (!req.isAuthenticated()) {
            _context4.next = 15;
            break;
          }

          email = req.user.email;
          _context4.next = 12;
          return regeneratorRuntime.awrap(db.getDB().collection("OrderID").aggregate([{
            $unwind: '$Owner_Details'
          }, {
            $match: {
              "date_od": {
                $gte: dateFrom,
                $lte: dateTo
              },
              'Owner_Details.Owner_email': email
            }
          }, {
            $group: {
              _id: "$Status",
              count: {
                $sum: 1
              },
              "TotalRev": {
                $sum: "$price_quantity"
              }
            }
          }, {
            $sort: {
              Status: 1
            }
          }]).toArray().then(function _callee(OrderID_revenues) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    OrderID_revenues.forEach(function (item) {
                      id = item._id;

                      if (id == "Cancel") {
                        Cancel_Orders = item.count;
                      } else if (id == "pending") {
                        Order_left = item.count;
                      } else if (id == "DONE") {
                        TotalRevenue = item.TotalRev;
                        Completed_Orders = item.count;
                      } else if (id == "OnWay") {
                        OnWay_Orders = item.count;
                      }
                    });
                    total_orders = Cancel_Orders + Order_left + Completed_Orders + OnWay_Orders;
                    _context.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("OrderID").aggregate([{
                      $unwind: '$Owner_Details'
                    }, {
                      $match: {
                        "date_od": {
                          $gte: dateFrom,
                          $lte: dateTo
                        },
                        'Owner_Details.Owner_email': email
                      }
                    }, {
                      $group: {
                        _id: "$email",
                        count: {
                          $sum: 1
                        }
                      }
                    }, {
                      $sort: {
                        Status: 1
                      }
                    }, {
                      $count: "email"
                    }]).toArray());

                  case 4:
                    Orders_clients = _context.sent;

                    if (Orders_clients && Orders_clients.length > 0) {
                      Clients = Orders_clients[0].email;
                    } else {
                      Clients = 0;
                    }

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }).then(function _callee2() {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("userRating").aggregate([{
                      $unwind: '$Owner_email'
                    }, {
                      $match: {
                        "Owner_email": email
                      }
                    }, {
                      $group: {
                        _id: "$Rating",
                        count: {
                          $sum: 1
                        },
                        "Rating": {
                          $sum: "$Rating"
                        }
                      }
                    }]).toArray());

                  case 2:
                    userRating = _context2.sent;
                    userRating.forEach(function (item) {
                      id = item._id;

                      if (id === 1) {
                        count1 = item.count;
                        Rating1 = item.Rating;
                      } else if (id === 2) {
                        count2 = item.count;
                        Rating2 = item.Rating;
                      } else if (id === 3) {
                        count3 = item.count;
                        Rating3 = item.Rating;
                      } else if (id === 4) {
                        count4 = item.count;
                        Rating4 = item.Rating;
                      } else if (id === 5) {
                        count5 = item.count;
                        Rating5 = item.Rating;
                      }
                    });
                    RatingCounts = count5 + count1 + count2 + count3 + count4;
                    SumOfRatings = Rating1 + Rating2 + Rating3 + Rating4 + Rating5;
                    finalrate = SumOfRatings / RatingCounts / 5;
                    total_left = Order_left + OnWay_Orders;
                    total_left2 = total_left + Cancel_Orders;
                    RSO = Completed_Orders / total_orders;
                    total_score = (RSO + finalrate) / 2 * 100;

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }).then(function _callee3() {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    myquery = {
                      email: email
                    };
                    newvalues = {
                      $set: {
                        CancelProducts: Cancel_Orders,
                        DoneProducts: Cancel_Orders,
                        PendingProducts: Order_left
                      }
                    };
                    _context3.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").updateOne(myquery, newvalues));

                  case 4:
                    update = _context3.sent;
                    _context3.next = 7;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").aggregate([{
                      $unwind: '$Owner_Details'
                    }, {
                      $match: {
                        "date_up": {
                          $gte: dateFrom,
                          $lte: dateTo
                        },
                        'Owner_Details.Owner_email': email
                      }
                    }, {
                      $group: {
                        _id: "$PID",
                        count: {
                          $sum: 1
                        }
                      }
                    }, {
                      $sort: {
                        Status: 1
                      }
                    }, {
                      $count: "PID"
                    }]).toArray());

                  case 7:
                    productcount = _context3.sent;
                    if (productcount && productcount.length > 0) productcount = productcount[0].PID;else productcount = 0;
                    _context3.next = 11;
                    return regeneratorRuntime.awrap(db.getDB().collection("OrderID").find({
                      $and: [{
                        "Owner_Details.Owner_email": email
                      }, {
                        Status: "pending"
                      }]
                    }).limit(5).toArray());

                  case 11:
                    recentOrders = _context3.sent;

                  case 12:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          }).then(function (doc) {
            res.status(200).render('dashboard/Dashboard_next.pug', {
              "Order_left": total_left,
              "Completed_Orders": Completed_Orders,
              "Cancel_Orders": Cancel_Orders,
              "TotalRevenue": TotalRevenue,
              "Clients": Clients,
              "total_score": total_score,
              "total_orders": total_orders,
              "recentOrders": recentOrders,
              "productcount": productcount,
              "ddmmyyyyFROM": ddmmyyyyFROM,
              "ddmmyyyyTO": ddmmyyyyTO
            });
          })["catch"](function (err) {
            console.error(err);
          }));

        case 12:
          OrderID_revenues = _context4.sent;
          _context4.next = 16;
          break;

        case 15:
          res.redirect('/login');

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app.get('/Dashboard/profile', checkAuthenticated, function (req, res) {
  params = {
    user_details: req.user
  };
  res.status(200).render('dashboard/Profile.pug', params);
});
app.get('/reg-dashboard/userOrders', checkAuthenticated, function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          user_email = req.user.email;
          skip2 = 0;
          limit = 10;
          next = parseInt(req.query.page);

          if (next >= 2) {
            skip2 = limit * (next - 1);
            next = next + 1;
            previous = next - 2;
          } else {
            next = 2;
            previous = '/';
          }

          _context5.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("OrderID").aggregate([{
            $lookup: {
              from: 'productcodes',
              localField: "P_ID",
              foreignField: "PID",
              as: 'Product'
            }
          }, {
            $unwind: "$Product"
          }, {
            $match: {
              email: user_email
            }
          }, {
            $skip: skip2
          }, {
            $limit: limit
          }]).toArray().then(function (user_Orders) {
            params = {
              "user_Orders": user_Orders,
              "back": previous,
              "next": next,
              "color_orders": "#007bff"
            };

            if (user_Orders && user_Orders.length > 0) {
              res.status(200).render('regular_user/userOrders.pug', params);
            } else res.status(200).render('regular_user/blank_result.pug', params);
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 7:
          user_Orders = _context5.sent;

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app.get('/reg-dashboard/userAccount', checkAuthenticated, function _callee6(req, res) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          user_email = req.user.email;
          _context6.next = 3;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: user_email
          }).then(function (users_check) {
            params = {
              "user_Orders": user_Orders,
              "color_account": "#007bff"
            };

            if (users_check) {
              res.status(200).render('regular_user/userAccount.pug', params);
            }
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 3:
          users_check = _context6.sent;

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
});
app.get('/reg-dashboard/Reviews', checkAuthenticated, function _callee7(req, res) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          skip2 = 0;
          limit = 20;
          next = parseInt(req.query.page);

          if (next >= 2) {
            skip2 = limit * (next - 1);
            next = next + 1;
            previous = next - 2;
          } else {
            next = 2;
            previous = '/';
          }

          user_email = req.user.email;
          _context7.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("userRating").aggregate([{
            $lookup: {
              from: 'productcodes',
              localField: "P_ID",
              foreignField: "PID",
              as: 'Product'
            }
          }, {
            $unwind: "$Product"
          }, {
            $match: {
              email: user_email
            }
          }, {
            $skip: skip2
          }, {
            $limit: limit
          }]).toArray().then(function (user_Rating) {
            params = {
              "user_Rating": user_Rating,
              "back": previous,
              "next": next,
              "color_rev": "#007bff"
            };

            if (user_Rating && user_Rating.length > 0) {
              res.status(200).render('regular_user/userReview.pug', params);
            } else res.status(200).render('regular_user/blank_result.pug', params);
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 7:
          user_Rating = _context7.sent;

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
});
app.get('/Dashboard/YourShop', function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          if (!req.isAuthenticated()) {
            _context9.next = 6;
            break;
          }

          _context9.next = 3;
          return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").findOne({
            email: req.user.email
          }).then(function _callee8(data) {
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (data) {
                      if (data.emp_request == "NOT_ACCEPTED") {
                        res.status(200).render('dashboard/underReview.pug', {
                          'result': "Application is Submitted",
                          "result2": "We  will notify you via mail"
                        });
                      } else if (data.emp_request == "ACCEPTED") {
                        res.redirect('/Dashboard/EMP_ID_PAGE');
                      } else {
                        res.status(200).render('dashboard/Yourshop.pug');
                      }
                    } else {
                      res.status(200).render('dashboard/Yourshop.pug');
                    }

                  case 1:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          }));

        case 3:
          EMPLOYEE_ID = _context9.sent;
          _context9.next = 7;
          break;

        case 6:
          res.redirect('/login');

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  });
});
app.post('/Dashboard/Yourshop', function _callee13(req, res) {
  var token;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          if (req.isAuthenticated()) {
            username = req.user.username;
            fileUploadCtrl(req, res, function _callee12(err) {
              var _req$body, Shop_name, shop_address, shop_city, shop_state, shop_pincode, agree;

              return regeneratorRuntime.async(function _callee12$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      if (!err) {
                        _context12.next = 4;
                        break;
                      }

                      res.send(err);
                      _context12.next = 18;
                      break;

                    case 4:
                      _req$body = req.body, Shop_name = _req$body.Shop_name, shop_address = _req$body.shop_address, shop_city = _req$body.shop_city, shop_state = _req$body.shop_state, shop_pincode = _req$body.shop_pincode, agree = _req$body.agree;

                      if (!(!Shop_name || !shop_address || !shop_city || !shop_state || !shop_pincode || !agree)) {
                        _context12.next = 10;
                        break;
                      }

                      err = "Please Fill All The Fields...";
                      res.render('dashboard/Yourshop.pug', {
                        'err': err
                      });
                      _context12.next = 18;
                      break;

                    case 10:
                      // console.log("hello")
                      phone = req.user.phone;
                      agree = "AGREED";
                      email = req.user.email;
                      EMPID = Date.now();
                      emp_request = "NOT_ACCEPTED";
                      _context12.next = 17;
                      return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                        email: req.user.email
                      }).then(function _callee10(user) {
                        return regeneratorRuntime.async(function _callee10$(_context10) {
                          while (1) {
                            switch (_context10.prev = _context10.next) {
                              case 0:
                                if (user) {
                                  _context10.next = 4;
                                  break;
                                }

                                throw new Error("no user");

                              case 4:
                                token = jwt.sign({
                                  Shop_name: Shop_name,
                                  email: email,
                                  shop_address: shop_address,
                                  shop_city: shop_city,
                                  shop_state: shop_state,
                                  shop_pincode: shop_pincode,
                                  agree: agree,
                                  EMPID: EMPID,
                                  username: username
                                }, process.env.JWT_ACC_ACTIVATE, {
                                  expiresIn: '20m'
                                });
                                console.log(token);
                                _context10.next = 8;
                                return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").findOne({
                                  email: req.user.email
                                }));

                              case 8:
                                Employee = _context10.sent;
                                return _context10.abrupt("return", Employee);

                              case 10:
                              case "end":
                                return _context10.stop();
                            }
                          }
                        });
                      }).then(function _callee11(Employee) {
                        var mailOptions;
                        return regeneratorRuntime.async(function _callee11$(_context11) {
                          while (1) {
                            switch (_context11.prev = _context11.next) {
                              case 0:
                                if (!Employee) {
                                  _context11.next = 4;
                                  break;
                                }

                                throw new Error("no user");

                              case 4:
                                mailOptions = {
                                  from: "prernagarg0509@gmail.com",
                                  to: email,
                                  subject: "Account Activation",
                                  html: "<H1>Welcome To Hookah Club</H1><P>Click on the link to verify email id</P><p><a href=\"http://192.168.0.103:5000/EmployeeAcoountVerification/".concat(token, "\">Click Here to verify</a>")
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                  if (error) {
                                    return error;
                                  } else {
                                    console.log("Link sent");
                                  }

                                  ;
                                });
                                fs.rename(req.file.path, './static/addressProof/' + EMPID + '.jpg', function (err) {
                                  console.log(err);
                                });
                                res.status(200).render("dashboard/underReview.pug", {
                                  'result2': "Vefification Link is send to your ".concat(email),
                                  "result": "Verification"
                                });

                              case 8:
                              case "end":
                                return _context11.stop();
                            }
                          }
                        });
                      })["catch"](function (err) {
                        return console.log(err);
                      }));

                    case 17:
                      user = _context12.sent;

                    case 18:
                    case "end":
                      return _context12.stop();
                  }
                }
              });
            });
          } else {
            res.redirect('/login');
          }

        case 1:
        case "end":
          return _context13.stop();
      }
    }
  });
});
app.get('/EmployeeAcoountVerification/:id', function _callee17(req, res) {
  var token;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          Emp_date = new Date();
          token = req.params.id;

          if (token) {
            jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function _callee16(err, decodedToken) {
              var Shop_name, _email, shop_address, shop_city, shop_state, shop_pincode, _EMPID, _username;

              return regeneratorRuntime.async(function _callee16$(_context16) {
                while (1) {
                  switch (_context16.prev = _context16.next) {
                    case 0:
                      if (!err) {
                        _context16.next = 4;
                        break;
                      }

                      // throw new Error("not verified");
                      console.log(err);
                      _context16.next = 10;
                      break;

                    case 4:
                      Shop_name = decodedToken.Shop_name, _email = decodedToken.email, shop_address = decodedToken.shop_address, shop_city = decodedToken.shop_city, shop_state = decodedToken.shop_state, shop_pincode = decodedToken.shop_pincode, _EMPID = decodedToken.EMPID, _username = decodedToken.username;
                      agree = "AGREED";
                      emp_request = "NOT_ACCEPTED";
                      _context16.next = 9;
                      return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                        email: _email
                      }).then(function _callee14(user) {
                        return regeneratorRuntime.async(function _callee14$(_context14) {
                          while (1) {
                            switch (_context14.prev = _context14.next) {
                              case 0:
                                if (user) {
                                  _context14.next = 4;
                                  break;
                                }

                                throw new Error("not Employee");

                              case 4:
                                phone = user.phone;
                                _context14.next = 7;
                                return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").findOne({
                                  email: _email
                                }));

                              case 7:
                                Employee = _context14.sent;
                                return _context14.abrupt("return", Employee);

                              case 9:
                              case "end":
                                return _context14.stop();
                            }
                          }
                        });
                      }).then(function _callee15(Employee) {
                        return regeneratorRuntime.async(function _callee15$(_context15) {
                          while (1) {
                            switch (_context15.prev = _context15.next) {
                              case 0:
                                if (!Employee) {
                                  _context15.next = 4;
                                  break;
                                }

                                throw new Error("Already Employee");

                              case 4:
                                _context15.next = 6;
                                return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").insertOne({
                                  email: _email,
                                  username: _username,
                                  Shop_name: Shop_name,
                                  shop_address: shop_address,
                                  shop_state: shop_state,
                                  shop_city: shop_city,
                                  shop_pincode: shop_pincode,
                                  agree: agree,
                                  phone: phone,
                                  EMPID: _EMPID,
                                  emp_request: emp_request,
                                  total_revenue: 0,
                                  Emp_date: Emp_date,
                                  TotalProducts: 0,
                                  CancelProducts: 0,
                                  DoneProducts: 0,
                                  PendingProducts: 0
                                }));

                              case 6:
                                Employee_insert = _context15.sent;
                                res.status(200).render('dashboard/underReview.pug', {
                                  'result2': "Wait for Confirmation, we will notify You soon",
                                  "result": "Email Verified"
                                });

                              case 8:
                              case "end":
                                return _context15.stop();
                            }
                          }
                        });
                      })["catch"](function (err) {
                        return console.log(err);
                      }));

                    case 9:
                      user = _context16.sent;

                    case 10:
                    case "end":
                      return _context16.stop();
                  }
                }
              });
            });
          } else {
            res.status(404).render('errorpage.pug');
          }

        case 3:
        case "end":
          return _context17.stop();
      }
    }
  });
});
app.post('/dashboard/editprofile', checkAuthenticated, function _callee20(req, res) {
  return regeneratorRuntime.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          // profile_photo
          email = req.user.email;
          uniqueID = req.user.uniqueID;
          profile_photo(req, res, function _callee19(err) {
            var _req$body2, user_name, Address, State, City, PinCode, user_phone, youtube_url;

            return regeneratorRuntime.async(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    if (!err) {
                      _context19.next = 4;
                      break;
                    }

                    res.send(err);
                    _context19.next = 8;
                    break;

                  case 4:
                    _req$body2 = req.body, user_name = _req$body2.user_name, Address = _req$body2.Address, State = _req$body2.State, City = _req$body2.City, PinCode = _req$body2.PinCode, user_phone = _req$body2.user_phone, youtube_url = _req$body2.youtube_url;
                    _context19.next = 7;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                      email: email
                    }).then(function _callee18(user) {
                      var _$set;

                      return regeneratorRuntime.async(function _callee18$(_context18) {
                        while (1) {
                          switch (_context18.prev = _context18.next) {
                            case 0:
                              if (!user) {
                                _context18.next = 8;
                                break;
                              }

                              if (req.file) sharp(req.file.path, {
                                failOnError: false
                              }).resize(90, 90).toFormat("jpeg").jpeg({
                                quality: 100
                              }).toFile('./static/profile_photo/' + uniqueID + ".jpeg");
                              _context18.next = 4;
                              return regeneratorRuntime.awrap(db.getDB().collection("users").updateOne({
                                email: email
                              }, {
                                $set: (_$set = {
                                  username: user_name,
                                  phone: user_phone,
                                  Address: Address,
                                  State: State,
                                  City: City,
                                  pincode: PinCode
                                }, _defineProperty(_$set, "phone", user_phone), _defineProperty(_$set, "youtube_url", youtube_url), _$set)
                              }));

                            case 4:
                              user_update = _context18.sent;
                              res.redirect("/dashboard/profile");
                              _context18.next = 9;
                              break;

                            case 8:
                              throw new Error("#");

                            case 9:
                            case "end":
                              return _context18.stop();
                          }
                        }
                      });
                    })["catch"](function (err) {
                      return console.log(err);
                    }));

                  case 7:
                    user = _context19.sent;

                  case 8:
                  case "end":
                    return _context19.stop();
                }
              }
            });
          });

        case 3:
        case "end":
          return _context20.stop();
      }
    }
  });
});
app.get('/StartService', function (req, res) {
  res.status(200).render('StartService.pug');
});
app.use(function (req, res, next) {
  res.status(404).render("errorpage.pug");
});
db.connect(function (err) {
  if (err) {
    console.log('unable to connect to database');
    process.exit(1);
  } else {
    app.listen(port, function () {
      console.log('connected to database, app listening on port 3000');
    });
  }
});