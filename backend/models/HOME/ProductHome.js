var express = require('express');
var myrouter = express.Router();
const path = require("path");
const fs = require("fs");
const app = express();
var validator = require("email-validator");
const bodyparser = require('body-parser')
var session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
require('../../models/passport')(passport);
const cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
var domain = require("domain").create();
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const db = require('../mongoBase/db.js');
const { Console } = require("console");
const { parse } = require("path");
const { createBrotliCompress } = require("zlib");
const { doesNotThrow, throws, strict } = require("assert");
const { totalmem } = require('os');

var razorpay = require("razorpay");
const { resolveSoa } = require('dns');

// EXPRESS SPECIFIC STUFF
// app.use('/static', express.static('static')) // For serving static files
// app.use(express.urlencoded());
// app.use(fileUpload());

// // PUG SPECIFIC STUFF
// app.set('view engine', 'pug') // Set the template engine as pug
// app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

let instance = new razorpay({
    key_id: 'rzp_test_prQcCHNWovj933', // your `KEY_ID`
    key_secret: 'jC8edUWi5A6rpNgoInWAPMj3' // your `KEY_SECRET`
})

const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

myrouter.post('/p/:tagId', async (req, res) => {
    var email = "";
    // var options = {
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

    tag_ID = req.params.tagId
    var { customer_name, phone, address, PromoCode, quantity } = req.body;
    var firstOrderCode, firstOrderCodeInt;
    var Promo_Code, Discount, Dis_price;
    date_js = new Date();

    OrderID = await db.getDB().collection("OrderID").find({}).sort({ _id: -1 }).limit(1).toArray()
        .then(pi => {

            if (pi && pi.length > 0) {
                firstOrderCodeInt = parseInt((pi[0].OID).substr(4)) + 1;
                firstOrderCode = `OID-${firstOrderCodeInt}`
            }
            else {
                firstOrderCode = "OID-100001";
            }
        })
        .then(async () =>
            Product_tagID = await db.getDB().collection("productcodes").findOne({ PID: tag_ID })
        )
        .then(async (Product_tagID) => {
            console.log(Product_tagID)
            if (Product_tagID) {
                Product_tagID_data = Product_tagID;
                return Product_tagID;
            } else {
                throw new Error("Whoops!");
            }
        })
        .then(async (Product_tagID) => {
            Oprice = Product_tagID.Oprice;
            Mprice = Product_tagID.Mprice;
            pID = Product_tagID.PID;
            Owner_Adress = Product_tagID.Owner_Details[0].Owner_Adress;
            Owner_number = Product_tagID.Owner_Details[1].Owner_number;
            Owner_name = Product_tagID.Owner_Details[2].Owner_name;
            Owner_email = Product_tagID.Owner_Details[3].Owner_email;
            Promo_code = await db.getDB().collection("promocodes").findOne({ PromoCode: PromoCode })
            console.log(Promo_code)
            console.log(PromoCode)

            return Promo_Code;
        })
        .then(async (Promo_Code) => {
            if (Promo_code) {
                PromoCode = Promo_code.PromoCode;
                Offer = await db.getDB().collection("OFFERS_TABLE").findOne()
                OfferMaxPrice = parseInt(Offer.OfferMaxPrice);
                OfferDiscount = parseInt(Offer.DiscountPrice) / 100;
                if (Oprice >= OfferMaxPrice) {
                    console.log("OPrice>omp")

                    Discount = Math.round(Oprice * OfferDiscount);
                    Dis_price = Math.round(Oprice - Discount);
                    Price_Quan = quantity * Dis_price;
                    return { Discount, Dis_price, Price_Quan, PromoCode }

                } else {
                    Discount = 0;
                    Dis_price = 0;
                    Price_Quan = Oprice * quantity;
                    console.log("else")

                    return { Discount, Dis_price, Price_Quan, PromoCode }
                }
            } else {
                console.log("no Promo_Code")

                Price_Quan = Oprice * quantity;
                Discount = 0;
                Dis_price = 0;
                PromoCode = "NAN";
                return { Discount, Dis_price, Price_Quan, PromoCode }
            }
        })
        .then(async PromoCode_values => {
            console.log(PromoCode_values.Discount + " 1 " + PromoCode_values.Dis_price + " 2 " + PromoCode_values.Price_Quan + " 3 " + PromoCode_values.PromoCode)

            var myobj = {
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
                Owner_Details: [{ Owner_Adress: Owner_Adress }, { Owner_number: Owner_number }, { Owner_name: Owner_name }, { Owner_email: Owner_email }],
                quantity: quantity,
                price_quantity: Price_Quan,
                date_od: date_js,
                Status: "pending"
            };

            insertOrder = await db.getDB().collection("OrderID").insertOne(myobj)
        })
        .catch(err =>
            console.log(err)
            // res.status(404).render("errorpage.pug"))
        )
        .finally(
            res.redirect("/")
        )

});
myrouter.post('/user/deletefromcart/:pid', async (req, res) => {
    if (req.isAuthenticated()) {
        PID = req.params.pid;
        url_key = req.query.key;
        user_email = req.user.email;
        quantity = req.body.quantity;
        recquery = { email: user_email, PID: PID, url_key: url_key }
        productVerify = await db.getDB().collection('productcodes').findOne({ PID: PID, url_key: url_key })
            .then(async productVerify => {
                if (productVerify) {
                    count_result = await db.getDB().collection("userCart").deleteOne({ $and: [{ email: user_email, url_key: url_key, PID: PID }] })
                    res.send("deleted")

                }
                else {
                    throw new Error("product not found");
                }
            })
            .catch(err => console.log(err))

    } else {
        res.send("error")
    }


});
myrouter.post('/user/editfromcart/:pid', checkAuthenticated, async (req, res) => {
    PID = req.params.pid;
    url_key = req.query.key;
    quantity = parseInt(req.query.quantity);
    user_email = req.user.email;
    recquery = { email: user_email, PID: PID, url_key: url_key }
    productVerify = await db.getDB().collection('productcodes').findOne({ PID: PID, url_key: url_key })
        .then(async productVerify => {
            if (productVerify) {
                count_result = await db.getDB().collection("userCart").updateOne({ $and: [{ email: user_email, url_key: url_key, PID: PID }] }, { $set: { quantity: quantity } })
                res.send("done")

            }
            else {
                throw new Error("product not found");
            }
        })
        .catch(err => console.log(err))

});
myrouter.post('/user/addtocart/:pid', async (req, res) => {
    if (req.isAuthenticated()) {
        PID = req.params.pid;
        url_key = req.query.key;
        user_email = req.user.email;
        quantity = parseInt(req.body.quantity);
        if(!quantity || quantity===NaN || typeof quantity!='number')
            quantity =1;
        recquery = { email: user_email, PID: PID, url_key: url_key }
        productVerify = await db.getDB().collection('productcodes').findOne({ PID: PID, url_key: url_key })
            .then(async productVerify => {
                if (productVerify) {
                    var { name, brand, colour, Oprice } = productVerify
                    count_result = await db.getDB().collection("userCart").countDocuments({ email: user_email })
                    cartquery = { email: user_email, PID: PID, url_key: url_key, quantity: quantity, PID_name: name, brand: brand, colour: colour, Oprice: Oprice }
                    return count_result;
                }
                else {
                    throw new Error("product not found");
                }
            })
            .then(async count_result => {
                if (count_result > 3) {
                    throw new Error("max limit 4");
                }
                else {
                    productRecords = await db.getDB().collection("userCart").findOne(recquery)
                    return productRecords;
                }
            })
            .then(async productRecords => {
                if (productRecords) {
                    quantitynew = parseInt(productRecords.quantity) + quantity
                    usercart = await db.getDB().collection("userCart").updateOne(recquery, { $set: { quantity: quantitynew } })
                    res.send({ "add": "quantity update" })
                }
                else {
                    usercart = await db.getDB().collection("userCart").insertOne(cartquery)
                    res.json({ "add": "Added to cart" })
                }
            })
            .catch(err => res.send({ "add": err.message }))
    }
    else { res.send({ "add": "Login First" }) }
})


