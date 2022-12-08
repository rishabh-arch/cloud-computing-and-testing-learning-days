"use strict";

var express = require('express');

var routes = express.Router();

var bodyparser = require('body-parser');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "prernagarg0509@gmail.com",
    pass: '9650199842p'
  }
});

var passport = require('passport');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var flash = require('connect-flash');

var myrouter = require('./HOME/ProductHome.js');

require('./passport')(passport);

require('dotenv').config();

var db = require('./mongoBase/db.js'); // using Bodyparser for getting form data
// routes.use(bodyparser.urlencoded({ extended: true }));
// using cookie-parser and session 
// MIDDLEWARES
// Global variable


myrouter.use(function (req, res, next) {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
});

var checkAuthenticated = function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    return next();
  } else {
    res.redirect('/login');
  }
};

myrouter.get('/auth/facebook', passport.authenticate('facebook'));
myrouter.get('/auth/fb/secrets', passport.authenticate('facebook', {
  failureRedirect: '/login'
}), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
}); // ALL THE ROUTES 

routes.get('/register', function (req, res) {
  res.render('register.pug');
}); // var mailOptions = {
//     from: mail,
//     to: to2,
//     subject: company,
//     html:"<H1>Welcome To Hookah Club</H1><P>CONGO! "+name+" </P><h4>Now you Become a HOOKIE MEMBER<h4><p>YOUR PROMOCODE IS HERE</P><h3>PromoCode- "+promocode+"<h3><P>now Make Money by just sharing Your PromoCode to get them a Discount</P>"
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       return (error);
//     } else {
//       return ('Email sent: ' + info.response);
//     };
//   });

routes.post('/register', function _callee3(req, res) {
  var _req$body, email, username, password, confirmpassword, Gender, TnC_check, uniqueID, err;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          Usertype = 'user';
          _req$body = req.body, email = _req$body.email, username = _req$body.username, password = _req$body.password, confirmpassword = _req$body.confirmpassword, Gender = _req$body.Gender, TnC_check = _req$body.TnC_check;

          if (req.body.type) {
            Usertype = req.body.type;
          } else {
            console.log("nothiongn is there");
          }

          uniqueID = "user".concat(Date.now());
          email = email.toLowerCase();

          if (!email || !username || !password || !Gender || !confirmpassword || !TnC_check || TnC_check != "check") {
            err = "Please Fill All The Fields...";
            res.render('register.pug', {
              'err': err
            });
          }

          if (password != confirmpassword) {
            err = "Passwords Don't Match";
            res.render('register.pug', {
              'err': err,
              'email': email,
              'username': username
            });
          }

          if (!(typeof err == 'undefined')) {
            _context3.next = 11;
            break;
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
            email: email
          }).then(function _callee2(users) {
            var token;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (users) {
                      err = "User Already Exists With This Email...";
                      res.render('register.pug', {
                        'err': err,
                        'email': email,
                        'username': username
                      });
                    } else {
                      token = jwt.sign({
                        username: username,
                        email: email,
                        password: password
                      }, process.env.JWT_ACC_ACTIVATE, {
                        expiresIn: '20m'
                      });
                      console.log(token);
                      bcrypt.genSalt(10, function (err, salt) {
                        if (err) throw new Error("#");
                        bcrypt.hash(password, salt, function _callee(err, hash) {
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
                                  password = hash;
                                  _context.next = 5;
                                  return regeneratorRuntime.awrap(db.getDB().collection("users").insertOne({
                                    email: email,
                                    username: username,
                                    password: password,
                                    Gender: Gender,
                                    Usertype: Usertype,
                                    uniqueID: uniqueID
                                  }).then(function () {
                                    req.flash('success_message', "Registered Successfully.. Login To Continue..");
                                    res.redirect('/login');
                                  })["catch"](function (err) {
                                    console.log(err);
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

                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }));

        case 10:
          users = _context3.sent;

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});
routes.get('/login', function (req, res) {
  username = "";
  res.render('login');
});
routes.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/',
    failureFlash: true
  })(req, res, next);
});
routes.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});
module.exports = routes;