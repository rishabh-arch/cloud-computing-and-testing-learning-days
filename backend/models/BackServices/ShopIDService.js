var express = require('express');
var myrouter = express.Router();

const path = require("path");
const fs = require("fs");
const app = express();
const port = 80;
const bodyparser = require('body-parser')
var nodemailer = require('nodemailer');
var domain = require("domain").create();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//TO INSERT DATA IN MONGODB

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded());
// app.use(fileUpload());

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory


myrouter.get('/NewIDGenerate', (req, res) => {
    res.status(200).render('NewID.pug');
})
myrouter.get('/admin/Dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            res.status(200).render('admin_dashboard/ad_Dashome.pug')
        }
        else {
            res.status(404).render("errorpage.pug")

        }
        // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    } else {
        res.redirect('/login');
    }

})
myrouter.get('/admin/Dashboard/UpdateSlides', (req, res) => {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            res.status(200).render('admin_dashboard/ad_Bumper.pug')
        }
        else {
            res.status(404).render("errorpage.pug")

        }
        // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    } else {
        res.redirect('/login');
    }

})
myrouter.get('/admin/Dashboard/AddNewMember', (req, res) => {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            res.status(200).render('admin_dashboard/ad_register.pug')
        }
        else {
            res.redirect("/dashboard");
        }
    } else {
        res.redirect('/login');
    }

})
myrouter.get('/admin/Request', (req, response) => {
    if (req.isAuthenticated()) {
        admin_request = req.query.load;
        do_result = req.query.do;
        req_emp = parseInt(req.query.with);
        usertype = req.user.Usertype
        if (usertype == "admin") {
            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("trial");
                try {
                    if (admin_request == "shoprequest" && do_result == "accept") {
                        myquery = { EMPID: req_emp }
                        newvalues = { $set: { emp_request: "ACCEPTED" } }
                        dbo.collection("EMPLOYEE_ID").updateOne(myquery, newvalues, function (err, res) {
                            if (err) throw err;
                            db.close();
                            response.redirect("/admin/Dashboard/Shoprequest")
                        });
                    } else if (admin_request == "shoprequest" && do_result == "reject") {
                        myquery = { EMPID: req_emp }
                        newvalues = { $set: { emp_request: "REJECTED" } }
                        dbo.collection("EMPLOYEE_ID").updateOne(myquery, newvalues, function (err, res) {
                            if (err) throw err;
                            db.close();
                            response.redirect("/admin/Dashboard/Shoprequest")
                        });
                    } else if (admin_request == "shoprecords" && do_result == "delete") {
                        myquery = { EMPID: req_emp }
                        myquery2 = { EMPLOYEE_ID: req_emp }
                        // dbo.collection("EMPLOYEE_ID").deleteOne(myquery, function (err, obj) {
                        //     if (err) throw err;
                        dbo.collection("productcodes").deleteMany(myquery2, function (err, obj) {
                            db.close();
                            response.redirect("/admin/Dashboard/Shoprecords")

                        // });


                        });
                    } else if (admin_request == "productrecords" && do_result == "delete") {
                        myquery = { PID: req_emp }
                        dbo.collection("productcodes").deleteOne(myquery, function (err, obj) {
                            if (err) throw err;
                            db.close();
                            response.redirect("/admin/Dashboard/ProductRecords")

                        });
                    }
                     else if (admin_request == "ordersrecords" && do_result == "delete") {
                        myquery = { OID: req_emp }
                        dbo.collection("OrderID").deleteOne(myquery, function (err, obj) {
                            if (err) throw err;
                            db.close();
                            response.redirect("/admin/Dashboard/OrdersRecords")

                        });
                    }

                } catch (err) {
                    res.status(404).render("errorpage.pug")

                }

            });
        }
        else {
            res.status(404).render("errorpage.pug")
        }

    } else {
        response.redirect('/login');
    }

})
myrouter.get('/admin/Dashboard/AddPromocode', (req, res) => {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            email = req.user.email;
            skip2 = 0
            next = parseInt(req.query.page);
            if (next >= 2) {
                skip2 = 50 * (next - 1);
                console.log(next);
                console.log(skip2);
                next = next + 1;
                previous = next - 2;
            }
            else {
                next = 2;
                previous = '/';
                // skip2 = 50
                console.log(next);
                console.log(skip2);
            }

            // if (err) throw err;
            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("trial");
                dbo.collection("OrderID").find().sort({ Status: -1 }).limit(50).skip(skip2).toArray(function (err, result) {
                    if (result != "") {
                        if (err) throw err
                        const params = { 'newOBJ': result, 'next': next, 'back': previous }
                        res.status(200).render('admin_dashboard/Promocode.pug')
                    }
                    else {
                        res.status(200).render('dashboard/underReview.pug', { 'result': 'No Orders Right Now' });
                    }
                });
            });
        } else {
            res.redirect('/Dashboard')
        }
    } else {
        res.redirect('/login')
    }

})
myrouter.get('/admin/Dashboard/OrdersRecords', function (req, res) {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            email = req.user.email;
            skip2 = 0
            next = parseInt(req.query.page);
            if (next >= 2) {
                skip2 = 50 * (next - 1);
                console.log(next);
                console.log(skip2);
                next = next + 1;
                previous = next - 2;
            }
            else {
                next = 2;
                previous = '/';
                // skip2 = 50
                console.log(next);
                console.log(skip2);
            }

            // if (err) throw err;
            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("trial");
                dbo.collection("OrderID").find().sort({ Status: -1 }).limit(50).skip(skip2).toArray(function (err, result) {
                    if (result != "") {
                        if (err) throw err
                        const params = { 'newOBJ': result, 'next': next, 'back': previous }
                        res.status(200).render('admin_dashboard/ad_Table.pug', params);
                    }
                    else {
                        res.status(200).render('ad_dashboard/ad_underReview.pug', { 'result': 'No Orders Right Now' });
                    }
                });
            });
        } else {
            res.redirect('/Dashboard')
        }
    } else {
        res.redirect('/login')
    }
})
myrouter.get('/admin/Dashboard/ProductRecords', function (req, res) {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            email = req.user.email;
            skip2 = 0
            next = parseInt(req.query.page);
            if (next >= 2) {
                skip2 = 50 * (next - 1);
                console.log(next);
                console.log(skip2);
                next = next + 1;
                previous = next - 2;
            }
            else {
                next = 2;
                previous = '/';
                // skip2 = 50
                console.log(next);
                console.log(skip2);
            }

            // if (err) throw err;
            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("trial");
                dbo.collection("productcodes").find().sort({ _id: -1 }).limit(50).skip(skip2).toArray(function (err, result) {
                    if (result != "") {
                        if (err) throw err
                        const params = { 'newObj': result, 'next': next, 'back': previous }
                        res.status(200).render('admin_dashboard/ad_productrecords.pug', params);
                    }
                    else {
                        res.status(200).render('dashboard/underReview.pug', { 'result': 'No Orders Right Now' });
                    }
                });
            });
        } else {
            res.redirect('/Dashboard')
        }
    } else {
        res.redirect('/login')
    }
})
myrouter.get('/admin/Dashboard/AllMembers', function (req, res) {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            email = req.user.email;
            skip2 = 0
            next = parseInt(req.query.page);
            if (next >= 2) {
                skip2 = 50 * (next - 1);
                console.log(next);
                console.log(skip2);
                next = next + 1;
                previous = next - 2;
            }
            else {
                next = 2;
                previous = '/';
                // skip2 = 50
                console.log(next);
                console.log(skip2);
            }

            // if (err) throw err;
            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("trial");
                dbo.collection("users").find({ $or: [{ Usertype: "admin" }] }).sort({ _id: -1 }).limit(50).skip(skip2).toArray(function (err, result) {
                    if (result != "") {
                        console.log(result)
                        if (err) throw err
                        const params = { 'newObj': result, 'next': next, 'back': previous }
                        res.status(200).render('admin_dashboard/ad_productrecords.pug', params);
                    }
                    else {
                        res.status(200).render('dashboard/underReview.pug', { 'result': 'No Orders Right Now' });
                    }
                });
            });
        } else {
            res.redirect('/Dashboard')
        }
    } else {
        res.redirect('/login')
    }
})
myrouter.get('/admin/Dashboard/shopRequest', function (req, res) {
    if (req.isAuthenticated()) {
        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            email = req.user.email;
            skip2 = 0
            next = parseInt(req.query.page);
            if (next >= 2) {
                skip2 = 50 * (next - 1);
                console.log(next);
                console.log(skip2);
                next = next + 1;
                previous = next - 2;
            }
            else {
                next = 2;
                previous = '/';
                // skip2 = 50
                console.log(next);
                console.log(skip2);
            }

            // if (err) throw err;
            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("trial");
                dbo.collection("EMPLOYEE_ID").find({ emp_request: "NOT_ACCEPTED" }).sort({ _id: -1 }).limit(50).skip(skip2).toArray(function (err, result) {
                    if (result != "") {
                        if (err) throw err
                        const params = { 'newOBJ': result, 'next': next, 'back': previous }
                        res.status(200).render('admin_dashboard/ad_emprequest.pug', params);
                    }
                    else {
                        res.status(200).render('admin_dashboard/ad_underReview.pug', { 'result': 'No Request Right Now' });
                    }
                });
            });
        } else {
            res.redirect('/Dashboard')
        }
    } else {
        res.redirect('/login')
    }
})

myrouter.get('/admin/Dashboard/Shoprecords', (req, res) => {
    if (req.isAuthenticated()) {
        skip2 = 0
        next = parseInt(req.query.page);
        if (next >= 2) {
            skip2 = 50 * (next - 1);
            console.log(next);
            console.log(skip2);
            next = next + 1;
            previous = next - 2;
        }
        else {
            next = 2;
            previous = '/';
            // skip2 = 50
            console.log(next);
            console.log(skip2);
        }

        usertype = req.user.Usertype
        console.log(usertype)
        if (usertype == "admin") {
            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("trial");
                dbo.collection("EMPLOYEE_ID").find().sort({ emp_request: 1 }).limit(50).skip(skip2).toArray(function (err, result) {
                    if (result != "") {
                        if (err) throw err
                        const params = { 'newOBJ': result, 'next': next, 'back': previous }
                        res.status(200).render('admin_dashboard/ad_shoprecords.pug', params);
                    }
                    else {

                        res.status(200).render('admin_dashboard/ad_underReview.pug', { 'result': 'No Records Right Now' });
                    }
                });
            });
        }
        else {
            res.redirect("/dashboard");
        }
        // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    } else {
        res.redirect('/login');
    }

})


module.exports = myrouter;