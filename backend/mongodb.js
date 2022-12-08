function mongoJson(){
const fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
const url = "mongodb://mongo:27017/docker-db"; // after
//mongodb connection url with admin password
// var url = "mongodb://admin:admin@localhost:27017/";

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("trial");

dbo.collection("productcodes").find().sort({ _id: -1 }).limit(50).toArray(function (err, result) {
        const data = JSON.stringify(result);
        fs.writeFileSync('./static/newCustomer.json', data);
    });
});

}
mongoJson();
module.exports = mongoJson;

db.productcodes.aggregate([{$lookup:{from:'OrderID',localField:'PID',foreignField:'P_ID',as:'book'}},{$unwind: "$book"},{$match:{'book.email':'rishabhgarg567@gmail.com'}}]).pretty() //JOIN

db.userRating.aggregate([{$unwind:'$P_ID'},{$match:{P_ID:"10005"}},{ $group:{ _id:"$P_ID",count:{$sum:1}, "Rating":{ $sum:"$Rating" } } }]);// group by sum

db.userRating.aggregate([{$unwind:'$P_ID'},{$match:{P_ID:"20001"}},{ $group:{ _id:"$Rating",count:{$sum:1}, "Rating":{ $sum:"$Rating" } } }]);

db.OrderID.aggregate([{$unwind:'$Owner_Details'},{$match:{'Owner_Details.Owner_email':"rishabhgargts@gmail.com",Status:"pending"}},{ $group:{ _id:"$Owner_Details.Owner_email",count:{$sum:1},"Rating":{ $sum:"$price_quantity" } } }]);

db.OrderID.aggregate([{$unwind:'$Owner_Details'},{$match:{'Owner_Details.Owner_email':"rishabhgargts@gmail.com"}},{ $group:{ _id:"$Status",count:{$sum:1},"Rating":{ $sum:"$price_quantity" } } },{$sort:{Status:1}}]);//PENDING+CANCEL+DONE

db.OrderID.aggregate([{$unwind:'$Owner_Details'},{$match:{'Owner_Details.Owner_email':"rishabhgargts@gmail.com"}},{ $group:{ _id:"$email",count:{$sum:1} } },{$sort:{Status:1}},{$count:"email"}]); // TOTAL CLIENTS

db.userRating.aggregate([{$unwind:'$Owner_email'},{$match:{Owner_email:"rishabhgargts@gmail.com"}},{ $group:{ _id:"$Rating",count:{$sum:1}, "Rating":{ $sum:"$Rating" } } }]); // TOTAL RATING company score

db.OrderID.aggregate([{$unwind:'$Owner_Details'},{$match:{"date_od":{$gte:new ISODate("2019-06-11T00:00:00.000Z")},'Owner_Details.Owner_email':"rishabhgarg2000@gmail.com"}},{ $group:{ _id:"$Status",count:{$sum:1},"Rating":{ $sum:"$price_quantity" } } },{$sort:{Status:1}}]);


var session = require('express-session')
const flash = require('connect-flash');
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
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}
