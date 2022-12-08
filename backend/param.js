const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 5000;
const bodyparser = require('body-parser')
var nodemailer = require('nodemailer');
var HOME = require('./models/HOME/HOME.js');
var ProductHome = require('./models/HOME/ProductHome.js');
var Bumper = require('./models/HOME/Bumper.js');
var Shoppers = require('./models/ShopperSec/Shoppers.js');
var BackService = require('./models/BackServices/BackService.js');
var PromoService = require('./models/BackServices/PromoService.js');
var ShopIDService = require('./models/BackServices/ShopIDService.js');
var ProductService = require('./models/ShopperSec/ProductService.js');
const routes = require('./models/routes');
const db = require('./models/mongoBase/db.js');
const sharp = require('sharp')

var session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
require('./models/passport')(passport);
const fileUploadCtrl = require('./models/FileUp.js').Emp_Address_Upload;
const profile_photo = require('./models/FileUp.js').P_P_Upload;
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "prernagarg0509@gmail.com",
        pass: '9650199842p'
    }
});
// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded());
// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

// ENDPOINTS


const cookieParser = require('cookie-parser');
const { rejects } = require("assert");
const { request } = require("http");
routes.use(cookieParser('secret'));
routes.use(session({
    secret: 'secret',
    secure: true,
    maxAge: 3600000,
    resave: false,
    saveUninitialized: false,
}));


// using passport for authentications 
routes.use(passport.initialize());
routes.use(passport.session());
// using flash for flash messages 
routes.use(flash());


// MIDDLEWARES
// Global variable

const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
        // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    } else {
        res.redirect('/login');
    }
}
app.use('/', HOME);
app.use('/', Shoppers);
app.use('/', BackService);
app.use('/', PromoService);
app.use('/', ShopIDService);
app.use('/', ProductService);
app.use('/', ProductHome);
app.use('/', Bumper);
app.get('/register', routes);
app.get('/forEmpPage', routes);
app.post('/register', routes);
app.get('/login', routes);
app.post('/login', routes);
app.get('/success', routes);
app.get('/logout', routes);
app.post('/addmsg', routes);

app.get('/contact', (req, res) => {
    res.status(200).render('contact.pug');
})

app.get('/aboutus', (req, res) => {
    res.status(200).render('aboutus.pug');
})
app.get('/product', (req, res) => {
    res.status(200).render('productpage.pug');
})


app.get('/Controlpanel', (req, res) => {
    res.status(200).render('ControlPanel.pug');
})
app.get('/AddPromo', (req, res) => {
    res.status(200).render('Promocode.pug');
})

app.get('/AddOffer', (req, res) => {

    res.status(200).render('Offer.pug');
    co
})

