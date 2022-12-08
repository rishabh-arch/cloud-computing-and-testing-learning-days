var express = require('express');
var myrouter = express.Router();

const path = require("path");
const fs = require("fs");
const app = express();
const port = 80;
const bodyparser = require('body-parser')
var nodemailer = require('nodemailer');
var domain = require("domain").create();
var session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
require('../passport')(passport);
const db = require('../mongoBase/db.js');

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded());
// app.use(fileUpload());

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory



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
const checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

myrouter.get('/Dashboard/OrderRequest', checkAuthenticated, async function(req, res) {
    var regex = new RegExp(req.query.type, 'i');
    email = req.user.email;
    skip2 = 0
    next = parseInt(req.query.page);
    if (next >= 2) {
        skip2 = 50 * (next - 1);
        next = next + 1;
        previous = next - 2;
    } else {
        next = 2;
        previous = '/';
    }
    Employee_ID = await db.getDB().collection("EMPLOYEE_ID").findOne({ email: email })
        .then(async(Employee_ID) => {
            if (Employee_ID) {
                OrderID = await db.getDB().collection("OrderID").find({
                    $and: [{ Status: regex }, { "Owner_Details.Owner_email": email }]
                }).sort({ _id: -1 }).limit(50).skip(skip2).toArray();
                return OrderID
            } else
                throw new Error("#")
        })
        .then(async OrderID => {
            if (OrderID) {
                const params = { 'newOBJ': OrderID, 'next': next, 'back': previous, "procced_type": req.query.type }
                res.status(200).render('dashboard/Table.pug', params);
            } else {
                res.status(200).render('dashboard/underReview.pug', { 'result': 'No Orders Right Now' });
            }
        })
        .catch(err => res.status(404).render('errorpage'))

})

myrouter.post('/AddOffer', (req, res) => {
    OfferMaxPrice = req.body.OfferMaxPrice
    DiscountPrice = req.body.DiscountPrice
    CommisionPrice = req.body.CommisionPrice
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("trial");
        var newvalues = { OfferMaxPrice: OfferMaxPrice, DiscountPrice: DiscountPrice, CommisionPrice: CommisionPrice };
        dbo.collection("OFFERS_TABLE").insertOne(newvalues, function(err, res) {
            if (err) throw err;
            // console.log("1 document updated");
            db.close();
        });
    });
    res.redirect("/Controlpanel")
})





module.exports = myrouter;