myrouter.get('/p/:tagId', async (req, res) => {
    var userRating;
    var cartQuantity;
    tag_ID = req.params.tagId;
    if (req.isAuthenticated()) {
        userRating = await db.getDB().collection("userRating").findOne({ $and: [{ email: req.user.email }, { P_ID: tag_ID }] });
        All_in_cart = await db.getDB().collection("userCart").findOne({ $and: [{ email: req.user.email }, { PID: tag_ID }] });
        if (!userRating)
            userRating = "";
        if (!All_in_cart)
            cartQuantity = "";
        else
            cartQuantity = All_in_cart.quantity;

    }
    else {
        userRating = "";
        cartQuantity = "";

    }
    userRatingAll = await db.getDB().collection("userRating").find({ P_ID: tag_ID }).sort({ Rating: -1 }).limit(10).toArray();
    totalReview = await db.getDB().collection("userRating").countDocuments({ P_ID: tag_ID });
    console.log(cartQuantity)
    url_key = req.query.key;
    var params = null;
    result = await db.getDB().collection("productcodes").findOne({
        $and: [{ PID: tag_ID }, {
            url_key: url_key
        }]
    })
        .then(async result => {
            if (result) {
                productFetched = result;
                Owner_email = result.Owner_Details[3].Owner_email;
                ownerproducts = await db.getDB().collection("productcodes").find({ PID: { $ne: tag_ID } }, { "Owner_Details.Owner_email": Owner_email }).sort({ PID: -1 }).limit(5).toArray();
                params = { "OBJ": productFetched, "OBJ2": ownerproducts, "userRating": userRating, "userRatingAll": userRatingAll, "totalReview": totalReview,"page_title":`DotMatrix.com: ${result.name}`,"cartQuantity":cartQuantity };
                res.status(200).render('12345.pug', params)
            }
            else
                throw new Error("not Product")
        })
        .catch(err =>
            res.status(404).render("errorpage.pug")
        )

});