app.get('/Dashboard', async (req, res) => {
    var dateFrom = new Date("January 01, 2021 01:15:00");
    var dateTo = new Date();
    daterange = req.query.daterange;
    var ddmmyyyyFROM = `01/01/2021`;
    var ddmmyyyyTO = `${dateTo.getDate()}/0${dateTo.getMonth() + 1}/${dateTo.getFullYear()}`;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (daterange) {
        console.log(daterange)
        fromDate = parseInt(daterange.substr(0, 2));
        fromMonth = months[parseInt(daterange.substr(3, 2)) - 1];
        fromYear = parseInt(daterange.substr(6, 4));
        toDate = parseInt(daterange.substr(13, 2));
        toMonth = months[parseInt(daterange.substr(16, 2)) - 1];
        toYear = parseInt(daterange.substr(19, 4));
        dateFrom = new Date(`${fromMonth} ${fromDate}, ${fromYear}`);
        dateTo = new Date(`${toMonth} ${toDate}, ${toYear}`);
        ddmmyyyyFROM = daterange.substr(0, 10);
        ddmmyyyyTO = daterange.substr(12, 11);
    }
    var TotalRevenue = 0,
        Completed_Orders = 0,
        Order_left = 0,
        Cancel_Orders = 0,
        OnWay_Orders = 0,
        Clients = 0,
        count1 = 0,
        count2 = 0,
        count3 = 0,
        count4 = 0,
        count5 = 0,
        Rating1 = 0,
        Rating2 = 0,
        Rating3 = 0,
        Rating4 = 0,
        Rating5 = 0;
    if (req.isAuthenticated()) {
        email = req.user.email
        OrderID_revenues = await db.getDB().collection("OrderID").aggregate([{ $unwind: '$Owner_Details' }, { $match: { "date_od": { $gte: dateFrom, $lte: dateTo }, 'Owner_Details.Owner_email': email } }, { $group: { _id: "$Status", count: { $sum: 1 }, "TotalRev": { $sum: "$price_quantity" } } }, { $sort: { Status: 1 } }]).toArray()
            .then(async OrderID_revenues => {

                OrderID_revenues.forEach(item => {
                    id = item._id
                    if (id == "Cancel") {
                        Cancel_Orders = item.count
                    } else if (id == "pending") {
                        Order_left = item.count
                    } else if (id == "DONE") {
                        TotalRevenue = item.TotalRev;
                        Completed_Orders = item.count
                    } else if (id == "OnWay") {
                        OnWay_Orders = item.count
                    }
                });
                total_orders = Cancel_Orders + Order_left + Completed_Orders + OnWay_Orders;
                Orders_clients = await db.getDB().collection("OrderID").aggregate([{ $unwind: '$Owner_Details' }, { $match: { "date_od": { $gte: dateFrom, $lte: dateTo }, 'Owner_Details.Owner_email': email } }, { $group: { _id: "$email", count: { $sum: 1 } } }, { $sort: { Status: 1 } }, { $count: "email" }]).toArray()
                if (Orders_clients && Orders_clients.length > 0) {
                    Clients = Orders_clients[0].email;
                } else {
                    Clients = 0;
                }

            })
            .then(async () => {

                userRating = await db.getDB().collection("userRating").aggregate([{ $unwind: '$Owner_email' }, { $match: { "Owner_email": email } }, { $group: { _id: "$Rating", count: { $sum: 1 }, "Rating": { $sum: "$Rating" } } }]).toArray()

                userRating.forEach(item => {
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
                });
                RatingCounts = count5 + count1 + count2 + count3 + count4;
                SumOfRatings = Rating1 + Rating2 + Rating3 + Rating4 + Rating5;
                finalrate = ((SumOfRatings / RatingCounts) / 5);
                total_left = Order_left + OnWay_Orders;
                total_left2 = total_left + Cancel_Orders;
                RSO = Completed_Orders / (total_orders);
                total_score = (((RSO + finalrate) / 2) * 100);

            }

            )
            .then(async () => {
                myquery = {
                    email: email
                }
                newvalues = {
                    $set: {
                        CancelProducts: Cancel_Orders,
                        DoneProducts: Cancel_Orders,
                        PendingProducts: Order_left
                    }
                }
                update = await db.getDB().collection("EMPLOYEE_ID").updateOne(myquery, newvalues)
                productcount = await db.getDB().collection("productcodes").aggregate([{ $unwind: '$Owner_Details' }, { $match: { "date_up": { $gte: dateFrom, $lte: dateTo }, 'Owner_Details.Owner_email': email } }, { $group: { _id: "$PID", count: { $sum: 1 } } }, { $sort: { Status: 1 } }, { $count: "PID" }]).toArray();
                if (productcount && productcount.length > 0)
                    productcount = productcount[0].PID
                else
                    productcount = 0
                recentOrders = await db.getDB().collection("OrderID").find({ $and: [{ "Owner_Details.Owner_email": email }, { Status: "pending" }] }).limit(5).toArray()
            })
            .then(doc => {
                res.status(200).render('dashboard/Dashboard_next.pug', { "Order_left": total_left, "Completed_Orders": Completed_Orders, "Cancel_Orders": Cancel_Orders, "TotalRevenue": TotalRevenue, "Clients": Clients, "total_score": total_score, "total_orders": total_orders, "recentOrders": recentOrders, "productcount": productcount, "ddmmyyyyFROM": ddmmyyyyFROM, "ddmmyyyyTO": ddmmyyyyTO });
            })
            .catch(err => {
                console.error(err)
            })
    } else {
        res.redirect('/login');
    }
})

