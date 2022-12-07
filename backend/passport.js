const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const secret = process.env.secret;

const db = require('./mongoBase/db.js');
const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
}
db.connect((err) => {
    if (err) {
        console.log('heyyyy, unable to connect to database');
        process.exit(1);
    }
});
// authorization 
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secret
}, (payload, done) => {
    // User.findById({_id : payload.sub},(err,user)=>{
    db.getDB().collection("users").findOne({ _id: db.getPrimaryKey(payload.sub) }, (err, user) => {
        if (err)
            return done(err, false);
        if (user)
            return done(null, user);
        else
            return done(null, false);
    });
}));

// authenticated local strategy using username and password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd'
}, (email, password, done) => {
    email = email.toLowerCase();

    db.getDB().collection("users").findOne({ email: email }, (err, user) => {
        // something went wrong with database
        if (err)
            return done(err);
        // if no user exist
        if (!user) {
            return done(null, false);

        }
        // check if password is correct
        bcrypt.compare(password, user.pwd, (err, match) => {
            if (err) {
                return done(null, false);
            }
            if (!match) {
                return done(null, false, { message: "Password Doesn't Match" });
            }
            if (match) {
                return done(null, user);
            }
        });

    });
}));