myrouter.post('/rating/:tagid', async (req, alert) => {
    if (req.isAuthenticated()) {
        email = req.user.email;
        reviewer_name = req.user.username;
        uniqueID = req.user.uniqueID;
        rate = parseInt(req.body.star);
        Comment = req.body.Comment;
        P_ID = req.params.tagid;
        PID = P_ID;
        dateRate = new Date();
        productcode = await db.getDB().collection("productcodes").findOne({ PID: PID })
            .then(async productcode => {
                if (productcode) {
                    Owner_email = productcode.Owner_Details[3].Owner_email
                    var myquery = { $and: [{ P_ID: PID }, { email: email }, { Owner_email: Owner_email }] };
                    var newvalues = { $set: { Rating: rate, Comment: Comment, dateRate: dateRate,uniqueID:uniqueID,reviewer_name:reviewer_name } };
                    update_result = await db.getDB().collection("userRating").updateOne(myquery, newvalues, { upsert: true })
                    product_rating_insertion();
                    alert.send("Rating Submitted")
                }
                else
                    alert.send("Product not found")
            });
    } else {
        alert.send("Please Login First")
    }

    function product_rating_insertion() {
        db.getDB().collection("userRating").aggregate([{ $unwind: '$P_ID' }, { $match: { P_ID: PID } }, { $group: { _id: "$Rating", count: { $sum: 1 }, "Rating": { $sum: "$Rating" } } }]).toArray(function (err, newJsonObj) {
            var myquery = { PID: PID };
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
                id = item._id
                if (id === 1) {
                    count1 = item.count
                    Rating1 = item.Rating
                } else if (id === 2) {
                    count2 = item.count
                    Rating2 = item.Rating

                } else if (id === 3) {
                    count3 = item.count
                    Rating3 = item.Rating

                } else if (id === 4) {
                    count4 = item.count
                    Rating4 = item.Rating

                } else if (id === 5) {
                    count5 = item.count
                    Rating5 = item.Rating

                }
            }


            RatingCounts = count5 + count1 + count2 + count3 + count4;
            Rate1_per = ((count1 / RatingCounts) * 100).toFixed(1);
            Rate2_per = ((count2 / RatingCounts) * 100).toFixed(1);
            Rate3_per = ((count3 / RatingCounts) * 100).toFixed(1);
            Rate4_per = ((count4 / RatingCounts) * 100).toFixed(1);
            Rate5_per = ((count5 / RatingCounts) * 100).toFixed(1);
            SumOfRatings = Rating1 + Rating2 + Rating3 + Rating4 + Rating5;
            finalrate = parseFloat((SumOfRatings / RatingCounts).toFixed(1));
            var newvalues = { $set: { Rating: finalrate, P_Rate: [Rate1_per, Rate2_per, Rate3_per, Rate4_per, Rate5_per] } };
            db.getDB().collection("productcodes").updateOne(myquery, newvalues, function (err, rest) {
                if (err) {
                    console.log(err);
                }
                console.log(finalrate)
            });
        });


    }
});

