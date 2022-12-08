var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const db = require('./mongoBase/db.js');
require('dotenv').config()

const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    // passport.use(new FacebookStrategy({
    //     clientID: process.env.CLIENT_ID_FB,
    //     clientSecret: process.env.CLIENT_SECRET_FB,
    //     callbackURL: "http://192.168.0.103:5000/auth/fb/secrets"
    // },
    //     function (accessToken, refreshToken, profile, cb) {
    //         db.getDB().collection("users").findOne({ facebookId: profile.id }, function (err, user) {
    //             if (user)
    //                 return cb(err, user);
    //             else {
    //                 db.getDB().collection("users").insertOne({ facebookId: profile.id }, function (err, user) {

    //                     return cb(err, user);

    //                 })
    //             }
    //         });
    //     }
    // ));

    passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
        email = email.toLowerCase();
        db.getDB().collection("users").findOne({ email: email }, (err, data) => {
            if (err) throw err;
            if (!data) {
                return done(null, false, { message: "User Doesn't Exists.." });
            }
            bcrypt.compare(password, data.password, (err, match) => {
                if (err) {
                    return done(null, false);
                }
                if (!match) {
                    return done(null, false, { message: "Password Doesn't Match" });
                }
                if (match) {
                    return done(null, data);
                }
            });
        });
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (id, cb) {
        cb(null, id);
    });
}
    // ---------------
    // end of autentication statregy