var express = require('express');
var myrouter = express.Router();

const path = require("path");
const fs = require("fs");
const app = express();
const bodyparser = require('body-parser')
var domain = require("domain").create();
var session = require('express-session')
const flash = require('connect-flash');

const passport = require('passport');
require('../passport')(passport);

const db = require('../mongoBase/db.js');

//TO INSERT DATA IN MONGODB
// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded());
// app.use(fileUpload());

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

const { type } = require('os');


myrouter.get('/', async function (req, res) {
    if (req.isAuthenticated()) {
        username = req.user.username;
    } else {
        username = "";
    }
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
    productcodes = await db.getDB().collection("productcodes").find().sort({ _id: -1 }).skip(skip2).limit(50).toArray()
        .catch(err => console.log(err))

    Bumper = await db.getDB().collection("Bumper").find().sort({ address: 1 }).toArray()
        .catch(err => console.log(err))
    var Link1 = "",
        Link2 = "",
        Link3 = "",
        Link4 = "";
    // if (Bumper && Bumper[0].link && Bumper[1].link && Bumper[2].link && Bumper[3].link) {
    //     Link1 = Bumper[0].link;
    //     Link2 = Bumper[1].link;
    //     Link3 = Bumper[2].link;
    //     Link4 = Bumper[3].link;
    // }
    const params = { 'newOBJ': productcodes, 'next': next, 'back': previous, "Link1": Link1, "Link2": Link2, "Link3": Link3, "Link4": Link4,"page_title":"DotMatrix.com: Easy Shopping Everywhere" }
    res.status(200).render('homenew.pug', params);

})
myrouter.get('/checkkk', async function (req, res) {

res.send(req.user);
})
myrouter.get('/Accessories', async function (req, res) {

    var { Categories, types, filter, sort } = req.query
    if (sort == "Rating")
        filterSort = { Rating: parseInt(filter) }
    else if (sort == "Oprice")
        filterSort = { Oprice: parseInt(filter) }
    else if (sort == "TotalOrders")
        filterSort = { TotalOrders: parseInt(filter) }
    else
        filterSort = null;
    function mongoOR(choices, num) {
        var array;
        if (choices) {
            array = choices.split(",");//making an array of numbers
            array.pop()
        }
        if (typeof array != "undefined") {
            return cat_query = {
                $or: array.map(number => {
                    if (num == "Category")
                        return { Category: number }
                    else if (num == "types")
                        return { types: number }
                    else if (num == "Search")
                        return { Search: number }
                })
            }
        }
        else return null;
    }
    type_array = mongoOR(types, "types");
    Category_array = mongoOR(Categories, "Category");
    if (req.isAuthenticated()) {

        username = req.user.username;
    } else {
        username = "";
    }
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
    productcodes = await db.getDB().collection("productcodes").find(Category_array).sort(filterSort).skip(skip2).limit(50).toArray()
        .catch(err => console.log(err))

    const params = { 'newOBJ': productcodes,"page_title":"DotMatrix.com: Accessories" }
    res.status(200).render('Accessories.pug', params);

})

myrouter.get('/search', async (req, res) => {
    skip2 = 0
    next = parseInt(req.query.page);
    if (next >= 2) {
        skip2 = 50 * (next - 1);
        console.log(next);
        console.log(skip2);
        next = next + 1;
        previous = next - 2;
    } else {
        next = 2;
        previous = '/';
        // skip2 = 50
        console.log(next);
        console.log(skip2);
    }

    var regex = new RegExp(req.query.search, 'i')
    searchquery = { $or: [{ name: regex }, { tag: regex }, { colour: regex }, { name: regex }, { Category: regex }] }
    search_result = await db.getDB().collection("productcodes").find(searchquery).sort({ TotalOrders: -1 }).limit(50).skip(skip2).toArray()
        .then(async search_result => {
            const params = { 'newOBJ': search_result, 'next': next, 'back': previous,"page_title":"DotMatrix.com: search" }
            res.status(200).render('search.pug', params);
        })
        .catch(err => console.log(err))
})
myrouter.get('/market',async(req,res)=>{
    res.status(200).render('market.pug');
})
module.exports = myrouter;