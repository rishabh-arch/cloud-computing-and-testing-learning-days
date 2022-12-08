"use strict";

var express = require('express');

var myrouter = express.Router();

var bcrypt = require('bcryptjs');

var sharp = require('sharp');

var path = require("path");

var fs = require("fs");

var app = express();
var port = 80;

var bodyparser = require('body-parser');

var nodemailer = require('nodemailer'); // var domain = require("domain").create();


var crypto = require('crypto');

var IV_LENGTH = 16;

var session = require('express-session');

var flash = require('connect-flash');

var ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
var algo = 'aes-256-ctr';
var jsonParser = bodyparser.json();

var jwt = require("jsonwebtoken");

var fileUploadCtrl = require('../FileUp.js').hookah_Upload;

require('dotenv').config();

var _require = require("constants"),
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG = _require.SSL_OP_SSLEAY_080_CLIENT_DH_BUG;

var _require2 = require("mongodb"),
    ObjectId = _require2.ObjectId;

var _require3 = require("console"),
    Console = _require3.Console;

var _require4 = require("path"),
    parse = _require4.parse;

var _require5 = require("zlib"),
    createBrotliCompress = _require5.createBrotliCompress;

var _require6 = require("assert"),
    doesNotThrow = _require6.doesNotThrow,
    _throws = _require6["throws"];

var db = require('../mongoBase/db.js');

var passport = require('passport');

require('../passport')(passport);

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
    return next(); // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
  } else {
    res.redirect('/login');
  }
};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "prernagarg0509@gmail.com",
    pass: '9650199842p'
  }
}); //TO INSERT DATA IN MONGODB
// EXPRESS SPECIFIC STUFF

myrouter.use('/static', express["static"]('static')); // For serving static files

