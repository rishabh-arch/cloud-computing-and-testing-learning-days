var express = require('express');
var myrouter = express.Router();
const fileUploadCtrl = require('../FileUp.js').hookah_Upload;
const sharp = require('sharp')
const path = require("path");
const fs = require("fs");
const app = express();
const port = 80;
const bodyparser = require('body-parser')
var nodemailer = require('nodemailer');
var domain = require("domain").create();
var mongoose = require('mongoose');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { ObjectId } = require("mongodb");
const { Console } = require("console");
const { parse } = require("path");
var session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
require('../passport')(passport);
var razorpay = require("razorpay");
const db = require('../mongoBase/db.js');


const { createBrotliCompress } = require("zlib");
const { doesNotThrow, throws } = require("assert");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var url2 = "mongodb://localhost:27017/trial";

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }))
const cookieParser = require('cookie-parser');
myrouter.use(cookieParser('secret'));

myrouter.use(flash());

myrouter.use(bodyparser.urlencoded({ extended: true }));
myrouter.use(session({
    secret: 'secret',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
}));
myrouter.use(passport.initialize());
myrouter.use(passport.session());
// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory



const checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

myrouter.get('/Dashboard/productUpload', checkAuthenticated, async function(req, res) {
    email = req.user.email;
    db.getDB().collection("EMPLOYEE_ID").findOne({ email: email })
        .then(data => {
            if (data) {
                res.status(200).render('dashboard/productUpload.pug')
            } else {
                res.status(404).render("errorpage.pug")
            }
        })
        .catch(err => console.log(err));
})

let instance = new razorpay({
    key_id: 'rzp_test_prQcCHNWovj933', // your `KEY_ID`
    key_secret: 'jC8edUWi5A6rpNgoInWAPMj3' // your `KEY_SECRET`
})

// myrouter.post('/razorpay', (req, res) => {



// })

myrouter.post('/Dashboard/productUpload', checkAuthenticated, async(req, res) => {
    var i = 0;
    email = req.user.email;
    ownername = req.user.username;
    fileUploadCtrl(req, res, async function(err) {
        if (err) {
            res.send(err)
        } else {
            var { Productname, colour, Mprice, Oprice, tag1, tag2, tag3, ProductCats, Quantities, specs } = req.body;
            Mprice = parseInt(Mprice)
            Oprice = parseInt(Oprice)
            employee_details = await db.getDB().collection("EMPLOYEE_ID").findOne({ email: email })
                .then(async(emp_det) => {
                    if (emp_det) {
                        employee_details = emp_det;
                        T_counts = db.getDB().collection("productcodes").countDocuments({ "Owner_Details.Owner_email": email })
                        return T_counts;
                    } else {
                        throw new Error("Whoops!");
                    }
                })
                .then(async(T_counts) => {
                    T_counts = T_counts + 1;
                    var myquery = { EMPID: employee_details.EMPID };
                    var newvalues = { $set: { TotalProducts: T_counts } };
                    db.getDB().collection("EMPLOYEE_ID").updateOne(myquery, newvalues)
                })
                .then(async() => {
                    CatLogs = { Category: ProductCats };
                    productcode = await db.getDB().collection("productcodes").find(CatLogs).sort({ PID: -1 }).limit(1).toArray();
                    return productcode
                })
                .then(async(pc) => {
                    PIDcode = productcode[0].PID + 1;
                    TotalOrders = 0;
                    var myobj = {
                        PID: PIDcode,
                        EMPLOYEE_ID: employee_details.EMPID,
                        name: Productname,
                        colour: colour,
                        Mprice: Mprice,
                        Oprice: Oprice,
                        tag: [tag1, tag2, tag3],
                        P_Rate: [0, 0, 0, 0, 0],
                        Category: ProductCats,
                        Owner_Details: [{ Owner_Adress: employee_details.shop_address }, { Owner_number: employee_details.phone }, { Owner_name: ownername }, { Owner_email: email }, { Owner_City: employee_details.City }, { Owner_State: employee_details.shop_state }, { Owner_pincode: employee_details.shop_pincode }],
                        Quantities: Quantities,
                        Specification: specs,
                        availability: "AVAILABLE",
                        TotalOrders: TotalOrders,
                        ID: employee_details._id,
                        Rating: 0
                    }
                    inserted = await db.getDB().collection("productcodes").insertOne(myobj);
                })
                .then(() => {
                    while (i < 4) {
                        sharp(req.files[i].path).resize(1386, 1500).toFormat("jpeg").jpeg({ quality: 80 }).toFile('./static/hookah/' + PIDcode + '_' + i + ".jpeg")
                        sharp(req.files[i].path).resize(380, 380).toFormat("jpeg").jpeg({ quality: 90 }).toFile('./static/hookah/thumbnail/thumbnail-' + PIDcode + '_' + i + '.jpeg')
                        sharp(req.files[i].path).resize(100).toFormat("jpeg").jpeg({ quality: 50 }).toFile('./static/hookah/thumbnail_table_icon/thumbnail_table_icon-' + PIDcode + '_' + i + '.jpeg')
                        i++;
                    }
                })
                .catch(err =>
                    console.log(err))
                .finally(() => {
                    res.redirect('/dashboard/yourshop')
                })
        }
    });

});

