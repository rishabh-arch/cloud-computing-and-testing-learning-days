"use strict";

var express = require('express');

var myrouter = express.Router();

var path = require("path");

var fs = require("fs");

var app = express();

var validator = require("email-validator");

var bodyparser = require('body-parser');

var session = require('express-session');

var flash = require('connect-flash');

var passport = require('passport');

require('../../models/passport')(passport);

var cookieParser = require('cookie-parser');

var nodemailer = require('nodemailer');

var domain = require("domain").create();

var _require = require("constants"),
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG = _require.SSL_OP_SSLEAY_080_CLIENT_DH_BUG;

var db = require('../mongoBase/db.js');

var _require2 = require("console"),
    Console = _require2.Console;

var _require3 = require("path"),
    parse = _require3.parse;

var _require4 = require("zlib"),
    createBrotliCompress = _require4.createBrotliCompress;

var _require5 = require("assert"),
    doesNotThrow = _require5.doesNotThrow,
    _throws = _require5["throws"],
    strict = _require5.strict;

var _require6 = require('os'),
    totalmem = _require6.totalmem;

var razorpay = require("razorpay");

var _require7 = require('dns'),
    resolveSoa = _require7.resolveSoa; // EXPRESS SPECIFIC STUFF
// app.use('/static', express.static('static')) // For serving static files
// app.use(express.urlencoded());
// app.use(fileUpload());
// // PUG SPECIFIC STUFF
// app.set('view engine', 'pug') // Set the template engine as pug
// app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory


var instance = new razorpay({
  key_id: 'rzp_test_prQcCHNWovj933',
  // your `KEY_ID`
  key_secret: 'jC8edUWi5A6rpNgoInWAPMj3' // your `KEY_SECRET`

});

var checkAuthenticated = function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    return next();
  } else {
    res.redirect('/login');
  }
};