myrouter.use(express.urlencoded());
myrouter.get('/protected', function (req, res) {
  if (req.isAuthenticated()) {
    // return next();
    res.send(req.user); // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
  } else {
    res.redirect('/login');
  }
});
myrouter.get('/forgotpassword', function (req, res) {
  res.render('forgotPassword.pug');
});
myrouter.get('/dashboard/ChangePassword', checkAuthenticated, function (req, res) {
  res.render('dashboard/ChangePassword.pug');
});
myrouter.get('/reg-dashboard/ChangePassword', checkAuthenticated, function (req, res) {
  res.render('regular_user/userChangePassword.pug', {
    "color_pass": "#007bff"
  });
});
myrouter.get('/dashboard/RechargeAccount', checkAuthenticated, function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.render('dashboard/underReview_.pug');

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
myrouter.get('/rechargeDone', checkAuthenticated, function _callee3(req, res) {
  var newDate, oldDate, TodayDate;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          user_email = req.user.email;
          TodayDate = new Date();
          T_D_M = TodayDate.getTime();
          _context3.next = 5;
          return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").findOne({
            email: user_email
          }).then(function _callee2(Employee_ID) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!Employee_ID) {
                      _context2.next = 12;
                      break;
                    }

                    Emp_date = Employee_ID.Emp_date;
                    E_D_M = Emp_date.getTime();

                    if (E_D_M > T_D_M) {
                      oldDate = Emp_date.getMonth();
                      newDate = new Date(Emp_date.setMonth(oldDate + 1));
                    } else {
                      oldDate = TodayDate.getMonth();
                      newDate = new Date(TodayDate.setMonth(oldDate + 1));
                    }

                    _context2.next = 6;
                    return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").updateOne({
                      email: user_email
                    }, {
                      $set: {
                        Emp_date: newDate
                      }
                    }));

                  case 6:
                    Employee_update = _context2.sent;
                    _context2.next = 9;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").updateMany({
                      "Owner_Details.Owner_email": user_email
                    }, {
                      $set: {
                        Emp_date: newDate
                      }
                    }));

                  case 9:
                    Product_update = _context2.sent;
                    _context2.next = 13;
                    break;

                  case 12:
                    throw new Error("Not Employee");

                  case 13:
                    res.status(200).render('dashboard/underReview_.pug');

                  case 14:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 5:
          Employee_ID = _context3.sent;

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
myrouter.post('/dashboard/ChangePassword', checkAuthenticated, function _callee8(req, res) {
  var from, _req$body, old_password, new_password, confirmpassword;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          from = req.query.from;
          _req$body = req.body, old_password = _req$body.old_password, new_password = _req$body.new_password, confirmpassword = _req$body.confirmpassword;
          user_email = req.user.email;
          _context8.next = 5;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: user_email
          }).then(function _callee4(UserOldPass) {
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (UserOldPass) {
                      _context4.next = 4;
                      break;
                    }

                    throw new Error("User Doesn't Exists..");

                  case 4:
                    if (!(new_password == confirmpassword)) {
                      _context4.next = 11;
                      break;
                    }

                    _context4.next = 7;
                    return regeneratorRuntime.awrap(bcrypt.compare(old_password, UserOldPass.password));

                  case 7:
                    ConfirmOldPass = _context4.sent;
                    return _context4.abrupt("return", ConfirmOldPass);

                  case 11:
                    throw new Error("Password Don't Match");

                  case 12:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          }).then(function _callee5(ConfirmOldPass) {
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (ConfirmOldPass) {
                      _context5.next = 4;
                      break;
                    }

                    throw new Error("Incorrect old Password!");

                  case 4:
                    _context5.next = 6;
                    return regeneratorRuntime.awrap(bcrypt.genSalt(10));

                  case 6:
                    salt = _context5.sent;
                    return _context5.abrupt("return", salt);

                  case 8:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          }).then(function _callee6(salt) {
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!salt) {
                      _context6.next = 7;
                      break;
                    }

                    _context6.next = 3;
                    return regeneratorRuntime.awrap(bcrypt.hash(new_password, salt));

                  case 3:
                    hash = _context6.sent;
                    return _context6.abrupt("return", hash);

                  case 7:
                    throw new Error("User Doesn't Exists..");

                  case 8:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          }).then(function _callee7(hash) {
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    if (!hash) {
                      _context7.next = 7;
                      break;
                    }

                    _context7.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").updateOne({
                      email: user_email
                    }, {
                      $set: {
                        password: hash
                      }
                    }));

                  case 3:
                    users_insert = _context7.sent;
                    res.redirect('/logout');
                    _context7.next = 8;
                    break;

                  case 7:
                    throw new Error("User Doesn't Exists..");

                  case 8:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })["catch"](function (err) {
            if (from == "dashboard") res.render("dashboard/ChangePassword.pug", {
              'message': err
            });else if (from == "reg_dashboard") res.render("regular_user/userChangePassword.pug", {
              'message': err
            });else res.status(404).render("errorpage");
          }));

        case 5:
          UserOldPass = _context8.sent;

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
});
myrouter.post('/userNewpassword', function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          user_email = req.body.user_email;
          _context9.next = 3;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: user_email
          }).then(function (userid) {
            if (userid) {
              var token = jwt.sign({
                user_email: user_email
              }, process.env.JWT_ACC_ACTIVATE, {
                expiresIn: '20m'
              });
              var mailOptions = {
                from: "prernagarg0509@gmail.com",
                to: user_email,
                subject: "HookahBoi Account",
                html: "<H1>Welcome To Hookah Club</H1><P>Click on the link to change your password</P><p><a href=\"http://192.168.0.103:5000/EmailPasswordVerification/".concat(token, "\">Click Here to Proceed</a>")
              };
              console.log(token);
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return error;
                } else {
                  console.log("Link sent");
                }

                ;
              });
              res.render('forgotPassword.pug', {
                "message": "link Successfully sent to your email....."
              });
            } else {
              throw new Error("This Email is not Registered");
            }
          })["catch"](function (err) {
            return res.render('forgotPassword.pug', {
              "message": err.message
            });
          }));

        case 3:
          userid = _context9.sent;

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
});
myrouter.get('/EmailPasswordVerification/:tagid', function _callee11(req, res) {
  var token;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          token = req.params.tagid;

          if (token) {
            jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function _callee10(err, decodedToken) {
              var _user_email;

              return regeneratorRuntime.async(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      if (!err) {
                        _context10.next = 4;
                        break;
                      }

                      return _context10.abrupt("return", res.status(404).render('errorpage.pug'));

                    case 4:
                      _user_email = decodedToken.user_email;
                      _context10.next = 7;
                      return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                        email: _user_email
                      }).then(function (userid) {
                        if (userid) {
                          res.render('newEmailPassword.pug', {
                            "message": "Enter new Password for ".concat(_user_email),
                            "token": token
                          });
                        } else {
                          throw new Error("#");
                        }
                      })["catch"](function (err) {
                        return console.log(err);
                      }));

                    case 7:
                      userid = _context10.sent;

                    case 8:
                    case "end":
                      return _context10.stop();
                  }
                }
              });
            });
          } else {
            res.status(404).render("errorpage");
          }

        case 2:
        case "end":
          return _context11.stop();
      }
    }
  });
});
myrouter.post('/newPassword/:tagid', function _callee16(req, res) {
  var token, _req$body2, password, confirmpassword;

  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          token = req.params.tagid;
          _req$body2 = req.body, password = _req$body2.password, confirmpassword = _req$body2.confirmpassword;

          if (token) {
            jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function _callee15(err, decodedToken) {
              var _user_email2;

              return regeneratorRuntime.async(function _callee15$(_context15) {
                while (1) {
                  switch (_context15.prev = _context15.next) {
                    case 0:
                      if (!err) {
                        _context15.next = 4;
                        break;
                      }

                      throw new Error("#");

                    case 4:
                      if (!(!password || !confirmpassword)) {
                        _context15.next = 9;
                        break;
                      }

                      err = "Please Fill All The Fields...";
                      res.render('newEmailPassword.pug', {
                        'err': err
                      });
                      _context15.next = 18;
                      break;

                    case 9:
                      if (!(password != confirmpassword)) {
                        _context15.next = 14;
                        break;
                      }

                      err = "Passwords Don't Match";
                      res.render('newEmailPassword.pug', {
                        'err': err
                      });
                      _context15.next = 18;
                      break;

                    case 14:
                      _user_email2 = decodedToken.user_email;
                      _context15.next = 17;
                      return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                        email: _user_email2
                      }).then(function _callee12(users) {
                        return regeneratorRuntime.async(function _callee12$(_context12) {
                          while (1) {
                            switch (_context12.prev = _context12.next) {
                              case 0:
                                if (users) {
                                  _context12.next = 4;
                                  break;
                                }

                                throw new Error("#");

                              case 4:
                                _context12.next = 6;
                                return regeneratorRuntime.awrap(bcrypt.genSalt(10));

                              case 6:
                                salt = _context12.sent;
                                return _context12.abrupt("return", salt);

                              case 8:
                              case "end":
                                return _context12.stop();
                            }
                          }
                        });
                      }).then(function _callee13(salt) {
                        return regeneratorRuntime.async(function _callee13$(_context13) {
                          while (1) {
                            switch (_context13.prev = _context13.next) {
                              case 0:
                                if (!salt) {
                                  _context13.next = 7;
                                  break;
                                }

                                _context13.next = 3;
                                return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

                              case 3:
                                hash = _context13.sent;
                                return _context13.abrupt("return", hash);

                              case 7:
                                throw new Error("#");

                              case 8:
                              case "end":
                                return _context13.stop();
                            }
                          }
                        });
                      }).then(function _callee14(hash) {
                        return regeneratorRuntime.async(function _callee14$(_context14) {
                          while (1) {
                            switch (_context14.prev = _context14.next) {
                              case 0:
                                if (!hash) {
                                  _context14.next = 7;
                                  break;
                                }

                                password = hash;
                                _context14.next = 4;
                                return regeneratorRuntime.awrap(db.getDB().collection("users").updateOne({
                                  email: _user_email2
                                }, {
                                  $set: {
                                    password: password
                                  }
                                }));

                              case 4:
                                rk = users_insert = _context14.sent;
                                _context14.next = 8;
                                break;

                              case 7:
                                throw new Error("#");

                              case 8:
                              case "end":
                                return _context14.stop();
                            }
                          }
                        });
                      }).then(function () {
                        req.flash('success_message', "Password Changed Successfully.. Login To Continue..");
                        res.redirect('/login');
                      })["catch"](function (err) {
                        return console.log(err);
                      }));

                    case 17:
                      users = _context15.sent;

                    case 18:
                    case "end":
                      return _context15.stop();
                  }
                }
              });
            });
          } else {
            console.log("err3");
            res.status(404).render("errorpage");
          }

        case 3:
        case "end":
          return _context16.stop();
      }
    }
  });
});
myrouter.get('/Dashboard/EMP_ID_PAGE', function _callee19(req, res) {
  var myquery;
  return regeneratorRuntime.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          if (!req.isAuthenticated()) {
            _context19.next = 11;
            break;
          }

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

          myquery = {
            "email": email
          };
          _context19.next = 8;
          return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").findOne(myquery).then(function _callee17(Employee_ID) {
            var myquery2;
            return regeneratorRuntime.async(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    if (!Employee_ID) {
                      _context17.next = 8;
                      break;
                    }

                    myquery2 = {
                      "Owner_Details.Owner_email": email
                    };
                    _context17.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").find(myquery2).sort({
                      _id: -1
                    }).limit(50).skip(skip2).toArray());

                  case 4:
                    productcodes = _context17.sent;
                    return _context17.abrupt("return", productcodes);

                  case 8:
                    throw new Error("!");

                  case 9:
                  case "end":
                    return _context17.stop();
                }
              }
            });
          }).then(function _callee18(productcodes) {
            return regeneratorRuntime.async(function _callee18$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    if (!productcodes) {
                      _context18.next = 5;
                      break;
                    }

                    params = {
                      'newObj': productcodes
                    };
                    res.status(200).render('dashboard/EMP_ID_PAGE.pug', params);
                    _context18.next = 6;
                    break;

                  case 5:
                    throw new Error("#");

                  case 6:
                  case "end":
                    return _context18.stop();
                }
              }
            });
          })["catch"](function (err) {
            if (err.message == "#") res.status(200).render('dashboard/underReview.pug', {
              'result': 'OMG',
              "result2": "No products Are here"
            });else if (err.message == "!") res.status(404).render('errorpage.pug');
          }));

        case 8:
          Employee_ID = _context19.sent;
          _context19.next = 12;
          break;

        case 11:
          res.redirect('/login');

        case 12:
        case "end":
          return _context19.stop();
      }
    }
  });
});
myrouter.get('/Dashboard/ShowComments', checkAuthenticated, function _callee20(req, res) {
  return regeneratorRuntime.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
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

          _context20.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("userRating").find({
            Owner_email: email
          }).sort({
            _id: -1
          }).skip(skip2).limit(50).toArray().then(function (Ratings) {
            if (Ratings) {
              var _params = {
                'Ratings': Ratings,
                'next': next,
                'back': previous
              };
              res.status(404).render('dashboard/Commentsec.pug', _params);
            } else {
              res.status(200).render('errorpage.pug');
            }
          }));

        case 6:
          Ratings = _context20.sent;

        case 7:
        case "end":
          return _context20.stop();
      }
    }
  });
});
myrouter.get('/comments', function _callee21(req, res) {
  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          PID = req.query.PID;
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

          _context21.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("userRating").find({
            P_ID: PID
          }).sort({
            _id: 1
          }).skip(skip2).limit(limit).toArray().then(function (Ratings) {
            if (Ratings.length > 0) {
              var _params2 = {
                'Ratings': Ratings,
                'next': next,
                'back': previous,
                "PID": PID
              };
              res.status(404).render('productComment.pug', _params2);
            } else {
              res.status(200).render('underReview_.pug', {
                "result": "No More Comments",
                "result2": "Are You really Interested to check Comment Stuff!"
              });
            }
          }));

        case 7:
          Ratings = _context21.sent;

        case 8:
        case "end":
          return _context21.stop();
      }
    }
  });
});
myrouter.get('/Dashboard/EditProduct', checkAuthenticated, function _callee22(req, res) {
  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          email = req.user.email;
          Product_ID = req.query.pid;
          _context22.next = 4;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne({
            $and: [{
              "Owner_Details.Owner_email": email
            }, {
              PID: Product_ID
            }]
          }).then(function (product_detail) {
            if (product_detail != "") {
              var _params3 = {
                'product_detail': product_detail
              };
              res.status(200).render('dashboard/EditProduct.pug', _params3);
            } else {
              res.status(404).render('errorpage.pug');
            }
          }));

        case 4:
          product_detail = _context22.sent;

        case 5:
        case "end":
          return _context22.stop();
      }
    }
  });
});
myrouter.post('/Dashboard/EditProduct/:tagid', checkAuthenticated, function _callee25(req, res) {
  var i;
  return regeneratorRuntime.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          i = 0;
          email = req.user.email;
          ownername = req.user.username;
          Product_ID = req.params.tagid;
          fileUploadCtrl(req, res, function _callee24(err) {
            var _req$body3, Productname, colour, Mprice, Oprice, tags, ProductCats, Quantities, specs, InStock;

            return regeneratorRuntime.async(function _callee24$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    if (!err) {
                      _context24.next = 4;
                      break;
                    }

                    res.send(err);
                    _context24.next = 12;
                    break;

                  case 4:
                    _req$body3 = req.body, Productname = _req$body3.Productname, colour = _req$body3.colour, Mprice = _req$body3.Mprice, Oprice = _req$body3.Oprice, tags = _req$body3.tags, ProductCats = _req$body3.ProductCats, Quantities = _req$body3.Quantities, specs = _req$body3.specs, InStock = _req$body3.InStock;
                    console.log(specs);
                    console.log(tags);
                    Mprice = parseInt(Mprice);
                    Oprice = parseInt(Oprice);
                    _context24.next = 11;
                    return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").findOne({
                      email: email
                    }).then(function _callee23(emp_det) {
                      var newvalues;
                      return regeneratorRuntime.async(function _callee23$(_context23) {
                        while (1) {
                          switch (_context23.prev = _context23.next) {
                            case 0:
                              if (!emp_det) {
                                _context23.next = 9;
                                break;
                              }

                              CatLogs = {
                                $and: [{
                                  "Owner_Details.Owner_email": email
                                }, {
                                  PID: Product_ID
                                }]
                              };
                              newvalues = {
                                $set: {
                                  name: Productname,
                                  colour: colour,
                                  Mprice: Mprice,
                                  Oprice: Oprice,
                                  tag: tags,
                                  Specification: specs,
                                  Category: ProductCats,
                                  InStock: InStock,
                                  Quantities: Quantities
                                }
                              };
                              _context23.next = 5;
                              return regeneratorRuntime.awrap(db.getDB().collection("productcodes").updateOne(CatLogs, newvalues));

                            case 5:
                              productcode = _context23.sent;
                              return _context23.abrupt("return", productcode);

                            case 9:
                              throw new Error("Whoops!");

                            case 10:
                            case "end":
                              return _context23.stop();
                          }
                        }
                      });
                    }).then(function () {
                      while (i < 4) {
                        sharp(req.files[i].path).resize(1386, 1500).toFormat("jpeg").jpeg({
                          quality: 80
                        }).toFile('./static/hookah/' + Product_ID + '_' + i + ".jpeg");
                        sharp(req.files[i].path).resize(380, 380).toFormat("jpeg").jpeg({
                          quality: 90
                        }).toFile('./static/hookah/thumbnail/thumbnail-' + Product_ID + '_' + i + '.jpeg');
                        sharp(req.files[i].path).resize(100).toFormat("jpeg").jpeg({
                          quality: 50
                        }).toFile('./static/hookah/thumbnail_table_icon/thumbnail_table_icon-' + Product_ID + '_' + i + '.jpeg');
                        i++;
                      }
                    })["catch"](function (err) {
                      return console.log(err);
                    })["finally"](function () {
                      res.redirect('/dashboard/yourshop');
                    }));

                  case 11:
                    employee_details = _context24.sent;

                  case 12:
                  case "end":
                    return _context24.stop();
                }
              }
            });
          });

        case 5:
        case "end":
          return _context25.stop();
      }
    }
  });
});
myrouter.post('/Dashboard/EMP_ID_PAGE', checkAuthenticated, function _callee31(req, res) {
  var myquery;
  return regeneratorRuntime.async(function _callee31$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          Product_ID = req.query.pid;
          DeletePID = {
            PID: Product_ID
          };
          myquery = {
            $and: [{
              "Owner_Details.Owner_email": req.user.email
            }, {
              PID: Product_ID
            }]
          };
          _context31.next = 5;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne(myquery).then(function _callee26(productcode) {
            return regeneratorRuntime.async(function _callee26$(_context26) {
              while (1) {
                switch (_context26.prev = _context26.next) {
                  case 0:
                    if (!productcode) {
                      _context26.next = 6;
                      break;
                    }

                    _context26.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").deleteOne(DeletePID));

                  case 3:
                    productDelete = _context26.sent;
                    _context26.next = 7;
                    break;

                  case 6:
                    throw new Error("Whoops!");

                  case 7:
                  case "end":
                    return _context26.stop();
                }
              }
            });
          }).then(function _callee27() {
            return regeneratorRuntime.async(function _callee27$(_context27) {
              while (1) {
                switch (_context27.prev = _context27.next) {
                  case 0:
                    _context27.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("userRating").deleteMany({
                      P_ID: Product_ID
                    }));

                  case 2:
                    return _context27.abrupt("return", RatingDelete = _context27.sent);

                  case 3:
                  case "end":
                    return _context27.stop();
                }
              }
            });
          }).then(function _callee28() {
            return regeneratorRuntime.async(function _callee28$(_context28) {
              while (1) {
                switch (_context28.prev = _context28.next) {
                  case 0:
                    _context28.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").countDocuments({
                      "Owner_Details.Owner_email": req.user.email
                    }));

                  case 2:
                    return _context28.abrupt("return", T_counts = _context28.sent);

                  case 3:
                  case "end":
                    return _context28.stop();
                }
              }
            });
          }).then(function _callee29(T_counts) {
            var myquery, newvalues;
            return regeneratorRuntime.async(function _callee29$(_context29) {
              while (1) {
                switch (_context29.prev = _context29.next) {
                  case 0:
                    myquery = {
                      email: req.user.email
                    };
                    newvalues = {
                      $set: {
                        TotalProducts: T_counts
                      }
                    };
                    _context29.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("EMPLOYEE_ID").updateOne(myquery, newvalues));

                  case 4:
                    update = _context29.sent;

                  case 5:
                  case "end":
                    return _context29.stop();
                }
              }
            });
          }).then(function _callee30() {
            return regeneratorRuntime.async(function _callee30$(_context30) {
              while (1) {
                switch (_context30.prev = _context30.next) {
                  case 0:
                    _context30.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("userCart").deleteMany(DeletePID));

                  case 2:
                    cartDelete = _context30.sent;

                  case 3:
                  case "end":
                    return _context30.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          })["finally"](function (done) {
            return res.send("done");
          }));

        case 5:
          productcode = _context31.sent;

        case 6:
        case "end":
          return _context31.stop();
      }
    }
  });
});
module.exports = myrouter;