app.get('/Dashboard/profile', checkAuthenticated, (req, res) => {
    params = { user_details: req.user }
    res.status(200).render('dashboard/Profile.pug', params);
})
app.get('/reg-dashboard/userOrders', checkAuthenticated, async (req, res) => {
    user_email = req.user.email;
    skip2 = 0;
    limit = 10;
    next = parseInt(req.query.page);
    if (next >= 2) {
        skip2 = limit * (next - 1);
        next = next + 1;
        previous = next - 2;
    } else {
        next = 2;
        previous = '/';
    }
    user_Orders = await db.getDB().collection("OrderID").aggregate([{ $lookup: { from: 'productcodes', localField: "P_ID", foreignField: "PID", as: 'Product' } }, { $unwind: "$Product" }, { $match: { email: user_email } },{$skip:skip2},{$limit:limit}]).toArray()
    .then(user_Orders => {

        params = { "user_Orders": user_Orders,"back":previous,"next":next,"color_orders":"#007bff" }
        if (user_Orders && user_Orders.length > 0) {
            res.status(200).render('regular_user/userOrders.pug', params);
        }
        else
            res.status(200).render('regular_user/blank_result.pug',params);

    })
        .catch(err => console.log(err))
})
app.get('/reg-dashboard/userAccount', checkAuthenticated, async (req, res) => {
    user_email = req.user.email;
    
    users_check = await db.getDB().collection("users").findOne({ email: user_email })
        .then(users_check => {
            params = { "user_Orders": user_Orders,"color_account":"#007bff" }
            if (users_check) {
                res.status(200).render('regular_user/userAccount.pug', params);
            }
        })
        .catch(err => console.log(err))
})
app.get('/reg-dashboard/Reviews', checkAuthenticated, async (req, res) => {
    skip2 = 0;
    limit = 20;
    next = parseInt(req.query.page);

    if (next >= 2) {
        skip2 = limit * (next - 1);
        next = next + 1;
        previous = next - 2;
    } else {
        next = 2;
        previous = '/';
    }
    user_email = req.user.email;
    user_Rating = await db.getDB().collection("userRating").aggregate([{ $lookup: { from: 'productcodes', localField: "P_ID", foreignField: "PID", as: 'Product' } }, { $unwind: "$Product" }, { $match: { email: user_email } },{ $skip : skip2 },{$limit:limit}]).toArray()
        .then(user_Rating => {
            params = { "user_Rating": user_Rating,"back":previous,"next":next,"color_rev":"#007bff" }
            if (user_Rating && user_Rating.length > 0) {
                res.status(200).render('regular_user/userReview.pug', params);
            }
            else
                res.status(200).render('regular_user/blank_result.pug',params);
                
        })
        .catch(err => console.log(err))
})

app.get('/Dashboard/YourShop', async (req, res) => {
    if (req.isAuthenticated()) {
        EMPLOYEE_ID = await db.getDB().collection("EMPLOYEE_ID").findOne({ email: req.user.email })
            .then(async data => {
                if (data) {
                    if (data.emp_request == "NOT_ACCEPTED") {
                        res.status(200).render('dashboard/underReview.pug', { 'result': `Application is Submitted`, "result2": "We  will notify you via mail" });
                    } else if (data.emp_request == "ACCEPTED") {
                        res.redirect('/Dashboard/EMP_ID_PAGE')
                    } else {
                        res.status(200).render('dashboard/Yourshop.pug');
                    }
                } else {
                    res.status(200).render('dashboard/Yourshop.pug');
                }
            })

    } else {
        res.redirect('/login');
    }

});

