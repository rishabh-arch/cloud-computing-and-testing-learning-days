"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var express = require('express');

var myrouter = express.Router();

var fileUploadCtrl = require('../FileUp.js').hookah_Upload;

var sharp = require('sharp');

var path = require("path");

var fs = require("fs");

var app = express();
var port = 80;

var bodyparser = require('body-parser');

var nodemailer = require('nodemailer');

var domain = require("domain").create();

var _require = require("constants"),
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG = _require.SSL_OP_SSLEAY_080_CLIENT_DH_BUG;

var _require2 = require("console"),
    Console = _require2.Console;

var _require3 = require("path"),
    parse = _require3.parse;

var session = require('express-session');

var flash = require('connect-flash');

var passport = require('passport');

require('../passport')(passport);

var razorpay = require("razorpay");

var db = require('../mongoBase/db.js');

var spellcheck = require('./spellcheck.js');

var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer'); // EXPRESS SPECIFIC STUFF
// PUG SPECIFIC STUFF


app.set('view engine', 'pug'); // Set the template engine as pug

app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

var checkAuthenticated = function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    return next();
  } else {
    res.redirect('/login');
  }
};

myrouter.get('/Dashboard/productUpload', checkAuthenticated, function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = req.user.email;
          db.getDB().collection("users").findOne({
            email: email
          }).then(function (data) {
            if (data) {
              res.status(200).render('dashboard/productUpload.pug');
            } else {
              res.status(404).render("errorpage.pug");
            }
          })["catch"](function (err) {
            return console.log(err);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
var instance = new razorpay({
  key_id: 'rzp_test_prQcCHNWovj933',
  // your `KEY_ID`
  key_secret: 'jC8edUWi5A6rpNgoInWAPMj3' // your `KEY_SECRET`

});
myrouter.post('/Dashboard/productUpload', checkAuthenticated, function _callee7(req, res) {
  var i, countquery, countsUpdate, firstProductCode, Image;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          i = 0;
          Image = [0, 0, 0, 0];
          email = req.user.email;
          ownername = req.user.username;
          date_js = new Date();
          fileUploadCtrl(req, res, function _callee6(err) {
            var _req$body, Productname, colour, Mprice, Oprice, tags, ProductCats, Quantities, specs, InStock, brand;

            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!err) {
                      _context6.next = 4;
                      break;
                    }

                    res.send(err);
                    _context6.next = 11;
                    break;

                  case 4:
                    _req$body = req.body, Productname = _req$body.Productname, colour = _req$body.colour, Mprice = _req$body.Mprice, Oprice = _req$body.Oprice, tags = _req$body.tags, ProductCats = _req$body.ProductCats, Quantities = _req$body.Quantities, specs = _req$body.specs, InStock = _req$body.InStock, brand = _req$body.brand;

                    if (ProductCats != "Hookah" || ProductCats != "Pipes" || ProductCats != "Chillum" || ProductCats != "Flavours" || ProductCats != "Hookah Kit" || ProductCats != "Coal" || ProductCats != "OTHERS") {
                      ProductCats == "Hookah";
                    }

                    Mprice = parseInt(Mprice);
                    Oprice = parseInt(Oprice);
                    _context6.next = 10;
                    return regeneratorRuntime.awrap(db.getDB().collection("users").findOne({
                      email: email
                    }).then(function _callee2(emp_det) {
                      return regeneratorRuntime.async(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              if (!emp_det) {
                                _context2.next = 6;
                                break;
                              }

                              employee_details = emp_det;
                              T_counts = db.getDB().collection("productcodes").countDocuments({
                                "Owner_Details.Owner_email": email
                              });
                              return _context2.abrupt("return", T_counts);

                            case 6:
                              throw new Error("Whoops!");

                            case 7:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      });
                    }).then(function _callee3(T_counts) {
                      return regeneratorRuntime.async(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              T_counts = T_counts + 1;
                              countquery = {
                                EMPID: employee_details.EMPID
                              };
                              countsUpdate = {
                                $set: {
                                  TotalProducts: T_counts
                                }
                              };
                              db.getDB().collection("users").updateOne(countquery, countsUpdate);

                            case 4:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      });
                    }).then(function _callee4() {
                      return regeneratorRuntime.async(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              CatLogs = {
                                Category: ProductCats
                              };
                              _context4.next = 3;
                              return regeneratorRuntime.awrap(db.getDB().collection("productcodes").find(CatLogs).sort({
                                PID: -1
                              }).limit(1).toArray());

                            case 3:
                              productcode = _context4.sent;
                              return _context4.abrupt("return", productcode);

                            case 5:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      });
                    }).then(function _callee5(pc) {
                      var url_key, myobj;
                      return regeneratorRuntime.async(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              if (pc && pc.length > 0) {
                                firstProductCodeInt = parseInt(productcode[0].PID.substr(4)) + 1;
                                firstProductCodeCat = productcode[0].PID.substr(3, 1);
                                firstProductCode = "PID".concat(firstProductCodeCat).concat(firstProductCodeInt);
                              } else {
                                if (ProductCats == "Hookah") firstProductCode = "PIDH100001";else if (ProductCats == "Pipes") firstProductCode = "PIDP100002";else if (ProductCats == "Chillum") firstProductCode = "PIDC100003";else if (ProductCats == "Flavours") firstProductCode = "PIDF100004";else if (ProductCats == "Hookah Kit") firstProductCode = "PIDK100005";else if (ProductCats == "Coal") firstProductCode = "PIDC100006";else if (ProductCats == "OTHERS") firstProductCode = "PIDO100007";
                              }

                              TotalOrders = 0;
                              Owner_Details = [{
                                Owner_Adress: employee_details.shop_address
                              }, {
                                Owner_number: employee_details.phone
                              }, {
                                Owner_name: ownername
                              }, {
                                Owner_email: email
                              }, {
                                Owner_City: employee_details.City
                              }, {
                                Owner_State: employee_details.shop_state
                              }, {
                                Owner_pincode: employee_details.shop_pincode
                              }];
                              url_key = jwt.sign({
                                Productname: Productname,
                                colour: colour,
                                tags: tags,
                                ProductCats: ProductCats,
                                brand: brand,
                                Mprice: Mprice,
                                Oprice: Oprice,
                                Owner_Details: Owner_Details,
                                username: username
                              }, "hookahboi");
                              myobj = {
                                PID: firstProductCode,
                                users: employee_details.EMPID,
                                name: Productname,
                                colour: colour,
                                Mprice: Mprice,
                                Oprice: Oprice,
                                tag: tags,
                                P_Rate: [0, 0, 0, 0, 0],
                                Category: ProductCats,
                                Owner_Details: Owner_Details,
                                Quantities: Quantities,
                                brand: brand,
                                Specification: specs,
                                InStock: InStock,
                                TotalOrders: TotalOrders,
                                ID: employee_details._id,
                                Rating: 0,
                                url_key: url_key,
                                date_up: date_js
                              };
                              _context5.next = 7;
                              return regeneratorRuntime.awrap(db.getDB().collection("productcodes").insertOne(myobj));

                            case 7:
                              inserted = _context5.sent;

                            case 8:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      });
                    }).then(function () {
                      while (i < 4) {
                        if (req.files[i].path) {
                          Image[i] = 1;
                        }

                        console.log(_typeof(req.files[i].path));
                        sharp(req.files[i].path, {
                          failOnError: false
                        }).resize(1386, 1500).toFormat("jpeg").jpeg({
                          quality: 80
                        }).toFile('./static/hookah/' + firstProductCode + '_' + i + ".jpeg");
                        sharp(req.files[i].path, {
                          failOnError: false
                        }).resize(380, 380).toFormat("jpeg").jpeg({
                          quality: 90
                        }).toFile('./static/hookah/thumbnail/thumbnail-' + firstProductCode + '_' + i + '.jpeg');
                        sharp(req.files[i].path, {
                          failOnError: false
                        }).resize(100).toFormat("jpeg").jpeg({
                          quality: 50
                        }).toFile('./static/hookah/thumbnail_table_icon/thumbnail_table_icon-' + firstProductCode + '_' + i + '.jpeg');
                        i++;
                      }

                      console.log(Image);
                    })["catch"](function (err) {
                      return console.log(err);
                    })["finally"](function () {
                      res.redirect('/dashboard/yourshop');
                    }));

                  case 10:
                    employee_details = _context6.sent;

                  case 11:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          });

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  });
});
myrouter.get('/checkout', checkAuthenticated, function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          user_email = req.user.email;
          _context9.next = 3;
          return regeneratorRuntime.awrap(db.getDB().collection('userCart').find({
            email: user_email
          }).toArray().then(function _callee8(userCart) {
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (userCart && userCart.length > 0) {
                      res.status(200).render("checkout.pug", {
                        userCart: userCart,
                        "page_title": "DotMatrix.com: Checkout"
                      });
                    } else {
                      res.status(200).render('underReview_.pug', {
                        result: "No items In Your Cart",
                        result2: "Add your Items here",
                        "page_title": "DotMatrix.com: Checkout"
                      });
                    }

                  case 1:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 3:
          userCart = _context9.sent;

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
});
myrouter.get('/searchbar', function _callee14(req, res) {
  var regex, key, correct, employeeFilter;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          regex = new RegExp(req.query["term"], 'i');
          key = req.query.key;

          correct = function correct(cb) {
            spellcheck("hpme", function (result) {
              rat = result;
              cb();
            });
          };

          if (!(key == "Home")) {
            _context14.next = 9;
            break;
          }

          _context14.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").aggregate([{
            $unwind: '$Owner_Details'
          }, {
            $addFields: {
              OwnerPhone: {
                $toString: "$Owner_Details.Owner_number"
              },
              OwnerEmail: {
                $toString: "$Owner_Details.Owner_email"
              },
              OwnerState: {
                $toString: "$Owner_Details.Owner_State"
              },
              OwnerCity: {
                $toString: "$Owner_Details.Owner_City"
              },
              EMPLOYEEID: {
                $toString: "$users"
              }
            }
          }, {
            $match: {
              $or: [{
                name: regex
              }, {
                PID: regex
              }, {
                OwnerPhone: regex
              }, {
                OwnerState: regex
              }, {
                OwnerCity: regex
              }, {
                brand: regex
              }, {
                Category: regex
              }, {
                colour: regex
              }, {
                tags: regex
              }]
            }
          }, {
            "$group": {
              "_id": "$name"
            }
          }, {
            $replaceRoot: {
              newRoot: {
                label: "$_id"
              }
            }
          }, {
            $sort: {
              Rating: -1
            }
          }, {
            $limit: 15
          }]).toArray().then(function _callee10(employeeFilter) {
            var employeeFilter_email;
            return regeneratorRuntime.async(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    if (!(employeeFilter.length > 0)) {
                      _context10.next = 5;
                      break;
                    }

                    console.log(employeeFilter);
                    res.jsonp(employeeFilter);
                    _context10.next = 9;
                    break;

                  case 5:
                    _context10.next = 7;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").aggregate([{
                      $unwind: '$Owner_Details'
                    }, {
                      $addFields: {
                        OwnerEmail: {
                          $toString: "$Owner_Details.Owner_email"
                        },
                        EMPLOYEEID: {
                          $toString: "$users"
                        }
                      }
                    }, {
                      $match: {
                        $or: [{
                          OwnerEmail: regex
                        }, {
                          EMPLOYEEID: regex
                        }]
                      }
                    }, {
                      "$group": {
                        "_id": "$OwnerEmail"
                      }
                    }, {
                      $replaceRoot: {
                        newRoot: {
                          label: "$_id"
                        }
                      }
                    }, {
                      $sort: {
                        Rating: -1
                      }
                    }, {
                      $limit: 15
                    }]).toArray());

                  case 7:
                    employeeFilter_email = _context10.sent;
                    res.jsonp(employeeFilter_email);

                  case 9:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 6:
          employeeFilter = _context14.sent;
          _context14.next = 35;
          break;

        case 9:
          if (!(key == "DONE" || key == "Pending" || key == "OnWay" || key == "")) {
            _context14.next = 17;
            break;
          }

          if (!req.isAuthenticated()) {
            _context14.next = 15;
            break;
          }

          user_email = req.user.email;
          _context14.next = 14;
          return regeneratorRuntime.awrap(db.getDB().collection("OrderID").aggregate([{
            $unwind: '$Owner_Details'
          }, {
            $match: {
              'Owner_Details.Owner_email': user_email,
              $or: [{
                name: regex
              }, {
                P_ID2: regex
              }, {
                email: regex
              }, {
                Address: regex
              }, {
                OID2: regex
              }, {
                Status: regex
              }, {
                date_od: regex
              }, {
                phone: regex
              }]
            }
          }, {
            "$group": {
              "_id": "$name"
            }
          }, {
            $replaceRoot: {
              newRoot: {
                label: "$_id"
              }
            }
          }, {
            $sort: {
              OID: -1
            }
          }, {
            $limit: 15
          }]).toArray().then(function _callee11(employeeFilter) {
            return regeneratorRuntime.async(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    if (employeeFilter) {
                      res.jsonp(employeeFilter);
                    }

                  case 1:
                  case "end":
                    return _context11.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 14:
          employeeFilter = _context14.sent;

        case 15:
          _context14.next = 35;
          break;

        case 17:
          if (!(key == "EMP_ID_PAGE")) {
            _context14.next = 27;
            break;
          }

          if (!req.isAuthenticated()) {
            _context14.next = 25;
            break;
          }

          user_email = req.user.email;
          _context14.next = 22;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").aggregate([{
            $unwind: '$Owner_Details'
          }, {
            $match: {
              'Owner_Details.Owner_email': user_email,
              $or: [{
                name: regex
              }, {
                colour: regex
              }, {
                brand: regex
              }, {
                Category: regex
              }, {
                InStock: regex
              }, {
                tag: regex
              }, {
                PID: regex
              }]
            }
          }, {
            "$group": {
              "_id": "$name"
            }
          }, {
            $replaceRoot: {
              newRoot: {
                label: "$_id"
              }
            }
          }, {
            $sort: {
              date_up: -1
            }
          }, {
            $limit: 15
          }]).toArray().then(function _callee12(employeeFilter) {
            return regeneratorRuntime.async(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    if (employeeFilter) {
                      res.jsonp(employeeFilter);
                    }

                  case 1:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 22:
          employeeFilter = _context14.sent;
          _context14.next = 25;
          break;

        case 25:
          _context14.next = 35;
          break;

        case 27:
          if (!(key == "forComment")) {
            _context14.next = 35;
            break;
          }

          if (!req.isAuthenticated()) {
            _context14.next = 35;
            break;
          }

          user_email = req.user.email;
          _context14.next = 32;
          return regeneratorRuntime.awrap(db.getDB().collection("userRating").aggregate([{
            $unwind: '$email'
          }, {
            $match: {
              Owner_email: user_email,
              P_ID: regex
            }
          }, {
            "$group": {
              "_id": "$P_ID"
            }
          }, {
            $replaceRoot: {
              newRoot: {
                label: "$_id"
              }
            }
          }, {
            $sort: {
              date_up: -1
            }
          }, {
            $limit: 15
          }]).toArray().then(function _callee13(commentFiter) {
            return regeneratorRuntime.async(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    if (commentFiter) {
                      // console.log(employeeFilter)
                      res.jsonp(commentFiter);
                    }

                  case 1:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 32:
          employeeFilter = _context14.sent;
          _context14.next = 35;
          break;

        case 35:
        case "end":
          return _context14.stop();
      }
    }
  });
});
myrouter.post('/dashboard/OrderRequest', checkAuthenticated, function _callee20(req, res) {
  var myquery, newvalues, Product;
  return regeneratorRuntime.async(function _callee20$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          Product = function _ref(myquery, Payment, PromoCode, quantity, PID) {
            return regeneratorRuntime.async(function Product$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    _context20.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne({
                      PID: PID
                    }).then(function _callee17(Productcodes) {
                      var newvalues;
                      return regeneratorRuntime.async(function _callee17$(_context17) {
                        while (1) {
                          switch (_context17.prev = _context17.next) {
                            case 0:
                              if (!Productcodes) {
                                _context17.next = 12;
                                break;
                              }

                              TotalOrders = parseInt(Productcodes.TotalOrders) + quantity;
                              newvalues = {
                                $set: {
                                  TotalOrders: TotalOrders
                                }
                              };
                              _context17.next = 5;
                              return regeneratorRuntime.awrap(db.getDB().collection("productcodes").updateOne({
                                PID: PID
                              }, newvalues));

                            case 5:
                              product_update = _context17.sent;
                              _context17.next = 8;
                              return regeneratorRuntime.awrap(db.getDB().collection("promocodes").findOne({
                                PromoCode: PromoCode
                              }));

                            case 8:
                              promocodes = _context17.sent;
                              return _context17.abrupt("return", promocodes);

                            case 12:
                              res.status(404).render("errorpage.pug");

                            case 13:
                            case "end":
                              return _context17.stop();
                          }
                        }
                      });
                    }).then(function _callee18(promocodes) {
                      var SetProduct;
                      return regeneratorRuntime.async(function _callee18$(_context18) {
                        while (1) {
                          switch (_context18.prev = _context18.next) {
                            case 0:
                              if (!promocodes) {
                                _context18.next = 7;
                                break;
                              }

                              product = promocodes.product + parseInt(quantity);
                              Commision = Math.round(promocodes.Commision + Payment);
                              SetProduct = {
                                $set: {
                                  Commision: Commision,
                                  product: product
                                }
                              };
                              _context18.next = 6;
                              return regeneratorRuntime.awrap(db.getDB().collection("promocodes").updateOne({
                                PromoCode: PromoCode
                              }, SetProduct));

                            case 6:
                              update_promocodes = _context18.sent;

                            case 7:
                            case "end":
                              return _context18.stop();
                          }
                        }
                      });
                    }).then(function _callee19() {
                      var DONE;
                      return regeneratorRuntime.async(function _callee19$(_context19) {
                        while (1) {
                          switch (_context19.prev = _context19.next) {
                            case 0:
                              DONE = {
                                $set: {
                                  Status: "DONE"
                                }
                              };
                              _context19.next = 3;
                              return regeneratorRuntime.awrap(db.getDB().collection("OrderID").updateOne(myquery, DONE));

                            case 3:
                              update_OrderID = _context19.sent;

                            case 4:
                            case "end":
                              return _context19.stop();
                          }
                        }
                      });
                    })["catch"](function (err) {
                      return console.log(err);
                    }));

                  case 2:
                    Productcodes = _context20.sent;

                  case 3:
                  case "end":
                    return _context20.stop();
                }
              }
            });
          };

          PID = req.query.PID;
          Proceed = req.query.Proceed;
          Owner_email = req.user.email;
          myquery = {
            $and: [{
              "Owner_Details.Owner_email": Owner_email
            }, {
              OID: PID
            }, {
              $or: [{
                Status: "pending"
              }, {
                Status: "OnWay"
              }]
            }]
          };

          if (!(Proceed == "Update")) {
            _context21.next = 11;
            break;
          }

          _context21.next = 8;
          return regeneratorRuntime.awrap(db.getDB().collection("OrderID").findOne(myquery).then(function _callee15(OrderID_query) {
            return regeneratorRuntime.async(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    if (!OrderID_query) {
                      _context15.next = 8;
                      break;
                    }

                    PromoCode = OrderID_query.PromoCode;
                    quantity = parseInt(OrderID_query.quantity);
                    price_quantity = parseInt(OrderID_query.price_quantity);
                    PID = OrderID_query.P_ID;
                    return _context15.abrupt("return", PromoCode);

                  case 8:
                    res.status(404).render("errorpage.pug");

                  case 9:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          }).then(function _callee16(PromoCode) {
            return regeneratorRuntime.async(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    if (!PromoCode) {
                      _context16.next = 9;
                      break;
                    }

                    _context16.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("OFFERS_TABLE").findOne());

                  case 3:
                    OfferTable = _context16.sent;
                    CommisionPrice = OfferTable.CommisionPrice / 100;
                    Payment = price_quantity * CommisionPrice;
                    Product(myquery, Payment, PromoCode, quantity, PID);
                    _context16.next = 12;
                    break;

                  case 9:
                    CommisionPrice = 0;
                    Payment = 0;
                    Product(myquery, Payment, PromoCode, quantity, PID);

                  case 12:
                  case "end":
                    return _context16.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          })["finally"](function () {
            res.send("Done");
          }));

        case 8:
          OrderID_query = _context21.sent;
          _context21.next = 25;
          break;

        case 11:
          if (!(Proceed == "Cancel")) {
            _context21.next = 19;
            break;
          }

          myquery = {
            $and: [{
              "Owner_Details.Owner_email": Owner_email
            }, {
              OID: PID
            }, {
              $or: [{
                Status: "pending"
              }, {
                Status: "OnWay"
              }]
            }]
          };
          newvalues = {
            $set: {
              Status: "Cancel"
            }
          };
          _context21.next = 16;
          return regeneratorRuntime.awrap(db.getDB().collection("OrderID").updateOne(myquery, newvalues)["catch"](function (err) {
            return console.log(err);
          })["finally"](function () {
            res.send("Done");
          }));

        case 16:
          OrderId_Cancel = _context21.sent;
          _context21.next = 25;
          break;

        case 19:
          if (!(Proceed == "OnWay")) {
            _context21.next = 25;
            break;
          }

          myquery = {
            $and: [{
              "Owner_Details.Owner_email": Owner_email
            }, {
              OID: PID
            }, {
              Status: "pending"
            }]
          };
          newvalues = {
            $set: {
              Status: "OnWay"
            }
          };
          _context21.next = 24;
          return regeneratorRuntime.awrap(db.getDB().collection("OrderID").updateOne(myquery, newvalues)["catch"](function (err) {
            return console.log(err);
          })["finally"](function () {
            res.send("Done");
          }));

        case 24:
          OrderId_OnWay = _context21.sent;

        case 25:
        case "end":
          return _context21.stop();
      }
    }
  });
});
module.exports = myrouter;