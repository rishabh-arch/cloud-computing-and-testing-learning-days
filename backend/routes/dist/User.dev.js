"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var express = require('express');

var userRouter = express.Router();

var passport = require('passport');

var passportConfig = require('../passport');

var dotenv = require("dotenv");

var JWT = require('jsonwebtoken');

var bodyParser = require("body-parser");

var bcrypt = require('bcrypt');

var db = require('../mongoBase/db.js');

var validator = require('validator');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://prernagarg0509%40gmail.com:9650199842p@smtp.gmail.com');

var imageProcess = require('../Features/Multer');

dotenv.config({
  path: '../config.env'
});

var fs = require('fs');

var sharp = require('sharp');

var multer = require('multer');

var _require = require('crypto'),
    verify = _require.verify;

var storage = multer.memoryStorage();
var uploads = multer({
  storage: storage
});
var secret = process.env.secret;

var signToken = function signToken(userID) {
  return JWT.sign({
    iss: secret,
    sub: userID
  }, secret, {
    expiresIn: Date.now() + 99999999999
  });
};

userRouter.use(bodyParser.json()); // <--- Here

userRouter.use(bodyParser.urlencoded({
  extended: true
}));

var isValidPhone = function isValidPhone(phoneNumber) {
  var found = phoneNumber.search(/^(\+{1}\d{2,3}\s?[(]{1}\d{1,3}[)]{1}\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}$/);

  if (found > -1) {
    return true;
  } else {
    return false;
  }
};

userRouter.post('/userregistration', function (req, res) {
  var _req$body = req.body,
      first_name = _req$body.first_name,
      last_name = _req$body.last_name,
      email = _req$body.email,
      State = _req$body.State,
      City = _req$body.City,
      pwd = _req$body.pwd,
      cpwd = _req$body.cpwd,
      agree = _req$body.agree,
      contact = _req$body.contact;

  if (!first_name || !last_name || !email || !State || !City || !pwd || !cpwd || !agree || !contact) {
    return res.status(500).json({
      message: {
        msgBody: "please Fill all the Details",
        msgError: true
      }
    });
  }

  if (pwd.length < 10 || cpwd.length < 10) return res.status(500).json({
    message: {
      msgBody: "password should contain minimum 10 digits",
      msgError: true
    }
  });
  if (pwd !== cpwd) return res.status(500).json({
    message: {
      msgBody: "Password dont match",
      msgError: true
    }
  });
  db.getDB().collection("users").findOne({
    email: email
  }, function (err, user) {
    var role = "user";
    if (err) res.status(500).json({
      message: {
        msgBody: "Error has occured",
        msgError: true
      }
    });
    if (user) res.status(400).json({
      message: {
        msgBody: "email is already taken",
        msgError: true
      }
    });else {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) throw new Error("#");
        bcrypt.hash(pwd, salt, function _callee(err, hash) {
          var hash_pwd;
          return regeneratorRuntime.async(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!err) {
                    _context.next = 2;
                    break;
                  }

                  throw new Error("#");

                case 2:
                  hash_pwd = hash;
                  _context.next = 5;
                  return regeneratorRuntime.awrap(db.getDB().collection("users").insertOne({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    State: State,
                    City: City,
                    pwd: hash_pwd,
                    role: role,
                    contact: contact
                  }).then(function () {
                    res.status(200).json({
                      message: {
                        msgBody: "Account successfully created",
                        msgError: false
                      }
                    });
                  })["catch"](function (err) {
                    res.status(500).json({
                      message: {
                        msgBody: "Error has occured",
                        msgError: true
                      }
                    });
                  }));

                case 5:
                  users_insert = _context.sent;

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          });
        });
      });
    }
  });
});
userRouter.post('/userLogin', passport.authenticate('local', {
  session: false
}), function (req, res) {
  if (req.isAuthenticated()) {
    var _req$user = req.user,
        _id = _req$user._id,
        email = _req$user.email,
        role = _req$user.role;
    var token = signToken(_id);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: true,
      expires: new Date(Date.now() + 99999999999)
    });
    res.status(200).json({
      isAuthenticated: true,
      user: {
        email: email,
        role: role
      }
    });
  }
});
userRouter.get('/logout', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  res.clearCookie('access_token');
  res.json({
    user: {
      email: "",
      role: ""
    },
    success: true
  });
});
userRouter.get('/admin', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  if (req.user.role === 'admin') {
    res.status(200).json({
      message: {
        msgBody: 'You are an admin',
        msgError: false
      }
    });
  } else res.status(403).json({
    message: {
      msgBody: "You're not an admin,go away",
      msgError: true
    }
  });
});
userRouter.get('/authenticated', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _req$user2 = req.user,
      email = _req$user2.email,
      role = _req$user2.role;
  res.status(200).json({
    isAuthenticated: true,
    user: {
      email: email,
      role: role
    }
  });
});