myrouter.post('/p/:tagId', function _callee6(req, res) {
  var email, _req$body, customer_name, phone, address, PromoCode, quantity, firstOrderCode, firstOrderCodeInt, Promo_Code, Discount, Dis_price;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          email = ""; // var options = {
          //     amount: 50000,  // amount in the smallest currency unit
          //     currency: "INR",
          //     receipt: "order_rcptid_11",
          // };
          // instance.orders.create(options, function (err, order) {
          //     console.log(order);
          // });
          // if (req.isAuthenticated()) {
          //     email = req.user.email
          // }
          // else if (validator.validate(email)) {
          //     email = email;
          //     console.log(email)
          // }
          // else {
          //     email = "";
          // }

          tag_ID = req.params.tagId;
          _req$body = req.body, customer_name = _req$body.customer_name, phone = _req$body.phone, address = _req$body.address, PromoCode = _req$body.PromoCode, quantity = _req$body.quantity;
          date_js = new Date();
          _context6.next = 6;
          return regeneratorRuntime.awrap(db.getDB().collection("OrderID").find({}).sort({
            _id: -1
          }).limit(1).toArray().then(function (pi) {
            if (pi && pi.length > 0) {
              firstOrderCodeInt = parseInt(pi[0].OID.substr(4)) + 1;
              firstOrderCode = "OID-".concat(firstOrderCodeInt);
            } else {
              firstOrderCode = "OID-100001";
            }
          }).then(function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne({
                      PID: tag_ID
                    }));

                  case 2:
                    return _context.abrupt("return", Product_tagID = _context.sent);

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }).then(function _callee2(Product_tagID) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    console.log(Product_tagID);

                    if (!Product_tagID) {
                      _context2.next = 6;
                      break;
                    }

                    Product_tagID_data = Product_tagID;
                    return _context2.abrupt("return", Product_tagID);

                  case 6:
                    throw new Error("Whoops!");

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }).then(function _callee3(Product_tagID) {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    Oprice = Product_tagID.Oprice;
                    Mprice = Product_tagID.Mprice;
                    pID = Product_tagID.PID;
                    Owner_Adress = Product_tagID.Owner_Details[0].Owner_Adress;
                    Owner_number = Product_tagID.Owner_Details[1].Owner_number;
                    Owner_name = Product_tagID.Owner_Details[2].Owner_name;
                    Owner_email = Product_tagID.Owner_Details[3].Owner_email;
                    _context3.next = 9;
                    return regeneratorRuntime.awrap(db.getDB().collection("promocodes").findOne({
                      PromoCode: PromoCode
                    }));

                  case 9:
                    Promo_code = _context3.sent;
                    console.log(Promo_code);
                    console.log(PromoCode);
                    return _context3.abrupt("return", Promo_Code);

                  case 13:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          }).then(function _callee4(Promo_Code) {
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!Promo_code) {
                      _context4.next = 22;
                      break;
                    }

                    PromoCode = Promo_code.PromoCode;
                    _context4.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("OFFERS_TABLE").findOne());

                  case 4:
                    Offer = _context4.sent;
                    OfferMaxPrice = parseInt(Offer.OfferMaxPrice);
                    OfferDiscount = parseInt(Offer.DiscountPrice) / 100;

                    if (!(Oprice >= OfferMaxPrice)) {
                      _context4.next = 15;
                      break;
                    }

                    console.log("OPrice>omp");
                    Discount = Math.round(Oprice * OfferDiscount);
                    Dis_price = Math.round(Oprice - Discount);
                    Price_Quan = quantity * Dis_price;
                    return _context4.abrupt("return", {
                      Discount: Discount,
                      Dis_price: Dis_price,
                      Price_Quan: Price_Quan,
                      PromoCode: PromoCode
                    });

                  case 15:
                    Discount = 0;
                    Dis_price = 0;
                    Price_Quan = Oprice * quantity;
                    console.log("else");
                    return _context4.abrupt("return", {
                      Discount: Discount,
                      Dis_price: Dis_price,
                      Price_Quan: Price_Quan,
                      PromoCode: PromoCode
                    });

                  case 20:
                    _context4.next = 28;
                    break;

                  case 22:
                    console.log("no Promo_Code");
                    Price_Quan = Oprice * quantity;
                    Discount = 0;
                    Dis_price = 0;
                    PromoCode = "NAN";
                    return _context4.abrupt("return", {
                      Discount: Discount,
                      Dis_price: Dis_price,
                      Price_Quan: Price_Quan,
                      PromoCode: PromoCode
                    });

                  case 28:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          }).then(function _callee5(PromoCode_values) {
            var myobj;
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    console.log(PromoCode_values.Discount + " 1 " + PromoCode_values.Dis_price + " 2 " + PromoCode_values.Price_Quan + " 3 " + PromoCode_values.PromoCode);
                    myobj = {
                      OID: firstOrderCode,
                      name: customer_name,
                      P_ID: pID,
                      PromoCode: PromoCode,
                      email: email,
                      phone: phone,
                      Mprice: Mprice,
                      Oprice: Oprice,
                      Dis_price: Dis_price,
                      Discount: Discount,
                      Address: address,
                      Owner_Details: [{
                        Owner_Adress: Owner_Adress
                      }, {
                        Owner_number: Owner_number
                      }, {
                        Owner_name: Owner_name
                      }, {
                        Owner_email: Owner_email
                      }],
                      quantity: quantity,
                      price_quantity: Price_Quan,
                      date_od: date_js,
                      Status: "pending"
                    };
                    _context5.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("OrderID").insertOne(myobj));

                  case 4:
                    insertOrder = _context5.sent;

                  case 5:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          } // res.status(404).render("errorpage.pug"))
          )["finally"](res.redirect("/")));

        case 6:
          OrderID = _context6.sent;

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
});
myrouter.post('/user/deletefromcart/:pid', function _callee8(req, res) {
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (!req.isAuthenticated()) {
            _context8.next = 11;
            break;
          }

          PID = req.params.pid;
          url_key = req.query.key;
          user_email = req.user.email;
          quantity = req.body.quantity;
          recquery = {
            email: user_email,
            PID: PID,
            url_key: url_key
          };
          _context8.next = 8;
          return regeneratorRuntime.awrap(db.getDB().collection('productcodes').findOne({
            PID: PID,
            url_key: url_key
          }).then(function _callee7(productVerify) {
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    if (!productVerify) {
                      _context7.next = 7;
                      break;
                    }

                    _context7.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("userCart").deleteOne({
                      $and: [{
                        email: user_email,
                        url_key: url_key,
                        PID: PID
                      }]
                    }));

                  case 3:
                    count_result = _context7.sent;
                    res.send("deleted");
                    _context7.next = 8;
                    break;

                  case 7:
                    throw new Error("product not found");

                  case 8:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 8:
          productVerify = _context8.sent;
          _context8.next = 12;
          break;

        case 11:
          res.send("error");

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  });
});
myrouter.post('/user/editfromcart/:pid', checkAuthenticated, function _callee10(req, res) {
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          PID = req.params.pid;
          url_key = req.query.key;
          quantity = parseInt(req.query.quantity);
          user_email = req.user.email;
          recquery = {
            email: user_email,
            PID: PID,
            url_key: url_key
          };
          _context10.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection('productcodes').findOne({
            PID: PID,
            url_key: url_key
          }).then(function _callee9(productVerify) {
            return regeneratorRuntime.async(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    if (!productVerify) {
                      _context9.next = 7;
                      break;
                    }

                    _context9.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("userCart").updateOne({
                      $and: [{
                        email: user_email,
                        url_key: url_key,
                        PID: PID
                      }]
                    }, {
                      $set: {
                        quantity: quantity
                      }
                    }));

                  case 3:
                    count_result = _context9.sent;
                    res.send("done");
                    _context9.next = 8;
                    break;

                  case 7:
                    throw new Error("product not found");

                  case 8:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 7:
          productVerify = _context10.sent;

        case 8:
        case "end":
          return _context10.stop();
      }
    }
  });
});
myrouter.post('/user/addtocart/:pid', function _callee14(req, res) {
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          if (!req.isAuthenticated()) {
            _context14.next = 12;
            break;
          }

          PID = req.params.pid;
          url_key = req.query.key;
          user_email = req.user.email;
          quantity = parseInt(req.body.quantity);
          if (!quantity || quantity === NaN || typeof quantity != 'number') quantity = 1;
          recquery = {
            email: user_email,
            PID: PID,
            url_key: url_key
          };
          _context14.next = 9;
          return regeneratorRuntime.awrap(db.getDB().collection('productcodes').findOne({
            PID: PID,
            url_key: url_key
          }).then(function _callee11(productVerify) {
            var name, brand, colour, Oprice;
            return regeneratorRuntime.async(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    if (!productVerify) {
                      _context11.next = 9;
                      break;
                    }

                    name = productVerify.name, brand = productVerify.brand, colour = productVerify.colour, Oprice = productVerify.Oprice;
                    _context11.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("userCart").countDocuments({
                      email: user_email
                    }));

                  case 4:
                    count_result = _context11.sent;
                    cartquery = {
                      email: user_email,
                      PID: PID,
                      url_key: url_key,
                      quantity: quantity,
                      PID_name: name,
                      brand: brand,
                      colour: colour,
                      Oprice: Oprice
                    };
                    return _context11.abrupt("return", count_result);

                  case 9:
                    throw new Error("product not found");

                  case 10:
                  case "end":
                    return _context11.stop();
                }
              }
            });
          }).then(function _callee12(count_result) {
            return regeneratorRuntime.async(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    if (!(count_result > 3)) {
                      _context12.next = 4;
                      break;
                    }

                    throw new Error("max limit 4");

                  case 4:
                    _context12.next = 6;
                    return regeneratorRuntime.awrap(db.getDB().collection("userCart").findOne(recquery));

                  case 6:
                    productRecords = _context12.sent;
                    return _context12.abrupt("return", productRecords);

                  case 8:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          }).then(function _callee13(productRecords) {
            return regeneratorRuntime.async(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    if (!productRecords) {
                      _context13.next = 8;
                      break;
                    }

                    quantitynew = parseInt(productRecords.quantity) + quantity;
                    _context13.next = 4;
                    return regeneratorRuntime.awrap(db.getDB().collection("userCart").updateOne(recquery, {
                      $set: {
                        quantity: quantitynew
                      }
                    }));

                  case 4:
                    usercart = _context13.sent;
                    res.send({
                      "add": "quantity update"
                    });
                    _context13.next = 12;
                    break;

                  case 8:
                    _context13.next = 10;
                    return regeneratorRuntime.awrap(db.getDB().collection("userCart").insertOne(cartquery));

                  case 10:
                    usercart = _context13.sent;
                    res.json({
                      "add": "Added to cart"
                    });

                  case 12:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.send({
              "add": err.message
            });
          }));

        case 9:
          productVerify = _context14.sent;
          _context14.next = 13;
          break;

        case 12:
          res.send({
            "add": "Login First"
          });

        case 13:
        case "end":
          return _context14.stop();
      }
    }
  });
});
myrouter.get('/p/:tagId', function _callee16(req, res) {
  var userRating, cartQuantity, params;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          tag_ID = req.params.tagId;

          if (!req.isAuthenticated()) {
            _context16.next = 12;
            break;
          }

          _context16.next = 4;
          return regeneratorRuntime.awrap(db.getDB().collection("userRating").findOne({
            $and: [{
              email: req.user.email
            }, {
              P_ID: tag_ID
            }]
          }));

        case 4:
          userRating = _context16.sent;
          _context16.next = 7;
          return regeneratorRuntime.awrap(db.getDB().collection("userCart").findOne({
            $and: [{
              email: req.user.email
            }, {
              PID: tag_ID
            }]
          }));

        case 7:
          All_in_cart = _context16.sent;
          if (!userRating) userRating = "";
          if (!All_in_cart) cartQuantity = "";else cartQuantity = All_in_cart.quantity;
          _context16.next = 14;
          break;

        case 12:
          userRating = "";
          cartQuantity = "";

        case 14:
          _context16.next = 16;
          return regeneratorRuntime.awrap(db.getDB().collection("userRating").find({
            P_ID: tag_ID
          }).sort({
            Rating: -1
          }).limit(10).toArray());

        case 16:
          userRatingAll = _context16.sent;
          _context16.next = 19;
          return regeneratorRuntime.awrap(db.getDB().collection("userRating").countDocuments({
            P_ID: tag_ID
          }));

        case 19:
          totalReview = _context16.sent;
          console.log(cartQuantity);
          url_key = req.query.key;
          params = null;
          _context16.next = 25;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne({
            $and: [{
              PID: tag_ID
            }, {
              url_key: url_key
            }]
          }).then(function _callee15(result) {
            return regeneratorRuntime.async(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    if (!result) {
                      _context15.next = 10;
                      break;
                    }

                    productFetched = result;
                    Owner_email = result.Owner_Details[3].Owner_email;
                    _context15.next = 5;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").find({
                      PID: {
                        $ne: tag_ID
                      }
                    }, {
                      "Owner_Details.Owner_email": Owner_email
                    }).sort({
                      PID: -1
                    }).limit(5).toArray());

                  case 5:
                    ownerproducts = _context15.sent;
                    params = {
                      "OBJ": productFetched,
                      "OBJ2": ownerproducts,
                      "userRating": userRating,
                      "userRatingAll": userRatingAll,
                      "totalReview": totalReview,
                      "page_title": "DotMatrix.com: ".concat(result.name),
                      "cartQuantity": cartQuantity
                    };
                    res.status(200).render('12345.pug', params);
                    _context15.next = 11;
                    break;

                  case 10:
                    throw new Error("not Product");

                  case 11:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.status(404).render("errorpage.pug");
          }));

        case 25:
          result = _context16.sent;

        case 26:
        case "end":
          return _context16.stop();
      }
    }
  });
});
myrouter.post('/rating/:tagid', function _callee18(req, alert) {
  var product_rating_insertion;
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          product_rating_insertion = function _ref() {
            db.getDB().collection("userRating").aggregate([{
              $unwind: '$P_ID'
            }, {
              $match: {
                P_ID: PID
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
            }]).toArray(function (err, newJsonObj) {
              var myquery = {
                PID: PID
              };
              count1 = 0;
              count2 = 0;
              count3 = 0;
              count4 = 0;
              count5 = 0;
              Rating1 = 0;
              Rating2 = 0;
              Rating3 = 0;
              Rating4 = 0;
              Rating5 = 0;
              newJsonObj.forEach(counts);

              function counts(item) {
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
              }

              RatingCounts = count5 + count1 + count2 + count3 + count4;
              Rate1_per = (count1 / RatingCounts * 100).toFixed(1);
              Rate2_per = (count2 / RatingCounts * 100).toFixed(1);
              Rate3_per = (count3 / RatingCounts * 100).toFixed(1);
              Rate4_per = (count4 / RatingCounts * 100).toFixed(1);
              Rate5_per = (count5 / RatingCounts * 100).toFixed(1);
              SumOfRatings = Rating1 + Rating2 + Rating3 + Rating4 + Rating5;
              finalrate = parseFloat((SumOfRatings / RatingCounts).toFixed(1));
              var newvalues = {
                $set: {
                  Rating: finalrate,
                  P_Rate: [Rate1_per, Rate2_per, Rate3_per, Rate4_per, Rate5_per]
                }
              };
              db.getDB().collection("productcodes").updateOne(myquery, newvalues, function (err, rest) {
                if (err) {
                  console.log(err);
                }

                console.log(finalrate);
              });
            });
          };

          if (!req.isAuthenticated()) {
            _context18.next = 15;
            break;
          }

          email = req.user.email;
          reviewer_name = req.user.username;
          uniqueID = req.user.uniqueID;
          rate = parseInt(req.body.star);
          Comment = req.body.Comment;
          P_ID = req.params.tagid;
          PID = P_ID;
          dateRate = new Date();
          _context18.next = 12;
          return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne({
            PID: PID
          }).then(function _callee17(productcode) {
            var myquery, newvalues;
            return regeneratorRuntime.async(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    if (!productcode) {
                      _context17.next = 11;
                      break;
                    }

                    Owner_email = productcode.Owner_Details[3].Owner_email;
                    myquery = {
                      $and: [{
                        P_ID: PID
                      }, {
                        email: email
                      }, {
                        Owner_email: Owner_email
                      }]
                    };
                    newvalues = {
                      $set: {
                        Rating: rate,
                        Comment: Comment,
                        dateRate: dateRate,
                        uniqueID: uniqueID,
                        reviewer_name: reviewer_name
                      }
                    };
                    _context17.next = 6;
                    return regeneratorRuntime.awrap(db.getDB().collection("userRating").updateOne(myquery, newvalues, {
                      upsert: true
                    }));

                  case 6:
                    update_result = _context17.sent;
                    product_rating_insertion();
                    alert.send("Rating Submitted");
                    _context17.next = 12;
                    break;

                  case 11:
                    alert.send("Product not found");

                  case 12:
                  case "end":
                    return _context17.stop();
                }
              }
            });
          }));

        case 12:
          productcode = _context18.sent;
          _context18.next = 16;
          break;

        case 15:
          alert.send("Please Login First");

        case 16:
        case "end":
          return _context18.stop();
      }
    }
  });
});
myrouter.get('/user/Cart', function (req, res) {
  if (req.isAuthenticated()) {
    email = req.user.email;
    db.getDB().collection("UsersBookmark").find({
      email: req.user.email
    }).toArray(function (err, result) {
      if (result != "") {
        var params = {
          'newOBJ': result,
          "page_title": "DotMatrix.com: Your Cart"
        };
        res.status(200).render('Cart.pug', params);
      } else {
        res.status(200).render('underReview_.pug', {
          'result': 'No Favourites Right Now'
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});
myrouter.post('/product/user/bookmark', function _callee22(req, res) {
  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          if (!req.isAuthenticated()) {
            _context22.next = 7;
            break;
          }

          P_ID = req.body.PID;
          _context22.next = 4;
          return regeneratorRuntime.awrap(db.getDB().collection("UsersBookmark").findOne({
            $and: [{
              P_ID: P_ID
            }, {
              email: req.user.email
            }]
          }).then(function _callee19(uB_result) {
            return regeneratorRuntime.async(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    if (uB_result) {
                      _context19.next = 7;
                      break;
                    }

                    _context19.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("UsersBookmark").countDocuments({
                      email: req.user.email
                    }));

                  case 3:
                    countBookmark = _context19.sent;
                    return _context19.abrupt("return", countBookmark);

                  case 7:
                    throw new Error("Already Saved");

                  case 8:
                  case "end":
                    return _context19.stop();
                }
              }
            });
          }).then(function _callee20(countBookmark) {
            return regeneratorRuntime.async(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    if (!(countBookmark <= 19)) {
                      _context20.next = 12;
                      break;
                    }

                    _context20.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne({
                      PID: P_ID
                    }));

                  case 3:
                    productcodes = _context20.sent;
                    P_name = productcodes.name;
                    P_Mprice = productcodes.Mprice;
                    P_Oprice = productcodes.Oprice;
                    P_Category = productcodes.Category;
                    P_Specification = productcodes.Specification;
                    url_key = productcodes.url_key;
                    newvalues = {
                      P_ID: P_ID,
                      email: req.user.email,
                      P_name: P_name,
                      P_Mprice: P_Mprice,
                      P_Oprice: P_Oprice,
                      P_Category: P_Category,
                      P_Specification: P_Specification,
                      url_key: url_key
                    };
                    return _context20.abrupt("return", productcodes);

                  case 12:
                  case "end":
                    return _context20.stop();
                }
              }
            });
          }).then(function _callee21(pc) {
            return regeneratorRuntime.async(function _callee21$(_context21) {
              while (1) {
                switch (_context21.prev = _context21.next) {
                  case 0:
                    if (!pc) {
                      _context21.next = 6;
                      break;
                    }

                    _context21.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("UsersBookmark").insertOne(newvalues));

                  case 3:
                    return _context21.abrupt("return", res.json({
                      "add": "Saved"
                    }));

                  case 6:
                    return _context21.abrupt("return", res.json({
                      "add": "Not More Than 20"
                    }));

                  case 7:
                  case "end":
                    return _context21.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.json({
              "add": err.message
            });
          }));

        case 4:
          userBookmark_result = _context22.sent;
          _context22.next = 8;
          break;

        case 7:
          res.json({
            "add": "Login First"
          });

        case 8:
        case "end":
          return _context22.stop();
      }
    }
  });
});
myrouter.post('/product/user/bookmark/delete', function _callee25(req, res) {
  return regeneratorRuntime.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          if (!req.isAuthenticated()) {
            _context25.next = 7;
            break;
          }

          P_ID = req.body.PID;
          _context25.next = 4;
          return regeneratorRuntime.awrap(db.getDB().collection("UsersBookmark").findOne({
            $and: [{
              P_ID: P_ID
            }, {
              email: req.user.email
            }]
          }).then(function _callee23(uB) {
            return regeneratorRuntime.async(function _callee23$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    if (!uB) {
                      _context23.next = 7;
                      break;
                    }

                    _context23.next = 3;
                    return regeneratorRuntime.awrap(db.getDB().collection("UsersBookmark").deleteOne({
                      $and: [{
                        P_ID: P_ID
                      }, {
                        email: req.user.email
                      }]
                    }));

                  case 3:
                    uBdeleted = _context23.sent;
                    throw new Error("Deleted");

                  case 7:
                    _context23.next = 9;
                    return regeneratorRuntime.awrap(db.getDB().collection("productcodes").findOne({
                      PID: P_ID
                    }));

                  case 9:
                    productcodes = _context23.sent;
                    P_name = productcodes.name;
                    P_Mprice = productcodes.Mprice;
                    P_Oprice = productcodes.Oprice;
                    P_Category = productcodes.Category;
                    P_Specification = productcodes.Specification;
                    newvalues = {
                      P_ID: P_ID,
                      email: req.user.email,
                      P_name: P_name,
                      P_Mprice: P_Mprice,
                      P_Oprice: P_Oprice,
                      P_Category: P_Category,
                      P_Specification: P_Specification
                    };
                    return _context23.abrupt("return", productcodes);

                  case 17:
                  case "end":
                    return _context23.stop();
                }
              }
            });
          }).then(function _callee24(pc) {
            return regeneratorRuntime.async(function _callee24$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    _context24.next = 2;
                    return regeneratorRuntime.awrap(db.getDB().collection("UsersBookmark").insertOne(newvalues));

                  case 2:
                    inserted = _context24.sent;
                    res.json({
                      "add": "Save Again"
                    });

                  case 4:
                  case "end":
                    return _context24.stop();
                }
              }
            });
          })["catch"](function (err) {
            return res.json({
              "add": err.message
            });
          }));

        case 4:
          userBookmark = _context25.sent;
          _context25.next = 8;
          break;

        case 7:
          res.json({
            "add": "Login First"
          });

        case 8:
        case "end":
          return _context25.stop();
      }
    }
  });
});
module.exports = myrouter;