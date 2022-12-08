const express = require('express');
const routes = express.Router();
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
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
require('./passport')(passport);
require('dotenv').config()
const db = require('./mongoBase/db.js');


// using Bodyparser for getting form data
routes.use(bodyparser.urlencoded({ extended: true }));
// using cookie-parser and session 

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

myrouter.get('/auth/facebook',
  passport.authenticate('facebook'));

  myrouter.get('/auth/fb/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
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
routes.post('/register', async(req, res) => {
    Usertype = 'user';
    var { email, username, password, confirmpassword, Address, State, City, pincode, phone, Gender,TnC_check } = req.body;
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
    if (!email || !username || !password || !Gender || !confirmpassword || !Address || !State || !City || !pincode || !phone || !TnC_check || TnC_check!="check") {
        err = "Please Fill All The Fields...";
        res.render('register.pug', { 'err': err });
    }
    if (password != confirmpassword) {
        err = "Passwords Don't Match";
        res.render('register.pug', { 'err': err, 'email': email, 'username': username });
    }

    if (typeof err == 'undefined') {
        users = await db.getDB().collection("users").findOne({ email: email })
            .then(async(users) => {
                if (users) {
                    err = "User Already Exists With This Email...";
                    res.render('register.pug', { 'err': err, 'email': email, 'username': username });
                } else {
                    const token = jwt.sign({ username, email, password }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' });
                    console.log(token)
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw new Error("#");
                        bcrypt.hash(password, salt, async(err, hash) => {
                            if (err) throw new Error("#");
                            password = hash;
                            users_insert = await db.getDB().collection("users").insertOne({
                                email: email,
                                username: username,
                                password: password,
                                Address: Address,
                                State: State,
                                City: City,
                                Gender: Gender,
                                pincode: pincode,
                                phone: phone,
                                Usertype: Usertype,
                            }).then(() => {
                                req.flash('success_message', "Registered Successfully.. Login To Continue..");
                                res.redirect('/login');
                            }).catch(err => {
                                console.log(err)
                            })

                        });
                    });
                }
            })
    }
});

routes.get('/login', (req, res) => {
    username = "";
    res.render('login');
});


routes.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true,
    })(req, res, next);
});

routes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});



module.exports = routes;