var nextInterceptor = function nextInterceptor(error) {
  if (error) {
    throw error;
  }
};

var combineMiddlewares = function combineMiddlewares(middlewares) {
  return function (req, res, next) {
    return middlewares.reduce(function (previousMiddleware, currentMiddleware) {
      return previousMiddleware.then(function () {
        return currentMiddleware(req, res, nextInterceptor);
      });
    }, Promise.resolve()).then(function () {
      return next();
    })["catch"](next);
  };
};

var passport_auth = passport.authenticate('jwt', {
  session: false
}); // const upload_mid = upload_image.single("news_image");

var upload_mid = uploads.single('news_image'); //   const commonMiddlewares = combineMiddlewares([getDeviceLocation, getDeviceClient]);

userRouter.post('/Postnews', [passport_auth, upload_mid], function _callee3(req, res) {
  var _req$body2, news_title, news_box, news_hash, createID, user_verify;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, news_title = _req$body2.news_title, news_box = _req$body2.news_box, news_hash = _req$body2.news_hash;

          if (!(req.user.role === 'admin')) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(406).json({
            error: "Admin Cant Post!"
          }));

        case 3:
          createID = Date.now();

          if (!(!req.user || !news_title || !news_box)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(406).json({
            error: "please Fill all Boxes!"
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: req.user.email
          }).then(function _callee2(user_verify) {
            var countPosts, filename;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!user_verify) {
                      _context2.next = 17;
                      break;
                    }

                    _context2.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection('newsPost').countDocuments({
                      email: req.user.email
                    }));

                  case 3:
                    countPosts = _context2.sent;
                    console.log(countPosts);

                    if (!(countPosts > 20)) {
                      _context2.next = 9;
                      break;
                    }

                    res.status(401).json({
                      error: "Not more than 20"
                    });
                    _context2.next = 15;
                    break;

                  case 9:
                    _context2.next = 11;
                    return regeneratorRuntime.awrap(imageProcess(req));

                  case 11:
                    filename = _context2.sent;
                    _context2.next = 14;
                    return regeneratorRuntime.awrap(db.getDB().collection("newsPost").insertOne({
                      news_ID: createID,
                      email: req.user.email,
                      news_title: news_title,
                      news_box: news_box,
                      news_image: filename,
                      news_hash: news_hash.split(",")
                    }));

                  case 14:
                    res.status(200).json({
                      msg: "successfully post"
                    });

                  case 15:
                    _context2.next = 18;
                    break;

                  case 17:
                    throw new Error();

                  case 18:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(401).json({
              error: "May you left something"
            });
          }));

        case 10:
          user_verify = _context3.sent;

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});
userRouter.get('/Postnews', function _callee4(req, res) {
  var skipPages, Search_regex, SkipItems, news_post, itemCount;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          skipPages = parseInt(req.query.page);
          Search_regex = new RegExp(req.query.ss, 'i');
          if (req.query.ss === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) Search_regex = Search_regex = new RegExp("", 'i');
          SkipItems = 1;
          if (skipPages > 1) SkipItems = skipPages * 20;else SkipItems = 0;
          _context4.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("newsPost").find({
            $or: [{
              news_hash: Search_regex
            }, {
              news_title: Search_regex
            }, {
              news_image: Search_regex
            }]
          }).sort({
            _id: -1
          }).skip(SkipItems).limit(20).toArray());

        case 7:
          news_post = _context4.sent;
          _context4.next = 10;
          return regeneratorRuntime.awrap(db.getDB().collection("newsPost").estimatedDocumentCount());

        case 10:
          itemCount = _context4.sent;
          res.status(200).json({
            news_post: news_post,
            itemCount: itemCount
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
});
userRouter.post('/searchResource', function _callee5(req, res) {
  var StateArray, _req$body3, District_One, State_One, Resource_One, State_regex, District_regex, Resource_regex, resourceTable;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          StateArray = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"];
          _req$body3 = req.body, District_One = _req$body3.District_One, State_One = _req$body3.State_One, Resource_One = _req$body3.Resource_One;
          State_regex = new RegExp(StateArray[State_One], 'i');
          District_regex = new RegExp(District_One, 'i');
          Resource_regex = new RegExp(Resource_One, 'i');
          _context5.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").find({
            Resource_One: Resource_regex,
            City: District_regex,
            State: State_regex
          }).sort({
            _id: -1
          }).limit(100).toArray());

        case 7:
          resourceTable = _context5.sent;
          res.status(200).json({
            resourceTable: resourceTable
          });

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
});
userRouter.post('/postResource', passport_auth, function _callee7(req, res) {
  var _req$user3, first_name, last_name, email, State, City, contact, role, _req$body4, Address, Address_one, Resource_One, createID, myquery, Addressobj, Address_oneobj, userAlreadyPosts, countUserPost, user_Address;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$user3 = req.user, first_name = _req$user3.first_name, last_name = _req$user3.last_name, email = _req$user3.email, State = _req$user3.State, City = _req$user3.City, contact = _req$user3.contact, role = _req$user3.role;
          _req$body4 = req.body, Address = _req$body4.Address, Address_one = _req$body4.Address_one, Resource_One = _req$body4.Resource_One;

          if (!(role === 'admin')) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(406).json({
            error: "Admin Cant Post!"
          }));

        case 4:
          createID = Date.now();

          if (!(Resource_One === "")) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(406).json({
            error: "Fill Everything!"
          }));

        case 7:
          myquery = {
            email: email
          };
          Addressobj = {
            $set: {
              Address: Address
            }
          };
          Address_oneobj = {
            $set: {
              Address_one: Address_one
            }
          };
          _context7.next = 12;
          return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").findOne({
            email: email,
            Resource_One: Resource_One
          }));

        case 12:
          userAlreadyPosts = _context7.sent;

          if (!userAlreadyPosts) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", res.status(406).json({
            error: "Already Posted"
          }));

        case 15:
          _context7.next = 17;
          return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").countDocuments({
            email: email
          }));

        case 17:
          countUserPost = _context7.sent;

          if (!(countUserPost > 6)) {
            _context7.next = 20;
            break;
          }

          return _context7.abrupt("return", res.status(406).json({
            error: "You had Filled everything ALready!"
          }));

        case 20:
          if (!(Address !== "" && Address)) {
            _context7.next = 23;
            break;
          }

          _context7.next = 23;
          return regeneratorRuntime.awrap(db.getDB().collection("usersAddress").updateOne(myquery, Addressobj, {
            upsert: true
          }));

        case 23:
          if (!(Address_one !== "" && Address_one)) {
            _context7.next = 26;
            break;
          }

          _context7.next = 26;
          return regeneratorRuntime.awrap(db.getDB().collection("usersAddress").updateOne(myquery, Address_oneobj, {
            upsert: true
          }));

        case 26:
          _context7.next = 28;
          return regeneratorRuntime.awrap(db.getDB().collection("usersAddress").findOne({
            email: email
          }).then(function _callee6(user_Address) {
            var user_verify, insertResource;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                      email: email
                    }));

                  case 2:
                    user_verify = _context6.sent;

                    if (!user_verify) {
                      _context6.next = 7;
                      break;
                    }

                    _context6.next = 6;
                    return regeneratorRuntime.awrap(db.getDB().collection('resourceTable').insertOne(_defineProperty({
                      Res_ID: createID,
                      OrgName: "".concat(first_name, " ").concat(last_name),
                      email: email,
                      State: State,
                      City: City,
                      contact: contact,
                      Resource_One: Resource_One,
                      Address_one: user_Address.Address_one,
                      Address: user_Address.Address
                    }, "Resource_One", Resource_One)));

                  case 6:
                    insertResource = _context6.sent;

                  case 7:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          }).then(function () {
            return res.status(200).json({
              message: "Thanks For add Supplies"
            });
          })["catch"](function (err) {
            return res.status(406).json({
              error: "Something Wrong!"
            });
          }));

        case 28:
          user_Address = _context7.sent;

        case 29:
        case "end":
          return _context7.stop();
      }
    }
  });
});
userRouter.post('/userDetail', passport_auth, function _callee9(req, res) {
  var _req$user4, email, State, City, contact, auth_email, body_email;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$user4 = req.user, email = _req$user4.email, State = _req$user4.State, City = _req$user4.City, contact = _req$user4.contact;
          auth_email = email;
          body_email = req.body.email;

          if (!(auth_email === body_email)) {
            _context9.next = 8;
            break;
          }

          _context9.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("usersAddress").findOne({
            email: body_email
          }).then(function _callee8(userAddress) {
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (userAddress) res.status(200).json({
                      Address: userAddress.Address,
                      Address_one: userAddress.Address_one,
                      user_State: State,
                      user_City: City,
                      user_Contact: contact
                    });else res.status(200).json({
                      Address: "",
                      Address_one: "",
                      user_State: State,
                      user_City: City,
                      user_Contact: contact
                    });

                  case 1:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(401).json({
              error: "UnAuthorised Error"
            });
          }));

        case 6:
          _context9.next = 9;
          break;

        case 8:
          res.status(401).json({
            error: "UnAuthorised Error"
          });

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  });
});
userRouter.post('/userNewsData', passport_auth, function _callee11(req, res) {
  var email, auth_email, body_email;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          email = req.user.email;
          auth_email = email;
          body_email = req.body.email;

          if (!(auth_email === body_email)) {
            _context11.next = 8;
            break;
          }

          _context11.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("newsPost").find({
            email: body_email
          }).toArray().then(function _callee10(NewsData) {
            return regeneratorRuntime.async(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    res.status(200).json({
                      NewsData: NewsData
                    });

                  case 1:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(401).json({
              error: "UnAuthorised Error"
            });
          }));

        case 6:
          _context11.next = 9;
          break;

        case 8:
          res.status(401).json({
            error: "UnAuthorised Error"
          });

        case 9:
        case "end":
          return _context11.stop();
      }
    }
  });
});
userRouter.post('/DeleteuserNewsData', passport_auth, function _callee13(req, res) {
  var email, auth_email, body_email, SelectedInp;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          email = req.user.email;
          auth_email = email;
          body_email = req.body.user.email;
          SelectedInp = req.body.SelectedInp.map(Number);

          if (!(auth_email === body_email)) {
            _context13.next = 9;
            break;
          }

          _context13.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: body_email
          }).then(function _callee12(user) {
            var Result, deleteResult, NewsData;
            return regeneratorRuntime.async(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    if (!user) {
                      _context12.next = 17;
                      break;
                    }

                    _context12.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("newsPost").find({
                      "news_ID": {
                        $in: _toConsumableArray(SelectedInp)
                      }
                    }).toArray());

                  case 3:
                    Result = _context12.sent;
                    console.log(Result);
                    _context12.next = 7;
                    return regeneratorRuntime.awrap(db.getDB().collection("newsPost").deleteMany({
                      "news_ID": {
                        $in: _toConsumableArray(SelectedInp)
                      }
                    }));

                  case 7:
                    deleteResult = _context12.sent;

                    if (!(deleteResult && Result.length > 0)) {
                      _context12.next = 16;
                      break;
                    }

                    _context12.next = 11;
                    return regeneratorRuntime.awrap(db.getDB().collection("newsPost").find({
                      email: body_email
                    }).toArray());

                  case 11:
                    NewsData = _context12.sent;
                    Result.forEach(function (image, i) {
                      fs.unlink("../frontend/public/uploads/".concat(image.news_image), function (err) {
                        if (err) throw err;
                      });
                      fs.unlink("../frontend/public/uploads/thumbnail/".concat(image.news_image), function (err) {
                        if (err) throw err;
                      });
                    });
                    return _context12.abrupt("return", res.status(200).json({
                      NewsData: NewsData,
                      Message: "Deleted"
                    }));

                  case 16:
                    return _context12.abrupt("return", res.status(401).json({
                      error: "No Data Error"
                    }));

                  case 17:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          }));

        case 7:
          _context13.next = 10;
          break;

        case 9:
          return _context13.abrupt("return", res.status(401).json({
            error: "UnAuthorised Error"
          }));

        case 10:
        case "end":
          return _context13.stop();
      }
    }
  });
});
userRouter.post('/userResourceData', passport_auth, function _callee15(req, res) {
  var email, auth_email, body_email;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          email = req.user.email;
          auth_email = email;
          body_email = req.body.email;

          if (!(auth_email === body_email)) {
            _context15.next = 8;
            break;
          }

          _context15.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").find({
            email: body_email
          }).toArray().then(function _callee14(NewsData) {
            return regeneratorRuntime.async(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    res.status(200).json({
                      NewsData: NewsData
                    });

                  case 1:
                  case "end":
                    return _context14.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(401).json({
              error: "UnAuthorised Error"
            });
          }));

        case 6:
          _context15.next = 9;
          break;

        case 8:
          res.status(401).json({
            error: "UnAuthorised Error"
          });

        case 9:
        case "end":
          return _context15.stop();
      }
    }
  });
});
userRouter.post('/DeleteuserResourceData', passport_auth, function _callee17(req, res) {
  var email, auth_email, body_email, SelectedInp;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          email = req.user.email;
          auth_email = email;
          body_email = req.body.user.email;
          SelectedInp = req.body.SelectedInp.map(Number);

          if (!(auth_email === body_email)) {
            _context17.next = 9;
            break;
          }

          _context17.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: body_email
          }).then(function _callee16(user) {
            var deleteResult, NewsData;
            return regeneratorRuntime.async(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    if (!user) {
                      _context16.next = 12;
                      break;
                    }

                    _context16.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").deleteMany({
                      "Res_ID": {
                        $in: _toConsumableArray(SelectedInp)
                      }
                    }));

                  case 3:
                    deleteResult = _context16.sent;

                    if (!deleteResult) {
                      _context16.next = 11;
                      break;
                    }

                    _context16.next = 7;
                    return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").find({
                      email: body_email
                    }).toArray());

                  case 7:
                    NewsData = _context16.sent;
                    res.status(200).json({
                      NewsData: NewsData,
                      Message: "Deleted"
                    });
                    _context16.next = 12;
                    break;

                  case 11:
                    return _context16.abrupt("return", res.status(401).json({
                      error: "No Data Error"
                    }));

                  case 12:
                  case "end":
                    return _context16.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(401).json({
              error: "No Data Error"
            });
          }));

        case 7:
          _context17.next = 10;
          break;

        case 9:
          res.status(401).json({
            error: "UnAuthorised Error"
          });

        case 10:
        case "end":
          return _context17.stop();
      }
    }
  });
});
userRouter.get('/inputSearch', function _callee18(req, res) {
  var fromNews, fromResource;
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          Search_regex = new RegExp(req.query.input, 'i');
          _context18.next = 3;
          return regeneratorRuntime.awrap(db.getDB().collection("newsPost").countDocuments({
            $or: [{
              news_hash: Search_regex
            }, {
              news_title: Search_regex
            }, {
              news_image: Search_regex
            }]
          }));

        case 3:
          fromNews = _context18.sent;
          _context18.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").find({
            $or: [{
              Resource_One: Search_regex
            }, {
              State: Search_regex
            }, {
              City: Search_regex
            }, {
              Address: Search_regex
            }]
          }).toArray());

        case 6:
          fromResource = _context18.sent;
          res.status(200).json({
            fromNews: fromNews,
            fromResource: fromResource
          });

        case 8:
        case "end":
          return _context18.stop();
      }
    }
  });
});
userRouter.post('/admin_Control', passport_auth, function _callee21(req, res) {
  var action, Admin_email, Admin_role, Auth_Admin_email, Auth_Admin_role, reference;
  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          action = req.query.action;
          Admin_email = req.body.user.email;
          Admin_role = req.body.user.role;
          Auth_Admin_email = req.user.email;
          Auth_Admin_role = req.user.role;
          reference = req.body.reference;

          if (!(Admin_email === Auth_Admin_email && Admin_role === Auth_Admin_role && Admin_role === 'admin')) {
            _context21.next = 9;
            break;
          }

          _context21.next = 9;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: Admin_email,
            role: 'admin'
          }).then(function _callee19(verifyUser) {
            var Result, deleteResult, _Result;

            return regeneratorRuntime.async(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    if (!verifyUser) {
                      _context19.next = 32;
                      break;
                    }

                    if (!(action === '100')) {
                      _context19.next = 6;
                      break;
                    }

                    _context19.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").deleteOne({
                      Res_ID: reference
                    }));

                  case 4:
                    _context19.next = 32;
                    break;

                  case 6:
                    if (!(action === '200')) {
                      _context19.next = 16;
                      break;
                    }

                    _context19.next = 9;
                    return regeneratorRuntime.awrap(db.getDB().collection('newsPost').find({
                      news_ID: reference
                    }).toArray());

                  case 9:
                    Result = _context19.sent;
                    _context19.next = 12;
                    return regeneratorRuntime.awrap(db.getDB().collection("newsPost").deleteOne({
                      news_ID: reference
                    }));

                  case 12:
                    deleteResult = _context19.sent;

                    if (Result.length > 0) {
                      Result.forEach(function (image, i) {
                        fs.unlink("../frontend/public/uploads/".concat(image.news_image), function (err) {
                          if (err) throw err;
                        });
                        fs.unlink("../frontend/public/uploads/thumbnail/".concat(image.news_image), function (err) {
                          if (err) throw err;
                        });
                      });
                    }

                    _context19.next = 32;
                    break;

                  case 16:
                    if (!(action === '300')) {
                      _context19.next = 31;
                      break;
                    }

                    _context19.next = 19;
                    return regeneratorRuntime.awrap(db.getDB().collection('newsPost').find({
                      email: reference
                    }).toArray());

                  case 19:
                    _Result = _context19.sent;
                    _context19.next = 22;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").deleteOne({
                      email: reference
                    }));

                  case 22:
                    _context19.next = 24;
                    return regeneratorRuntime.awrap(db.getDB().collection("usersAddress").deleteOne({
                      email: reference
                    }));

                  case 24:
                    _context19.next = 26;
                    return regeneratorRuntime.awrap(db.getDB().collection("resourceTable").deleteMany({
                      email: reference
                    }));

                  case 26:
                    _context19.next = 28;
                    return regeneratorRuntime.awrap(db.getDB().collection("newsPost").deleteMany({
                      email: reference
                    }));

                  case 28:
                    if (_Result.length > 0) {
                      _Result.forEach(function (image, i) {
                        fs.unlink("../frontend/public/uploads/".concat(image.news_image), function (err) {
                          if (err) throw err;
                        });
                        fs.unlink("../frontend/public/uploads/thumbnail/".concat(image.news_image), function (err) {
                          if (err) throw err;
                        });
                      });
                    }

                    _context19.next = 32;
                    break;

                  case 31:
                    throw new Error();

                  case 32:
                  case "end":
                    return _context19.stop();
                }
              }
            });
          }).then(function _callee20(deleteRes) {
            return regeneratorRuntime.async(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    return _context20.abrupt("return", res.status(200).json({
                      msg: "done"
                    }));

                  case 1:
                  case "end":
                    return _context20.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(401).json({
              msg: "something Wrong"
            });
          }));

        case 9:
        case "end":
          return _context21.stop();
      }
    }
  });
});
userRouter.post('/personQuery', function _callee22(req, res) {
  var _req$body5, Con_name, Con_email, Con_phone, Con_msg, mailOptions;

  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _req$body5 = req.body, Con_name = _req$body5.Con_name, Con_email = _req$body5.Con_email, Con_phone = _req$body5.Con_phone, Con_msg = _req$body5.Con_msg;

          if (!(!Con_name || !Con_email || !Con_phone || !Con_msg)) {
            _context22.next = 3;
            break;
          }

          return _context22.abrupt("return", res.status(401).json({
            msg: "please fill all details"
          }));

        case 3:
          validator.isEmail(Con_email);

          if (!(isValidPhone(Con_phone) && validator.isEmail(Con_email))) {
            _context22.next = 10;
            break;
          }

          mailOptions = {
            from: "prernagarg0509@gmail.com",
            to: "".concat(Con_email, ",rishabhgargts@gmail.com"),
            subject: "Query from Website",
            html: "<!DOCTYPE html>\n            <html lang=\"en\">\n            \n            <head>\n                <meta charset=\"UTF-8\">\n                <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                <title>Contact Query</title>\n            </head>\n            \n            <body>\n                <div style=\"font-size: 20px; padding: 30px; background: url('https://www.homecaremag.com/sites/default/files/O2-oxygen-507182002-_0.jpg'); background-repeat: no-repeat; \">\n                    <div style=\"font-weight: 900;\">\n                        ".concat(Con_name, "\n                    </div>\n            \n                        <div> ").concat(Con_email, "\n                        </div>\n                        <div> ").concat(Con_phone, "\n                        </div>\n                        <div> <p>").concat(Con_msg, "</p>\n                        </div>\n            \n            \n                </div>\n            </body>\n            \n            </html>")
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return error;
            } else {}

            ;
          });
          return _context22.abrupt("return", res.status(200).json({
            msg: "Your Query is sent to us"
          }));

        case 10:
          return _context22.abrupt("return", res.status(401).json({
            msg: "Check Email or Phone number"
          }));

        case 11:
        case "end":
          return _context22.stop();
      }
    }
  });
});
userRouter.post('/forgotUserPassword', function _callee23(req, res) {
  return regeneratorRuntime.async(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          user_email = req.body.email;
          _context23.next = 3;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: user_email
          }).then(function (userid) {
            if (userid) {
              var token = JWT.sign({
                user_email: user_email
              }, "SECRET", {
                expiresIn: '20m'
              });
              var mailOptions = {
                from: "prernagarg0509@gmail.com",
                to: user_email,
                subject: "OXYGEN",
                html: "<H1>Forgot Password</H1><P>Click on the link to change your password</P><p><a href=\"http://192.168.0.105:5000/NewPassword?token=".concat(token, "\">Click Here to Proceed</a>")
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return error;
                } else {
                  return res.status(200).json({
                    msg: "Check your email for password link"
                  });
                }

                ;
              });
            } else {
              throw new Error("This Email is not Registered");
            }
          })["catch"](function (err) {
            return res.status(401).json({
              msg: err.message
            });
          }));

        case 3:
          userid = _context23.sent;

        case 4:
        case "end":
          return _context23.stop();
      }
    }
  });
});
userRouter.post('/NewUserPassword', function _callee25(req, res) {
  var token;
  return regeneratorRuntime.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          token = req.body.token;

          if (!(token && token.length > 10)) {
            _context25.next = 5;
            break;
          }

          JWT.verify(token, "SECRET", function _callee24(err, decodedToken) {
            var _user_email;

            return regeneratorRuntime.async(function _callee24$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    if (!err) {
                      _context24.next = 4;
                      break;
                    }

                    return _context24.abrupt("return", res.status(401).json({
                      msg: "Link Not Verified or you reached the time limit 20 minutes"
                    }));

                  case 4:
                    _user_email = decodedToken.user_email;
                    _context24.next = 7;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                      email: _user_email
                    }).then(function (userid) {
                      if (userid) {
                        return res.status(200).json({
                          msg: "Link Verified"
                        });
                      } else {
                        throw new Error("user not found");
                      }
                    })["catch"](function (err) {
                      return res.status(401).json({
                        msg: err.message
                      });
                    }));

                  case 7:
                    userid = _context24.sent;

                  case 8:
                  case "end":
                    return _context24.stop();
                }
              }
            });
          });
          _context25.next = 6;
          break;

        case 5:
          return _context25.abrupt("return", res.status(401).json({
            msg: "Link Not Verified or you reached the time limit 20 minutes"
          }));

        case 6:
        case "end":
          return _context25.stop();
      }
    }
  });
});
userRouter.post('/NewUserPasswordVerified', function _callee29(req, res) {
  var _req$body6, token, user, pwd, cpwd;

  return regeneratorRuntime.async(function _callee29$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _req$body6 = req.body, token = _req$body6.token, user = _req$body6.user;
          pwd = user.pwd, cpwd = user.cpwd;

          if (!token) {
            _context29.next = 6;
            break;
          }

          JWT.verify(token, "SECRET", function _callee28(err, decodedToken) {
            var _user_email2;

            return regeneratorRuntime.async(function _callee28$(_context28) {
              while (1) {
                switch (_context28.prev = _context28.next) {
                  case 0:
                    if (!err) {
                      _context28.next = 4;
                      break;
                    }

                    return _context28.abrupt("return", res.status(401).json({
                      msg: "Link Not Verified or you reached the time limit 20 minutes"
                    }));

                  case 4:
                    if (!(!pwd || !cpwd)) {
                      _context28.next = 9;
                      break;
                    }

                    err = "Please Fill All The Fields...";
                    return _context28.abrupt("return", res.status(401).json({
                      msg: err
                    }));

                  case 9:
                    if (!(pwd != cpwd)) {
                      _context28.next = 14;
                      break;
                    }

                    err = "Passwords Don't Match";
                    return _context28.abrupt("return", res.status(401).json({
                      msg: err
                    }));

                  case 14:
                    _user_email2 = decodedToken.user_email;
                    _context28.next = 17;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                      email: _user_email2
                    }).then(function _callee26(users) {
                      return regeneratorRuntime.async(function _callee26$(_context26) {
                        while (1) {
                          switch (_context26.prev = _context26.next) {
                            case 0:
                              if (users) {
                                _context26.next = 4;
                                break;
                              }

                              throw new Error("User Not Found");

                            case 4:
                              _context26.next = 6;
                              return regeneratorRuntime.awrap(bcrypt.genSalt(10));

                            case 6:
                              salt = _context26.sent;
                              return _context26.abrupt("return", salt);

                            case 8:
                            case "end":
                              return _context26.stop();
                          }
                        }
                      });
                    }).then(function _callee27(salt) {
                      return regeneratorRuntime.async(function _callee27$(_context27) {
                        while (1) {
                          switch (_context27.prev = _context27.next) {
                            case 0:
                              if (!salt) {
                                _context27.next = 9;
                                break;
                              }

                              _context27.next = 3;
                              return regeneratorRuntime.awrap(bcrypt.hash(pwd, salt));

                            case 3:
                              hash = _context27.sent;
                              _context27.next = 6;
                              return regeneratorRuntime.awrap(db.getDB().collection("users").updateOne({
                                email: _user_email2
                              }, {
                                $set: {
                                  pwd: hash
                                }
                              }));

                            case 6:
                              users_insert = _context27.sent;
                              _context27.next = 10;
                              break;

                            case 9:
                              throw new Error("Something Wrong!");

                            case 10:
                            case "end":
                              return _context27.stop();
                          }
                        }
                      });
                    }).then(function () {
                      return res.status(200).json({
                        msg: "Password Changed"
                      });
                    })["catch"](function (err) {
                      return res.status(401).json({
                        msg: err.message
                      });
                    }));

                  case 17:
                    users = _context28.sent;

                  case 18:
                  case "end":
                    return _context28.stop();
                }
              }
            });
          });
          _context29.next = 7;
          break;

        case 6:
          return _context29.abrupt("return", res.status(401).json({
            msg: "Link not Found"
          }));

        case 7:
        case "end":
          return _context29.stop();
      }
    }
  });
});
userRouter.post('/ChangeToNewPassword', passport_auth, function _callee32(req, res) {
  var _req$body$newPwd, opwd, pwd, cpwd, user_email, body_email;

  return regeneratorRuntime.async(function _callee32$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          _req$body$newPwd = req.body.newPwd, opwd = _req$body$newPwd.opwd, pwd = _req$body$newPwd.pwd, cpwd = _req$body$newPwd.cpwd;
          user_email = req.user.email;
          body_email = req.body.user.email;

          if (!(!opwd || !pwd || !pwd)) {
            _context32.next = 5;
            break;
          }

          return _context32.abrupt("return", res.status(401).json({
            msg: "Fill All The fields"
          }));

        case 5:
          if (!(pwd.length < 10 || cpwd.length < 10)) {
            _context32.next = 7;
            break;
          }

          return _context32.abrupt("return", res.status(401).json({
            msg: "password should contain minimum 10 digits"
          }));

        case 7:
          if (!(user_email !== body_email)) {
            _context32.next = 9;
            break;
          }

          return _context32.abrupt("return", res.status(401).json({
            msg: "Something Wrong!"
          }));

        case 9:
          _context32.next = 11;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: user_email
          }).then(function _callee30(userOldPass) {
            return regeneratorRuntime.async(function _callee30$(_context30) {
              while (1) {
                switch (_context30.prev = _context30.next) {
                  case 0:
                    if (userOldPass) {
                      _context30.next = 4;
                      break;
                    }

                    throw new Error("User Doesn't Exists..");

                  case 4:
                    _context30.next = 6;
                    return regeneratorRuntime.awrap(bcrypt.compare(opwd, userOldPass.pwd));

                  case 6:
                    ConfirmOldPass = _context30.sent;
                    return _context30.abrupt("return", ConfirmOldPass);

                  case 8:
                  case "end":
                    return _context30.stop();
                }
              }
            });
          }).then(function _callee31(ConfirmOldPass) {
            return regeneratorRuntime.async(function _callee31$(_context31) {
              while (1) {
                switch (_context31.prev = _context31.next) {
                  case 0:
                    if (ConfirmOldPass) {
                      _context31.next = 4;
                      break;
                    }

                    throw new Error("Incorrect old Password!");

                  case 4:
                    _context31.next = 6;
                    return regeneratorRuntime.awrap(bcrypt.genSalt(10));

                  case 6:
                    salt = _context31.sent;
                    _context31.next = 9;
                    return regeneratorRuntime.awrap(bcrypt.hash(pwd, salt));

                  case 9:
                    hash = _context31.sent;
                    _context31.next = 12;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").updateOne({
                      email: user_email
                    }, {
                      $set: {
                        pwd: hash
                      }
                    }));

                  case 12:
                    users_insert = _context31.sent;
                    return _context31.abrupt("return", res.status(200).json({
                      msg: "Password Changed"
                    }));

                  case 14:
                  case "end":
                    return _context31.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(401).json({
              msg: err.message
            });
          }));

        case 11:
        case "end":
          return _context32.stop();
      }
    }
  });
});
module.exports = userRouter;