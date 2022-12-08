var express = require('express');
var fs = require('fs');
var bodyparser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const fileUploadCtrl = require('../FileUp.js').Slidesphoto;
var app = express();
var myrouter = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', [__dirname + '/views', __dirname + '/views2']); // Set the views directory

// app.use(bodyparser.json());
// Use body-parser to parse incoming data 
// parse application/json
app.use(bodyparser.json());


app.use(bodyparser.urlencoded({ extended: true }))
//parse multipart/form-data    
// app.use(bodyparser.json({ type: 'application/*+json' })) 
// app.use(busboyBodyParser());
myrouter.get('/BumperUpload', (req, res) => {
  res.render('Bumper.pug');
})

myrouter.post('/Dashboard/profile/changeprofile', (req, res) => {
  console.log("done")
  fileUploadCtrl(req, res, function (err) {
    if (err) {
      res.send(err)

    }
    else {
      fs.rename(req.file.path, './static/profile_cover/cover.jpg', (err) => {
        console.log(err);
      })
      res.send("done")
    }

    // console.log(req.body.Link)
  })
})
myrouter.post('/admin/DashBoard/BumperUpload/:id', (req, res) => {
  if (req.isAuthenticated()) {
    usertype = req.user.Usertype
    if (usertype == "admin") {
      id = req.params.id
      fileUploadCtrl(req, res, function (err) {
        if (err) {
          // res.send(err)
        }
        else {
          Link = req.body.Link
          MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            try {
              if (err) throw err;
              var dbo = db.db("trial");
              var myquery = { address: `SLIDE${id}` };
              var myobj = { $set: { link: Link, address: `SLIDE${id}` } };
              dbo.collection("Bumper").updateOne(myquery, myobj, { upsert: true }, function (err, result) {
                if (err) throw err;
                res.send("UPDATED")
                db.close();
              });
              if (req.file) {
                fs.rename(req.file.path, './static/Slides_photo/SLIDE' + id + '.jpg', (err) => {
                  if (err) {
                    console.log(err);
                  }
                })
              }
            } catch (err) {
              res.status(404).render("errorpage.pug");
            }
          });
        }
      })
    } else { res.status(404).render('errorpage.pug') }
  } else {
    res.redirect("/login")
  }
});
module.exports = myrouter;