app.post('/Dashboard/Yourshop', async (req, res) => {
    if (req.isAuthenticated()) {
        var token;
        username = req.user.username;
        fileUploadCtrl(req, res, async function (err) {
            if (err) {
                res.send(err)
            } else {
                var { Shop_name, shop_address, shop_city, shop_state, shop_pincode, agree } = req.body;
                if (!Shop_name || !shop_address || !shop_city || !shop_state || !shop_pincode || !agree) {
                    err = "Please Fill All The Fields...";
                    res.render('dashboard/Yourshop.pug', { 'err': err });
                } else {
                    // console.log("hello")
                    phone = req.user.phone
                    agree = "AGREED"
                    email = req.user.email
                    EMPID = Date.now();
                    emp_request = "NOT_ACCEPTED"
                    user = await db.getDB().collection("users").findOne({ email: req.user.email })
                        .then(async user => {
                            if (!user) {
                                throw new Error("no user");
                            } else {
                                token = jwt.sign({ Shop_name, email, shop_address, shop_city, shop_state, shop_pincode, agree, EMPID, username }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' });
                                console.log(token)
                                Employee = await db.getDB().collection("EMPLOYEE_ID").findOne({ email: req.user.email })
                                return Employee
                            }
                        })
                        .then(async Employee => {
                            if (Employee) {
                                throw new Error("no user");
                            } else {
                                var mailOptions = {
                                    from: "prernagarg0509@gmail.com",
                                    to: email,
                                    subject: "Account Activation",
                                    html: `<H1>Welcome To Hookah Club</H1><P>Click on the link to verify email id</P><p><a href="http://192.168.0.103:5000/EmployeeAcoountVerification/${token}">Click Here to verify</a>`
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        return (error);
                                    } else {
                                        console.log("Link sent")
                                    };
                                });
                                fs.rename(req.file.path, './static/addressProof/' + EMPID + '.jpg', (err) => {
                                    console.log(err);
                                })
                                res.status(200).render("dashboard/underReview.pug", { 'result2': `Vefification Link is send to your ${email}`, "result": "Verification" })
                            }
                        })
                        .catch(err => console.log(err))
                }
            }
        })
    } else {
        res.redirect('/login');
    }
});
app.get('/EmployeeAcoountVerification/:id', async (req, res) => {
    Emp_date = new Date();
    const token = req.params.id;
    if (token) {
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, async function (err, decodedToken) {
            if (err) {
                // throw new Error("not verified");
                console.log(err)
            } else {
                const { Shop_name, email, shop_address, shop_city, shop_state, shop_pincode, EMPID, username } = decodedToken;
                agree = "AGREED"
                emp_request = "NOT_ACCEPTED"
                user = await db.getDB().collection("users").findOne({ email: email })
                    .then(async user => {
                        if (!user) {
                            throw new Error("not Employee");
                        } else {
                            phone = user.phone;
                            Employee = await db.getDB().collection("EMPLOYEE_ID").findOne({ email: email })
                            return Employee;
                        }
                    })
                    .then(async Employee => {
                        if (Employee) {
                            throw new Error("Already Employee");
                        } else {
                            Employee_insert = await db.getDB().collection("EMPLOYEE_ID").insertOne({
                                email: email,
                                username: username,
                                Shop_name: Shop_name,
                                shop_address: shop_address,
                                shop_state: shop_state,
                                shop_city: shop_city,
                                shop_pincode: shop_pincode,
                                agree: agree,
                                phone: phone,
                                EMPID: EMPID,
                                emp_request: emp_request,
                                total_revenue: 0,
                                Emp_date: Emp_date,
                                TotalProducts: 0,
                                CancelProducts: 0,
                                DoneProducts: 0,
                                PendingProducts: 0
                            })
                            res.status(200).render('dashboard/underReview.pug', { 'result2': `Wait for Confirmation, we will notify You soon`, "result": "Email Verified" });
                        }
                    })
                    .catch(err => console.log(err))
            }
        });
    } else {
        res.status(404).render('errorpage.pug')

    }
});

app.post('/dashboard/editprofile', checkAuthenticated, async (req, res) => {
    // profile_photo
    email = req.user.email;
    uniqueID = req.user.uniqueID;
    profile_photo(req, res, async function (err) {
        if (err) {
            res.send(err)
        } else {
            var { user_name, Address, State, City, PinCode, user_phone, youtube_url } = req.body;
            user = await db.getDB().collection("users").findOne({ email: email })
                .then(async user => {
                    if (user) {
                        if (req.file)
                            sharp(req.file.path, { failOnError: false }).resize(90, 90).toFormat("jpeg").jpeg({ quality: 100 }).toFile('./static/profile_photo/' + uniqueID + ".jpeg")
                        user_update = await db.getDB().collection("users").updateOne({ email: email }, {
                            $set: {
                                username: user_name, phone: user_phone, Address: Address, State: State, City: City, pincode: PinCode, phone: user_phone, youtube_url: youtube_url
                            }
                        })
                        res.redirect("/dashboard/profile")
                    }
                    else { throw new Error("#") }
                }).catch(err => console.log(err))
        }
    })



})


app.get('/StartService', (req, res) => {

    res.status(200).render('StartService.pug');
})

app.use((req, res, next) => {
    res.status(404).render("errorpage.pug")

});
db.connect((err) => {
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    }
    else {
        app.listen(port, '0.0.0.0', () => {
            console.log(`connected to database, app listening on port ${port}`);
        });
    }
});