myrouter.get('/Update/:tagId', checkAuthenticated, async(req, res) => {
    Owner_email = req.user.email;
    var myquery = { $and: [{ "Owner_Details.Owner_email": Owner_email }, { _id: ObjectId(req.params.tagId) }, { $or: [{ Status: "pending" }, { Status: "OnWay" }] }] };
    OrderID_query = await db.getDB().collection("OrderID").findOne(myquery)
        .then(async OrderID_query => {
            if (OrderID_query) {
                PromoCode = OrderID_query.PromoCode;
                quantity = parseInt(OrderID_query.quantity);
                price_quantity = parseInt(OrderID_query.price_quantity);
                PID = OrderID_query.P_ID;
                return PromoCode;
            } else {
                res.status(404).render("errorpage.pug");
            }

        })
        .then(async PromoCode => {
            if (PromoCode != "NAN") {
                OfferTable = await db.getDB().collection("OFFERS_TABLE").findOne()
                CommisionPrice = (OfferTable.CommisionPrice) / 100;
                Payment = price_quantity * CommisionPrice;
                Product(myquery, Payment, PromoCode, quantity, PID);
            } else {
                CommisionPrice = 0;
                Payment = 0;
                Product(myquery, Payment, PromoCode, quantity, PID);
            }

        })

    async function Product(myquery, Payment, PromoCode, quantity, PID) {
        Productcodes = await db.getDB().collection("productcodes").findOne({ PID: PID })
            .then(async Productcodes => {
                if (Productcodes) {
                    TotalOrders = parseInt(Productcodes.TotalOrders) + quantity;
                    var newvalues = { $set: { TotalOrders: TotalOrders } };
                    product_update = await db.getDB().collection("productcodes").updateOne({ PID: PID }, newvalues)
                    promocodes = await db.getDB().collection("promocodes").findOne({ PromoCode: PromoCode })
                    return promocodes;
                } else {
                    res.status(404).render("errorpage.pug");
                }


            })
            .then(async promocodes => {
                if (promocodes) {
                    product = promocodes.product + parseInt(quantity);
                    Commision = Math.round(promocodes.Commision + Payment);
                    var SetProduct = { $set: { Commision: Commision, product: product } };
                    update_promocodes = await db.getDB().collection("promocodes").updateOne({ PromoCode: PromoCode }, SetProduct)
                }
            })
            .then(async() => {

                var DONE = { $set: { Status: "DONE" } };
                update_OrderID = await db.getDB().collection("OrderID").updateOne(myquery, DONE);


            })
            .catch(err => console.log(err))
            .finally(
                res.redirect('/dashboard/orderrequest')
            )
    }
});

myrouter.get('/Cancel/:tagId', (req, res) => {
    if (req.isAuthenticated()) {
        Owner_email = req.user.email;
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("trial");
            var myquery = { $and: [{ "Owner_Details.Owner_email": Owner_email }, { _id: ObjectId(req.params.tagId) }, { $or: [{ Status: "pending" }, { Status: "OnWay" }] }] };
            var newvalues = { $set: { Status: "Cancel" } };
            dbo.collection("OrderID").updateOne(myquery, newvalues, function(err, obj) {
                if (err) throw err;
                //console.log("1 document updated");
                db.close();
                res.status(200).redirect('/Table');
            });
        });
    } else {
        res.redirect('/login')
    }
});

myrouter.get('/Onway/:tagId', (req, res) => {
    if (req.isAuthenticated()) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            Owner_email = req.user.email;
            if (err) throw err;
            var dbo = db.db("trial");
            var myquery = { $and: [{ "Owner_Details.Owner_email": Owner_email }, { _id: ObjectId(req.params.tagId) }, { Status: "pending" }] };
            var newvalues = { $set: { Status: "OnWay" } };
            dbo.collection("OrderID").updateOne(myquery, newvalues, function(err, obj) {
                if (err) throw err;
                //console.log("1 document updated");
                db.close();
                res.status(200).redirect('/Dashboard/OrderRequest');
            });
        });
    } else {
        res.redirect('/login')
    }
});

module.exports = myrouter;