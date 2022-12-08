var express = require('express');
var myrouter = express.Router();
const bcrypt = require('bcryptjs');
const sharp = require('sharp')

const path = require("path");
const fs = require("fs");
const app = express();
const port = 80;
const bodyparser = require('body-parser')

var nodemailer = require('nodemailer');

// var domain = require("domain").create();
var crypto = require('crypto');
const IV_LENGTH = 16;
var session = require('express-session')
const flash = require('connect-flash');

var ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
var algo = 'aes-256-ctr';
var jsonParser = bodyparser.json();
const jwt = require("jsonwebtoken")
const fileUploadCtrl = require('../FileUp.js').hookah_Upload;
require('dotenv').config()

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { ObjectId } = require("mongodb");
const { Console } = require("console");
const { parse } = require("path");
const { createBrotliCompress } = require("zlib");
const { doesNotThrow, throws } = require("assert");
const db = require('../mongoBase/db.js');

const passport = require('passport');
require('../passport')(passport);

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

const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
        // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    } else {
        res.redirect('/login');
    }
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "prernagarg0509@gmail.com",
        pass: '9650199842p'
    }
});




//TO INSERT DATA IN MONGODB


// EXPRESS SPECIFIC STUFF
myrouter.use('/static', express.static('static')) // For serving static files
myrouter.use(express.urlencoded());


myrouter.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        // return next();
        res.send(req.user);
        // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    } else {
        res.redirect('/login');
    }
})

myrouter.get('/forgotpassword', (req, res) => {

    res.render('forgotPassword.pug');
});
myrouter.get('/dashboard/ChangePassword',checkAuthenticated, (req, res) => {

    res.render('dashboard/ChangePassword.pug');
});
myrouter.get('/reg-dashboard/ChangePassword',checkAuthenticated, (req, res) => {

    res.render('regular_user/userChangePassword.pug',{"color_pass":"#007bff"});
});
myrouter.get('/dashboard/RechargeAccount', checkAuthenticated, async (req, res) => {
    res.render('dashboard/underReview_.pug');
});
myrouter.get('/rechargeDone', checkAuthenticated, async (req, res) => {
    user_email = req.user.email;
    var newDate, oldDate;
    var TodayDate = new Date();
    T_D_M = TodayDate.getTime();
    Employee_ID = await db.getDB().collection("EMPLOYEE_ID").findOne({ email: user_email })
        .then(async Employee_ID => {
            if (Employee_ID) {

                Emp_date = Employee_ID.Emp_date;
                E_D_M = Emp_date.getTime();

                if (E_D_M > T_D_M) {
                    oldDate = Emp_date.getMonth();
                    newDate = new Date(Emp_date.setMonth(oldDate + 1))
                }
                else {
                    oldDate = TodayDate.getMonth();
                    newDate = new Date(TodayDate.setMonth(oldDate + 1))
                }
                Employee_update = await db.getDB().collection("EMPLOYEE_ID").updateOne({ email: user_email }, { $set: { Emp_date: newDate } })
                Product_update = await db.getDB().collection("productcodes").updateMany({ "Owner_Details.Owner_email": user_email }, { $set: { Emp_date: newDate } })
            }
            else
                throw new Error("Not Employee")
            res.status(200).render('dashboard/underReview_.pug');

        })
        .catch(err => console.log(err)
        )
});

myrouter.post('/dashboard/ChangePassword', checkAuthenticated, async (req, res) => {
    var from = req.query.from
    var { old_password, new_password, confirmpassword } = req.body;
    user_email = req.user.email;
    UserOldPass = await db.getDB().collection("users").findOne({ email: user_email })
        .then(async UserOldPass => {
            if (!UserOldPass) {
                throw new Error("User Doesn't Exists..")
            }
            else {
                if (new_password == confirmpassword) {
                    ConfirmOldPass = await bcrypt.compare(old_password, UserOldPass.password)
                    return ConfirmOldPass;
                }
                else
                    throw new Error("Password Don't Match")
            }
        })
        .then(async ConfirmOldPass => {
            if (!ConfirmOldPass) {
                throw new Error("Incorrect old Password!");
            } else {
                salt = await bcrypt.genSalt(10)
                return salt;
            }
        }).then(async salt => {
            if (salt) {
                hash = await bcrypt.hash(new_password, salt)
                return hash;
            }
            else
                throw new Error("User Doesn't Exists..")
        }
        ).then(async hash => {
            if (hash) {
                users_insert = await db.getDB().collection("users").updateOne({ email: user_email }, {
                    $set: {
                        password: hash
                    }
                })
                res.redirect('/logout')
            }
            else {
                throw new Error("User Doesn't Exists..")

            }
        })
        .catch(err => {
            if (from == "dashboard")
                res.render("dashboard/ChangePassword.pug", { 'message': err })
            else if (from == "reg_dashboard")
                res.render("regular_user/userChangePassword.pug", { 'message': err })
            else
                res.status(404).render("errorpage")

        })


});