myrouter.get('/user/Cart', (req, res) => {
    if (req.isAuthenticated()) {
        email = req.user.email
        db.getDB().collection("UsersBookmark").find({ email: req.user.email }).toArray(function (err, result) {
            if (result != "") {
                const params = { 'newOBJ': result,"page_title":"DotMatrix.com: Your Cart" }
                res.status(200).render('Cart.pug', params);
            } else {
                res.status(200).render('underReview_.pug', { 'result': 'No Favourites Right Now' });
            }
        });
    } else {
        res.redirect('/login')
    }
})

myrouter.post('/product/user/bookmark', async (req, res) => {
    if (req.isAuthenticated()) {
        P_ID = req.body.PID;
        userBookmark_result = await db.getDB().collection("UsersBookmark").findOne({ $and: [{ P_ID: P_ID }, { email: req.user.email }] })
            .then(async uB_result => {
                if (!uB_result) {
                    countBookmark = await db.getDB().collection("UsersBookmark").countDocuments({ email: req.user.email })
                    return countBookmark;
                } else {
                    throw new Error("Already Saved");
                }
            })
            .then(async countBookmark => {
                if (countBookmark <= 19) {
                    productcodes = await db.getDB().collection("productcodes").findOne({ PID: P_ID })
                    P_name = productcodes.name;
                    P_Mprice = productcodes.Mprice;
                    P_Oprice = productcodes.Oprice;
                    P_Category = productcodes.Category;
                    P_Specification = productcodes.Specification;
                    url_key = productcodes.url_key;
                    newvalues = { P_ID: P_ID, email: req.user.email, P_name: P_name, P_Mprice: P_Mprice, P_Oprice: P_Oprice, P_Category: P_Category, P_Specification: P_Specification, url_key: url_key };
                    return productcodes
                }
            })
            .then(async (pc) => {
                if (pc) {
                    await db.getDB().collection("UsersBookmark").insertOne(newvalues)
                    return res.json({ "add": "Saved" })
                } else {
                    return res.json({ "add": "Not More Than 20" })
                }
            })
            .catch(err => res.json({
                "add": err.message
            }))
    } else {
        res.json({ "add": "Login First" })
    }
});
myrouter.post('/product/user/bookmark/delete', async (req, res) => {
    if (req.isAuthenticated()) {
        P_ID = req.body.PID;
        userBookmark = await db.getDB().collection("UsersBookmark").findOne({ $and: [{ P_ID: P_ID }, { email: req.user.email }] })
            .then(async uB => {
                if (uB) {
                    uBdeleted = await db.getDB().collection("UsersBookmark").deleteOne({ $and: [{ P_ID: P_ID }, { email: req.user.email }] })
                    throw new Error("Deleted");

                } else {
                    productcodes = await db.getDB().collection("productcodes").findOne({ PID: P_ID })
                    P_name = productcodes.name;
                    P_Mprice = productcodes.Mprice;
                    P_Oprice = productcodes.Oprice;
                    P_Category = productcodes.Category;
                    P_Specification = productcodes.Specification;

                    newvalues = { P_ID: P_ID, email: req.user.email, P_name: P_name, P_Mprice: P_Mprice, P_Oprice: P_Oprice, P_Category: P_Category, P_Specification: P_Specification };
                    return productcodes;
                }
            })
            .then(async pc => {
                inserted = await db.getDB().collection("UsersBookmark").insertOne(newvalues)
                res.json({ "add": "Save Again" });
            })
            .catch(
                err => res.json({
                    "add": err.message

                })
            )
    } else {

        res.json({ "add": "Login First" })
    }
});
module.exports = myrouter;