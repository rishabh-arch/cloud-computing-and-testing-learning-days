const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const user = require('./mongoBase/userSc.js');
const EmployeeSc = require('./mongoBase/EmployeeSc.js');
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "prernagarg0509@gmail.com",
        pass: '9650199842p'
    }
});
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const myrouter = require('./HOME/ProductHome.js');
// const mongourl = require('../config/mongokey');
require('./passport')(passport);
require('dotenv').config()
    // const db = require('../mongoBase/db.js');

var mongourl = "mongodb://localhost/trial";

// using Bodyparser for getting form data
routes.use(bodyparser.urlencoded({ extended: true }));
// using cookie-parser and session 
routes.use(cookieParser('secret'));
routes.use(session({
    secret: 'secret',
    secure: true,
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
}));
// using passport for authentications 
routes.use(passport.initialize());
routes.use(passport.session());
// using flash for flash messages 
routes.use(flash());

// MIDDLEWARES
// Global variable
myrouter.use(function(req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

const checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

// Connecting To Database
// using Mongo Atlas as database
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database Connected"));

// ALL THE ROUTES 
routes.get('/register', (req, res) => {
    res.render('register.pug');
})


// var mailOptions = {
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
routes.post('/register', (req, res) => {
    Usertype = 'user';
    var { email, username, password, confirmpassword, Address, State, City, pincode, phone, Gender } = req.body;
    if (req.body.type) {
        Usertype = req.body.type;
    } else {
        console.log("nothiongn is there")
    }
    var EMPID = Date.now();
    var TotalProducts = 0;
    var ShopEmployee = false;
    var err;
    email = email.toLowerCase();
    if (!email || !username || !password || !Gender || !confirmpassword || !Address || !State || !City || !pincode || !phone) {
        err = "Please Fill All The Fields...";
        res.render('register.pug', { 'err': err });
    }
    if (password != confirmpassword) {
        err = "Passwords Don't Match";
        res.render('register.pug', { 'err': err, 'email': email, 'username': username });
    }

    if (typeof err == 'undefined') {
        user.findOne({ email: email }, function(err, data) {
            if (err) throw err;
            if (data) {
                console.log("User Exists");
                err = "User Already Exists With This Email...";
                res.render('register.pug', { 'err': err, 'email': email, 'username': username });
            } else {
                const token = jwt.sign({ username, email, password }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' });
                console.log(token)
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;
                        user({
                            email,
                            username,
                            password,
                            Address,
                            State,
                            City,
                            Gender,
                            pincode,
                            phone,
                            Usertype
                        }).save((err, data) => {
                            if (err) throw err;
                            req.flash('success_message', "Registered Successfully.. Login To Continue..");
                            res.redirect('/login');
                        });

                    });
                });
            }
        });
    }
});

routes.get('/forEmpPage', checkAuthenticated, (req, res) => {

    res.status(200).render('forEmpPage.pug', { 'param': 'param' });
})


routes.get('/login', (req, res) => {
    username = "";
    res.render('login');
});


routes.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/dashboard',
        failureFlash: true,
    })(req, res, next);
});

routes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});



module.exports = routes;