myrouter.post('/userNewpassword', async (req, res) => {
    user_email = req.body.user_email;
    userid = await db.getDB().collection("users").findOne({ email: user_email })
        .then(userid => {
            if (userid) {
                const token = jwt.sign({ user_email }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' });
                var mailOptions = {
                    from: "prernagarg0509@gmail.com",
                    to: user_email,
                    subject: "HookahBoi Account",
                    html: `<H1>Welcome To Hookah Club</H1><P>Click on the link to change your password</P><p><a href="http://192.168.0.103:5000/EmailPasswordVerification/${token}">Click Here to Proceed</a>`
                };
                console.log(token)
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return (error);
                    } else {
                        console.log("Link sent")
                    };
                });

                res.render('forgotPassword.pug', { "message": "link Successfully sent to your email....." });
            } else {
                throw new Error("This Email is not Registered");
            }
        })
        .catch(err =>
            res.render('forgotPassword.pug', { "message": err.message })
        )
});
myrouter.get('/EmailPasswordVerification/:tagid', async (req, res) => {
    const token = req.params.tagid;
    if (token) {
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, async function (err, decodedToken) {
            if (err) {
                return res.status(404).render('errorpage.pug')
            } else {
                const { user_email } = decodedToken;
                userid = await db.getDB().collection("users").findOne({ email: user_email })
                    .then((userid) => {
                        if (userid) {
                            res.render('newEmailPassword.pug', { "message": `Enter new Password for ${user_email}`, "token": token });
                        } else {
                            throw new Error("#");
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
    } else {
        res.status(404).render("errorpage")
    }
});
myrouter.post('/newPassword/:tagid', async (req, res) => {
    const token = req.params.tagid;
    var { password, confirmpassword } = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, async function (err, decodedToken) {
            if (err) {
                throw new Error("#");
            } else {
                if (!password || !confirmpassword) {
                    err = "Please Fill All The Fields...";
                    res.render('newEmailPassword.pug', { 'err': err });
                } else if (password != confirmpassword) {
                    err = "Passwords Don't Match";
                    res.render('newEmailPassword.pug', { 'err': err });
                } else {
                    const { user_email } = decodedToken;
                    users = await db.getDB().collection("users").findOne({ email: user_email })
                        .then(async (users) => {
                            if (!users) {
                                throw new Error("#");
                            } else {
                                salt = await bcrypt.genSalt(10)
                                return salt;
                            }
                        }).then(async salt => {
                            if (salt) {
                                hash = await bcrypt.hash(password, salt)
                                return hash;
                            }
                            else
                                throw new Error("#");
                        }).then(async hash => {
                            if (hash) {
                                password = hash;
                                rk = 
                                users_insert = await db.getDB().collection("users").updateOne({ email: user_email }, {
                                    $set: {
                                        password: password
                                    }
                                })
                            }
                            else
                                throw new Error("#");
                        }).then(() => {
                            req.flash('success_message', "Password Changed Successfully.. Login To Continue..");
                            res.redirect('/login');
                        }).catch(err =>
                            console.log(err)
                        )
                }
            }
        })
    } else {
        console.log("err3")

        res.status(404).render("errorpage")
    }
})




myrouter.get('/Dashboard/EMP_ID_PAGE', async function (req, res) {
    if (req.isAuthenticated()) {
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

        var myquery = { "email": email };
        Employee_ID = await db.getDB().collection("EMPLOYEE_ID").findOne(myquery)
            .then(async Employee_ID => {
                if (Employee_ID) {
                    var myquery2 = { "Owner_Details.Owner_email": email };
                    productcodes = await db.getDB().collection("productcodes").find(myquery2).sort({ _id: -1 }).limit(50).skip(skip2).toArray()
                    return productcodes;
                } else {
                    throw new Error("!");
                }
            })
            .then(async productcodes => {
                if (productcodes) {
                    params = { 'newObj': productcodes };
                    res.status(200).render('dashboard/EMP_ID_PAGE.pug', params);
                } else {
                    throw new Error("#");
                }
            })
            .catch(err => {
                if (err.message == "#")
                    res.status(200).render('dashboard/underReview.pug', { 'result': 'OMG', "result2": "No products Are here" });
                else if (err.message == "!")
                    res.status(404).render('errorpage.pug')
            })
    } else {
        res.redirect('/login');
    }
})

myrouter.get('/Dashboard/ShowComments', checkAuthenticated, async (req, res) => {
    email = req.user.email
    skip2 = 0;
    next = parseInt(req.query.page);
    if (next >= 2) {
        skip2 = 50 * (next - 1);
        next = next + 1;
        previous = next - 2;
    } else {
        next = 2;
        previous = '/';
    }
    Ratings = await db.getDB().collection("userRating").find({ Owner_email: email }).sort({ _id: -1 }).skip(skip2).limit(50).toArray()
        .then(Ratings => {
            if (Ratings) {
                const params = { 'Ratings': Ratings, 'next': next, 'back': previous }
                res.status(404).render('dashboard/Commentsec.pug', params);
            } else {
                res.status(200).render('errorpage.pug');
            }
        })
})

myrouter.get('/comments', async (req, res) => {
    PID = req.query.PID
    skip2 = 0;
    limit=20;
    next = parseInt(req.query.page);
    if (next >= 2) {
        skip2 = limit * (next - 1);
        next = next + 1;
        previous = next - 2;
    } else {
        next = 2;
        previous = '/';
    }
    Ratings = await db.getDB().collection("userRating").find({ P_ID: PID }).sort({ _id: 1 }).skip(skip2).limit(limit).toArray()
        .then(Ratings => {
            if (Ratings.length > 0) {
                const params = { 'Ratings': Ratings, 'next': next, 'back': previous, "PID": PID }
                res.status(404).render('productComment.pug', params);
            } else {
                res.status(200).render('underReview_.pug',{"result":"No More Comments","result2":"Are You really Interested to check Comment Stuff!"});
            }
        })
})


myrouter.get('/Dashboard/EditProduct', checkAuthenticated, async (req, res) => {
    email = req.user.email
    Product_ID = req.query.pid
    product_detail = await db.getDB().collection("productcodes").findOne({ $and: [{ "Owner_Details.Owner_email": email }, { PID: Product_ID }] })
        .then(product_detail => {
            if (product_detail != "") {
                const params = { 'product_detail': product_detail }
                res.status(200).render('dashboard/EditProduct.pug', params);
            } else {
                res.status(404).render('errorpage.pug');
            }
        })
})


myrouter.post('/Dashboard/EditProduct/:tagid', checkAuthenticated, async (req, res) => {
    var i = 0;
    email = req.user.email;
    ownername = req.user.username;
    Product_ID = req.params.tagid
    fileUploadCtrl(req, res, async function (err) {
        if (err) {
            res.send(err)
        } else {
            var { Productname, colour, Mprice, Oprice, tags, ProductCats, Quantities, specs, InStock } = req.body;
            console.log(specs);
            console.log(tags);
            Mprice = parseInt(Mprice)
            Oprice = parseInt(Oprice)
            employee_details = await db.getDB().collection("EMPLOYEE_ID").findOne({ email: email })
                .then(async (emp_det) => {
                    if (emp_det) {
                        CatLogs = { $and: [{ "Owner_Details.Owner_email": email }, { PID: Product_ID }] };
                        var newvalues = {
                            $set: {
                                name: Productname,
                                colour: colour,
                                Mprice: Mprice,
                                Oprice: Oprice,
                                tag: tags,
                                Specification: specs,
                                Category: ProductCats,
                                InStock: InStock,
                                Quantities: Quantities
                            }
                        };
                        productcode = await db.getDB().collection("productcodes").updateOne(CatLogs, newvalues)
                        return productcode
                    } else {
                        throw new Error("Whoops!");

                    }
                })


                .then(() => {
                    while (i < 4) {
                        sharp(req.files[i].path).resize(1386, 1500).toFormat("jpeg").jpeg({ quality: 80 }).toFile('./static/hookah/' + Product_ID + '_' + i + ".jpeg")
                        sharp(req.files[i].path).resize(380, 380).toFormat("jpeg").jpeg({ quality: 90 }).toFile('./static/hookah/thumbnail/thumbnail-' + Product_ID + '_' + i + '.jpeg')
                        sharp(req.files[i].path).resize(100).toFormat("jpeg").jpeg({ quality: 50 }).toFile('./static/hookah/thumbnail_table_icon/thumbnail_table_icon-' + Product_ID + '_' + i + '.jpeg')
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

myrouter.post('/Dashboard/EMP_ID_PAGE', checkAuthenticated, async (req, res) => {
    Product_ID = req.query.pid
    DeletePID = { PID: Product_ID }
    var myquery = { $and: [{ "Owner_Details.Owner_email": req.user.email }, { PID: Product_ID }] };
    productcode = await db.getDB().collection("productcodes").findOne(myquery)
        .then(async (productcode) => {
            if (productcode)
                productDelete = await db.getDB().collection("productcodes").deleteOne(DeletePID)
            else
                throw new Error("Whoops!");
        }).then(async () =>
            RatingDelete = await db.getDB().collection("userRating").deleteMany({ P_ID: Product_ID })
        )
        .then(async () =>
            T_counts = await db.getDB().collection("productcodes").countDocuments({ "Owner_Details.Owner_email": req.user.email })
        ).then(async (T_counts) => {
            var myquery = { email: req.user.email };
            var newvalues = { $set: { TotalProducts: T_counts } };
            update = await db.getDB().collection("EMPLOYEE_ID").updateOne(myquery, newvalues)

        })
        .then(async () => {
            cartDelete = await db.getDB().collection("userCart").deleteMany(DeletePID)

        })
        .catch(err =>
            console.log(err)

        )
        .finally(done => res.send("done"))
});
module.exports = myrouter;