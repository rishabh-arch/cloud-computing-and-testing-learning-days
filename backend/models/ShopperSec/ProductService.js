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
const {
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG
} = require("constants");
const {
    Console
} = require("console");
const {
    parse
} = require("path");
var session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
require('../passport')(passport);
var razorpay = require("razorpay");
const db = require('../mongoBase/db.js');
const spellcheck = require('./spellcheck.js');
const jwt = require('jsonwebtoken')

var nodemailer = require('nodemailer');

// EXPRESS SPECIFIC STUFF

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory


const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

myrouter.get('/Dashboard/productUpload', checkAuthenticated, async function (req, res) {
    email = req.user.email;
    db.getDB().collection("users").findOne({
        email: email
    })
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


myrouter.post('/Dashboard/productUpload', checkAuthenticated, async (req, res) => {
    var i = 0;
    var countquery;
    var countsUpdate;
    var firstProductCode;
    var Image = [0, 0, 0, 0];
    email = req.user.email;
    ownername = req.user.username;
    date_js = new Date();
    fileUploadCtrl(req, res, async function (err) {
        if (err) {
            res.send(err)
        } else {
            var {
                Productname,
                colour,
                Mprice,
                Oprice,
                tags,
                ProductCats,
                Quantities,
                specs,
                InStock,
                brand
            } = req.body;
            if (ProductCats != "Hookah" || ProductCats != "Pipes" || ProductCats != "Chillum" || ProductCats != "Flavours" || ProductCats != "Hookah Kit" || ProductCats != "Coal" || ProductCats != "OTHERS") {
                ProductCats == "Hookah";
            }
            Mprice = parseInt(Mprice)
            Oprice = parseInt(Oprice)
            employee_details = await db.getDB().collection("users").findOne({
                email: email
            })
                .then(async (emp_det) => {
                    if (emp_det) {
                        employee_details = emp_det;
                        T_counts = db.getDB().collection("productcodes").countDocuments({
                            "Owner_Details.Owner_email": email
                        })
                        return T_counts;
                    } else {
                        throw new Error("Whoops!");
                    }
                })
                .then(async (T_counts) => {
                    T_counts = T_counts + 1;
                    countquery = {
                        EMPID: employee_details.EMPID
                    };
                    countsUpdate = {
                        $set: {
                            TotalProducts: T_counts
                        }
                    };
                    db.getDB().collection("users").updateOne(countquery, countsUpdate)

                })
                .then(async () => {
                    CatLogs = {
                        Category: ProductCats
                    };
                    productcode = await db.getDB().collection("productcodes").find(CatLogs).sort({
                        PID: -1
                    }).limit(1).toArray();
                    return productcode
                })
                .then(async (pc) => {
                    if (pc && pc.length > 0) {
                        firstProductCodeInt = parseInt((productcode[0].PID).substr(4)) + 1;
                        firstProductCodeCat = (productcode[0].PID).substr(3, 1);
                        firstProductCode = `PID${firstProductCodeCat}${firstProductCodeInt}`
                    } else {

                        if (ProductCats == "Hookah")
                            firstProductCode = "PIDH100001";
                        else if (ProductCats == "Pipes")
                            firstProductCode = "PIDP100002";
                        else if (ProductCats == "Chillum")
                            firstProductCode = "PIDC100003";
                        else if (ProductCats == "Flavours")
                            firstProductCode = "PIDF100004";
                        else if (ProductCats == "Hookah Kit")
                            firstProductCode = "PIDK100005";
                        else if (ProductCats == "Coal")
                            firstProductCode = "PIDC100006";
                        else if (ProductCats == "OTHERS")
                            firstProductCode = "PIDO100007";

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
                    }]

                    const url_key = jwt.sign({
                        Productname,
                        colour,
                        tags,
                        ProductCats,
                        brand,
                        Mprice,
                        Oprice,
                        Owner_Details,
                        username
                    }, "hookahboi");
                    var myobj = {
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
                    }
                    inserted = await db.getDB().collection("productcodes").insertOne(myobj);
                })
                .then(() => {
                    while (i < 4) {
                        if (req.files[i].path) {
                            Image[i] = 1;
                        }
                        console.log(typeof req.files[i].path)
                        sharp(req.files[i].path, { failOnError: false }).resize(1386, 1500).toFormat("jpeg").jpeg({
                            quality: 80
                        }).toFile('./static/hookah/' + firstProductCode + '_' + i + ".jpeg")
                        sharp(req.files[i].path, { failOnError: false }).resize(380, 380).toFormat("jpeg").jpeg({
                            quality: 90
                        }).toFile('./static/hookah/thumbnail/thumbnail-' + firstProductCode + '_' + i + '.jpeg')
                        sharp(req.files[i].path, { failOnError: false }).resize(100).toFormat("jpeg").jpeg({
                            quality: 50
                        }).toFile('./static/hookah/thumbnail_table_icon/thumbnail_table_icon-' + firstProductCode + '_' + i + '.jpeg')
                        i++;

                    }
                    console.log(Image)
                })

                .catch(err =>
                    console.log(err))
                .finally(() => {
                    res.redirect('/dashboard/yourshop')
                })
        }
    });

});
myrouter.get('/checkout', checkAuthenticated, async function (req, res) {
    user_email = req.user.email;
    userCart = await db.getDB().collection('userCart').find({ email: user_email }).toArray()
        .then(async userCart => {
            if (userCart && userCart.length > 0) {
                res.status(200).render("checkout.pug", { userCart: userCart, "page_title": "DotMatrix.com: Checkout" })
            }
            else {
                res.status(200).render('underReview_.pug', { result: "No items In Your Cart", result2: "Add your Items here", "page_title": "DotMatrix.com: Checkout" })
            }
        }
        )
        .catch(err => console.log(err))

});

myrouter.get('/searchbar', async function (req, res) {
    var regex = new RegExp(req.query["term"], 'i');
    var key = req.query.key;

    var correct = (cb) => {
        spellcheck("hpme", result => {
            rat = result;
            cb();
        });
    }

    if (key == "Home") {
        var employeeFilter = await db.getDB().collection("productcodes").aggregate([{
            $unwind: '$Owner_Details'
        }, {
            $addFields: {
                OwnerPhone: { $toString: "$Owner_Details.Owner_number" },
                OwnerEmail: { $toString: "$Owner_Details.Owner_email" },
                OwnerState: { $toString: "$Owner_Details.Owner_State" },
                OwnerCity: { $toString: "$Owner_Details.Owner_City" },
                EMPLOYEEID: { $toString: "$users" },
            }
        }, {
            $match: {
                $or: [{
                    name: regex
                },
                {
                    PID: regex
                },
                {
                    OwnerPhone: regex
                },
                {
                    OwnerState: regex
                }, {
                    OwnerCity: regex
                }, {
                    brand: regex,
                }, {
                    Category: regex
                },
                {
                    colour: regex
                },
                {
                    tags: regex
                }
                ]
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
        }]).toArray()
            .then(async (employeeFilter) => { 
                if (employeeFilter.length>0) {
                    console.log(employeeFilter)
                    res.jsonp(employeeFilter);

                }
                else{
                    var employeeFilter_email = await db.getDB().collection("productcodes").aggregate([{
                        $unwind: '$Owner_Details'
                    }, {
                        $addFields: {
                            OwnerEmail: { $toString: "$Owner_Details.Owner_email" },
                            EMPLOYEEID: { $toString: "$users" }
                        }
                    }, {
                        $match: {
                            $or: [
                            {
                                OwnerEmail: regex
                            }, {
                                EMPLOYEEID: regex,
                            }
                            ]
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
                    }]).toArray()
                        
                        res.jsonp(employeeFilter_email)
                }

            })
            .catch(err =>
                console.log(err))
    } else if (key == "DONE" || key == "Pending" || key == "OnWay" || key == "") {
        if (req.isAuthenticated()) {
            user_email = req.user.email;
            var employeeFilter = await db.getDB().collection("OrderID").aggregate([{
                $unwind: '$Owner_Details'
            },
            {
                $match: {
                    'Owner_Details.Owner_email': user_email,
                    $or: [{
                        name: regex
                    },
                    {
                        P_ID2: regex
                    },
                    {
                        email: regex
                    },
                    {
                        Address: regex
                    }, {
                        OID2: regex,
                    }, {
                        Status: regex
                    },
                    {
                        date_od: regex
                    },
                    {
                        phone: regex
                    }
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$name"
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        label: "$_id"
                    }
                }
            },
            {
                $sort: {
                    OID: -1
                }
            },
            {
                $limit: 15
            }
            ]).toArray()
                .then(async (employeeFilter) => {
                    if (employeeFilter) {
                        res.jsonp(employeeFilter);

                    }

                })
                .catch(err =>
                    console.log(err))
        }
    } else if (key == "EMP_ID_PAGE") {
        if (req.isAuthenticated()) {
            user_email = req.user.email;
            var employeeFilter = await db.getDB().collection("productcodes").aggregate([{
                $unwind: '$Owner_Details'
            },
            {
                $match: {
                    'Owner_Details.Owner_email': user_email,
                    $or: [{
                        name: regex
                    },
                    {
                        colour: regex
                    },
                    {
                        brand: regex
                    },
                    {
                        Category: regex
                    }, {
                        InStock: regex,
                    }, {
                        tag: regex
                    },
                    {
                        PID: regex
                    }
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$name"
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        label: "$_id"
                    }
                }
            },
            {
                $sort: {
                    date_up: -1
                }
            },
            {
                $limit: 15
            }
            ]).toArray()
                .then(async (employeeFilter) => {
                    if (employeeFilter) {
                        res.jsonp(employeeFilter);

                    }

                })
                .catch(err =>
                    console.log(err))

        }
        else { }

    } else if (key == "forComment") {

        // $or: [{
        //     P_ID: regex
        // }
        // ]
        if (req.isAuthenticated()) {
            user_email = req.user.email;
            var employeeFilter = await db.getDB().collection("userRating").aggregate([{
                $unwind: '$email'
            },
            {
                $match: {
                    Owner_email: user_email,
                    P_ID: regex

                }
            },
            {
                "$group": {
                    "_id": "$P_ID"
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        label: "$_id"
                    }
                }
            },
            {
                $sort: {
                    date_up: -1
                }
            },
            {
                $limit: 15
            }
            ]).toArray()
                .then(async (commentFiter) => {
                    if (commentFiter) {
                        // console.log(employeeFilter)
                        res.jsonp(commentFiter);
                    }

                })
                .catch(err =>
                    console.log(err))

        }
        else { }

    }
});

myrouter.post('/dashboard/OrderRequest', checkAuthenticated, async (req, res) => {
    PID = req.query.PID;
    Proceed = req.query.Proceed;
    Owner_email = req.user.email;

    var myquery = {
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
    if (Proceed == "Update") {
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
                if (PromoCode) {
                    OfferTable = await db.getDB().collection("OFFERS_TABLE").findOne()
                    CommisionPrice = (OfferTable.CommisionPrice) / 100;
                    Payment = price_quantity * CommisionPrice;
                    Product(myquery, Payment, PromoCode, quantity, PID);
                } else {
                    CommisionPrice = 0;
                    Payment = 0;
                    Product(myquery, Payment, PromoCode, quantity, PID);
                }

            }).catch(err => console.log(err))
            .finally(() => {
                res.send("Done");
            })
    } else if (Proceed == "Cancel") {
        var myquery = {
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
        var newvalues = {
            $set: {
                Status: "Cancel"
            }
        };
        OrderId_Cancel = await db.getDB().collection("OrderID").updateOne(myquery, newvalues)
            .catch(err => console.log(err))
            .finally(() => {
                res.send("Done");
            })

    } else if (Proceed == "OnWay") {
        var myquery = {
            $and: [{
                "Owner_Details.Owner_email": Owner_email
            }, {
                OID: PID
            }, {
                Status: "pending"
            }]
        };
        var newvalues = {
            $set: {
                Status: "OnWay"
            }
        };
        OrderId_OnWay = await db.getDB().collection("OrderID").updateOne(myquery, newvalues)
            .catch(err => console.log(err))
            .finally(() => {
                res.send("Done");
            })


    }

    async function Product(myquery, Payment, PromoCode, quantity, PID) {
        Productcodes = await db.getDB().collection("productcodes").findOne({
            PID: PID
        })
            .then(async Productcodes => {
                if (Productcodes) {
                    TotalOrders = parseInt(Productcodes.TotalOrders) + quantity;
                    var newvalues = {
                        $set: {
                            TotalOrders: TotalOrders
                        }
                    };
                    product_update = await db.getDB().collection("productcodes").updateOne({
                        PID: PID
                    }, newvalues)
                    promocodes = await db.getDB().collection("promocodes").findOne({
                        PromoCode: PromoCode
                    })
                    return promocodes;
                } else {
                    res.status(404).render("errorpage.pug");
                }


            })
            .then(async promocodes => {
                if (promocodes) {
                    product = promocodes.product + parseInt(quantity);
                    Commision = Math.round(promocodes.Commision + Payment);
                    var SetProduct = {
                        $set: {
                            Commision: Commision,
                            product: product
                        }
                    };
                    update_promocodes = await db.getDB().collection("promocodes").updateOne({
                        PromoCode: PromoCode
                    }, SetProduct)
                }
            })
            .then(async () => {

                var DONE = {
                    $set: {
                        Status: "DONE"
                    }
                };
                update_OrderID = await db.getDB().collection("OrderID").updateOne(myquery, DONE);


            })
            .catch(err => console.log(err))

    }
});

module.exports = myrouter;