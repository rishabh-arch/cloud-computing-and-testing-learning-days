const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const dotenv = require("dotenv");
const JWT = require('jsonwebtoken');
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const db = require('../mongoBase/db.js');
var validator = require('validator');
var nodemailer = require('nodemailer');
const transporter  = nodemailer.createTransport('smtps://prernagarg0509%40gmail.com:9650199842p@smtp.gmail.com');
const imageProcess = require('../Features/Multer');
dotenv.config({ path: '../config.env' });
const fs = require('fs');

const sharp = require('sharp');
const multer = require('multer');
const { verify } = require('crypto');

const storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        fsAccess('frontend/build/uploads/');
        cb(null, "frontend/build/uploads/") ;
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".jpg") 
    } 
  }) ;
const uploads = multer({ storage });
const secret = process.env.secret;
const signToken = userID => {
    return JWT.sign({
        iss: secret,
        sub: userID
    }, secret, { expiresIn: Date.now() + 99999999999 });
}
userRouter.use(bodyParser.json()); // <--- Here

userRouter.use(bodyParser.urlencoded({ extended: true }));
const fsAccess = (loc) => {
    fs.access(loc, (err) => {
        if (err)
            fs.mkdirSync(loc);
    })

}
const isValidPhone = (phoneNumber) => {
    const found = phoneNumber.search(/^(\+{1}\d{2,3}\s?[(]{1}\d{1,3}[)]{1}\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}$/);
    if (found > -1) {
        return true;
    }
    else {
        return false;
    }
}
userRouter.post('/userregistration', (req, res) => {
    const { first_name, last_name, email, State, City, pwd, cpwd, agree, contact } = req.body;
    if (!first_name || !last_name || !email || !State || !City || !pwd || !cpwd || !agree || !contact) {
        return res.status(500).json({ message: { msgBody: "please Fill all the Details", msgError: true } });
    }
    if (pwd.length < 10 || cpwd.length < 10)
        return res.status(500).json({ message: { msgBody: "password should contain minimum 10 digits", msgError: true } });

    if (pwd !== cpwd)
        return res.status(500).json({ message: { msgBody: "Password dont match", msgError: true } });

    db.getDB().collection("users").findOne({ email: email }, (err, user) => {
        const role = "user";
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        if (user)
            res.status(400).json({ message: { msgBody: "email is already taken", msgError: true } });
        else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw new Error("#");
                bcrypt.hash(pwd, salt, async (err, hash) => {
                    if (err) throw new Error("#");
                    const hash_pwd = hash;
                    users_insert = await db.getDB().collection("users").insertOne({
                        first_name, last_name, email, State, City, pwd: hash_pwd, role, contact
                    }).then(() => {
                        res.status(200).json({ message: { msgBody: "Account successfully created", msgError: false } });
                    }).catch(err => {
                        res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                    })

                });
            });
        }
    });
});

userRouter.post('/userLogin', passport.authenticate('local', { session: false }), (req, res) => {

    if (req.isAuthenticated()) {
        const { _id, email, role } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, { httpOnly: true, sameSite: true, expires: new Date(Date.now() + 99999999999) });
        res.status(200).json({ isAuthenticated: true, user: { email, role } });
    }



});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { email: "", role: "" }, success: true });
});



userRouter.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'admin') {
        res.status(200).json({ message: { msgBody: 'You are an admin', msgError: false } });
    }
    else
        res.status(403).json({ message: { msgBody: "You're not an admin,go away", msgError: true } });
});


userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { email, role } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { email, role } });
});

const nextInterceptor = error => {
    if (error) { throw error; }
};

const combineMiddlewares = middlewares => (req, res, next) => (
    middlewares.reduce((previousMiddleware, currentMiddleware) => (
        previousMiddleware.then(() => currentMiddleware(req, res, nextInterceptor))
    ), Promise.resolve())
        .then(() => next())
        .catch(next)
);
const passport_auth = passport.authenticate('jwt', { session: false });
// const upload_mid = upload_image.single("news_image");
const upload_mid = uploads.single('news_image');

//   const commonMiddlewares = combineMiddlewares([getDeviceLocation, getDeviceClient]);

userRouter.post('/Postnews', [passport_auth, upload_mid], async (req, res) => {
    const { news_title, news_box, news_hash } = req.body;
    if (req.user.role === 'admin')
        return res.status(406).json({ error: "Admin Cant Post!" })

    const createID = Date.now();

    if (!req.user || !news_title || !news_box)
        return res.status(406).json({ error: "please Fill all Boxes!" })
    else {
        const user_verify = await db.getDB().collection("users").findOne({ email: req.user.email })
            .then(async user_verify => {
                if (user_verify) {
                    const countPosts = await db.getDB().collection('newsPost').countDocuments({
                        email: req.user.email
                    });
                    if (countPosts > 20)
                        res.status(401).json({ error: "Not more than 20" });
                    else {
                        const filename = await imageProcess(req);

                        await db.getDB().collection("newsPost").insertOne({ news_ID: createID, email: req.user.email, news_title, news_box, news_image: filename, news_hash: news_hash.split(",") })
                        res.status(200).json({ msg: "successfully post" });
                    }
                }
                else
                    throw new Error
            })
            .catch(err => res.status(401).json({ error: "May you left something" }))
    }
})

userRouter.get('/Postnews', async (req, res) => {
    const skipPages = parseInt(req.query.page);
    let Search_regex = new RegExp(req.query.ss, 'i');
    if (req.query.ss === typeof undefined)
        Search_regex = Search_regex = new RegExp("", 'i');

    let SkipItems = 1;
    if (skipPages > 1)
        SkipItems = skipPages * 20;
    else
        SkipItems = 0;
    const news_post = await db.getDB().collection("newsPost").find({ $or: [{ news_hash: Search_regex }, { news_title: Search_regex }, { news_image: Search_regex }] }).sort({ _id: -1 }).skip(SkipItems).limit(20).toArray()
    const itemCount = await db.getDB().collection("newsPost").estimatedDocumentCount();
    res.status(200).json({ news_post: news_post, itemCount: itemCount });
})

userRouter.post('/searchResource', async (req, res) => {
    const StateArray = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"]
    const { District_One, State_One, Resource_One } = req.body;
    let State_regex, District_regex, Resource_regex;
    State_regex = new RegExp(StateArray[State_One], 'i');
    District_regex = new RegExp(District_One, 'i');
    Resource_regex = new RegExp(Resource_One, 'i');

    const resourceTable = await db.getDB().collection("resourceTable").find({ Resource_One: Resource_regex, City: District_regex, State: State_regex }).sort({ _id: -1 }).limit(100).toArray();
    res.status(200).json({ resourceTable: resourceTable });
})


userRouter.post('/postResource', passport_auth, async (req, res) => {
    const { first_name, last_name, email, State, City, contact, role } = req.user;
    const { Address, Address_one, Resource_One } = req.body;
    if (role === 'admin')
        return res.status(406).json({ error: "Admin Cant Post!" });
    const createID = Date.now();
    if (Resource_One === "")
        return res.status(406).json({ error: "Fill Everything!" });
    var myquery = { email };
    var Addressobj = { $set: { Address } };
    var Address_oneobj = { $set: { Address_one } };

    const userAlreadyPosts = await db.getDB().collection("resourceTable").findOne({ email: email, Resource_One: Resource_One })
    if (userAlreadyPosts) {
        return res.status(406).json({ error: "Already Posted" });
    }
    const countUserPost = await db.getDB().collection("resourceTable").countDocuments({
        email: email
    });
    if (countUserPost > 6) {
        return res.status(406).json({ error: "You had Filled everything ALready!" });
    }

    if (Address !== "" && Address)
        await db.getDB().collection("usersAddress").updateOne(myquery, Addressobj, { upsert: true })
    if (Address_one !== "" && Address_one)
        await db.getDB().collection("usersAddress").updateOne(myquery, Address_oneobj, { upsert: true })
    const user_Address = await db.getDB().collection("usersAddress").findOne({ email: email })
        .then(async user_Address => {
            const user_verify = await db.getDB().collection("users").findOne({ email: email });
            if (user_verify) {
                const insertResource = await db.getDB().collection('resourceTable').insertOne({ Res_ID: createID, OrgName: `${first_name} ${last_name}`, email, State, City, contact, Resource_One, Address_one: user_Address.Address_one, Address: user_Address.Address, Resource_One })
            }
        })
        .then(() => res.status(200).json({ message: "Thanks For add Supplies" }))
        .catch(err => res.status(406).json({ error: "Something Wrong!" }))
})

userRouter.post('/userDetail', passport_auth, async (req, res) => {
    const { email, State, City, contact } = req.user;
    const auth_email = email;
    const body_email = req.body.email
    if (auth_email === body_email) {
        await db.getDB().collection("usersAddress").findOne({ email: body_email })
            .then(async userAddress => {
                if (userAddress)
                    res.status(200).json({ Address: userAddress.Address, Address_one: userAddress.Address_one, user_State: State, user_City: City, user_Contact: contact });
                else
                    res.status(200).json({ Address: "", Address_one: "", user_State: State, user_City: City, user_Contact: contact });
            })
            .catch(err => res.status(401).json({ error: "UnAuthorised Error" }))
    }
    else {
        res.status(401).json({ error: "UnAuthorised Error" });
    }
})
userRouter.post('/userNewsData', passport_auth, async (req, res) => {

    const { email } = req.user;
    const auth_email = email;
    const body_email = req.body.email
    if (auth_email === body_email) {
        await db.getDB().collection("newsPost").find({ email: body_email }).toArray()
            .then(async NewsData => {
                res.status(200).json({ NewsData: NewsData });
            })
            .catch(err => res.status(401).json({ error: "UnAuthorised Error" }))
    }
    else {
        res.status(401).json({ error: "UnAuthorised Error" });
    }
})


userRouter.post('/DeleteuserNewsData', passport_auth, async (req, res) => {
    const { email } = req.user;
    const auth_email = email;
    const body_email = req.body.user.email;
    const SelectedInp = req.body.SelectedInp.map(Number);

    if (auth_email === body_email) {
        await db.getDB().collection("users").findOne({ email: body_email })
            .then(async user => {
                if (user) {
                    const Result = await db.getDB().collection("newsPost").find({ "news_ID": { $in: [...SelectedInp] } }).toArray()
                    const deleteResult = await db.getDB().collection("newsPost").deleteMany({ "news_ID": { $in: [...SelectedInp] } })
                    if (deleteResult && Result.length > 0) {
                        const NewsData = await db.getDB().collection("newsPost").find({ email: body_email }).toArray();
                        Result.forEach((image, i) => {
                                try{
                            fs.unlink(`frontend/build/uploads/${image.news_image}`);
                            fs.unlink(`frontend/build/uploads/thumbnail/${image.news_image}`);
                                }catch(err){
                                    res.status(401).json({ error: err });
                                }

                        });

                        return res.status(200).json({ NewsData: NewsData, Message: "Deleted" });
                    }
                    else
                        return res.status(401).json({ error: "No Data Error" })
                }
            })
        .catch(err => res.status(401).json({ error: err }))
    }
    else {
        return res.status(401).json({ error: "UnAuthorised Error" });
    }
})
userRouter.post('/userResourceData', passport_auth, async (req, res) => {

    const { email } = req.user;
    const auth_email = email;
    const body_email = req.body.email
    if (auth_email === body_email) {
        await db.getDB().collection("resourceTable").find({ email: body_email }).toArray()
            .then(async NewsData => {
                res.status(200).json({ NewsData: NewsData });
            })
            .catch(err => res.status(401).json({ error: "UnAuthorised Error" }))
    }
    else {
        res.status(401).json({ error: "UnAuthorised Error" });
    }
})
userRouter.post('/DeleteuserResourceData', passport_auth, async (req, res) => {
    const { email } = req.user;
    const auth_email = email;
    const body_email = req.body.user.email;
    const SelectedInp = req.body.SelectedInp.map(Number);

    if (auth_email === body_email) {
        await db.getDB().collection("users").findOne({ email: body_email })
            .then(async user => {
                if (user) {

                    const deleteResult = await db.getDB().collection("resourceTable").deleteMany({ "Res_ID": { $in: [...SelectedInp] } })
                    if (deleteResult) {
                        const NewsData = await db.getDB().collection("resourceTable").find({ email: body_email }).toArray();
                        res.status(200).json({ NewsData: NewsData, Message: "Deleted" });
                    }
                    else
                        return res.status(401).json({ error: "No Data Error" })
                }
            })
            .catch(err => res.status(401).json({ error: "No Data Error" }))
    }
    else {
        res.status(401).json({ error: "UnAuthorised Error" });
    }
})

userRouter.get('/inputSearch', async (req, res) => {

    Search_regex = new RegExp(req.query.input, 'i');

    const fromNews = await db.getDB().collection("newsPost").countDocuments({ $or: [{ news_hash: Search_regex }, { news_title: Search_regex }, { news_image: Search_regex }] });

    const fromResource = await db.getDB().collection("resourceTable").find({ $or: [{ Resource_One: Search_regex }, { State: Search_regex }, { City: Search_regex }, { Address: Search_regex }] }).toArray();

    res.status(200).json({ fromNews: fromNews, fromResource: fromResource });



})
userRouter.get('/hello', async (req, res) => {
   const userid = await db.getDB().collection("users").find({}).toArray();
    // res.status(200).json({ userid: userid });
// console.log(userid);
    res.send(userid);


})
userRouter.post('/admin_Control', passport_auth, async (req, res) => {
    const action = req.query.action;
    const Admin_email = req.body.user.email;
    const Admin_role = req.body.user.role;
    const Auth_Admin_email = req.user.email;
    const Auth_Admin_role = req.user.role;
    const reference = req.body.reference;
    if (Admin_email === Auth_Admin_email && Admin_role === Auth_Admin_role && Admin_role === 'admin') {
        await db.getDB().collection("users").findOne({ email: Admin_email, role: 'admin' })
            .then(async verifyUser => {
                if (verifyUser) {
                    if (action === '100')
                        await db.getDB().collection("resourceTable").deleteOne({ Res_ID: reference })

                    else if (action === '200') {
                        const Result = await db.getDB().collection('newsPost').find({ news_ID: reference }).toArray();
                       const deleteResult = await db.getDB().collection("newsPost").deleteOne({ news_ID: reference });
                        if (Result.length > 0) {
                            Result.forEach((image, i) => {
                                fs.unlink(`frontend/build/uploads/${image.news_image}`, err => {

                                    if (err) throw err;
                                });
                                fs.unlink(`frontend/build/uploads/thumbnail/${image.news_image}`, err => {

                                    if (err) throw err;
                                });
                            });
                        }
                    }
                    else if (action === '300') {
                        const Result = await db.getDB().collection('newsPost').find({ email: reference }).toArray();
                        await db.getDB().collection("users").deleteOne({ email: reference })
                        await db.getDB().collection("usersAddress").deleteOne({ email: reference })
                        await db.getDB().collection("resourceTable").deleteMany({ email: reference })
                        await db.getDB().collection("newsPost").deleteMany({ email: reference })
                        if (Result.length > 0) {
                            Result.forEach((image, i) => {
                                fs.unlink(`frontend/build/uploads/${image.news_image}`, err => {
                                    if (err) throw err;
                                });
                                fs.unlink(`frontend/build/uploads/thumbnail/${image.news_image}`, err => {

                                    if (err) throw err;
                                });
                            });
                        }
                    }
                    else
                        throw new Error
                }
            })
            .then(async deleteRes =>
                res.status(200).json({ msg: "done" })
            )
            .catch(err => res.status(401).json({ msg: "something Wrong" }))
    }
})
userRouter.post('/personQuery', async (req, res) => {
    const { Con_name, Con_email, Con_phone, Con_msg } = req.body;

    if (!Con_name || !Con_email || !Con_phone || !Con_msg)
        return res.status(401).json({ msg: "please fill all details" });
    validator.isEmail(Con_email);
    if (isValidPhone(Con_phone) && validator.isEmail(Con_email)) {
        var mailOptions = {
            from: "prernagarg0509@gmail.com",
            to: `${Con_email},rishabhgargts@gmail.com`,
            subject: "Query from Website",
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Contact Query</title>
            </head>
            
            <body>
                <div style="font-size: 20px; padding: 30px; background: url('https://www.homecaremag.com/sites/default/files/O2-oxygen-507182002-_0.jpg'); background-repeat: no-repeat; ">
                    <div style="font-weight: 900;">
                        ${Con_name}
                    </div>
            
                        <div> ${Con_email}
                        </div>
                        <div> ${Con_phone}
                        </div>
                        <div> <p>${Con_msg}</p>
                        </div>
            
            
                </div>
            </body>
            
            </html>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return (error);
            } else {
                
            };
        });
        return res.status(200).json({ msg: "Your Query is sent to us" });
    }
    else
        return res.status(401).json({ msg: "Check Email or Phone number" });


})

userRouter.post('/forgotUserPassword', async (req, res) => {
    user_email = req.body.email;
    userid = await db.getDB().collection("users").findOne({ email: user_email })
        .then(userid => {
            if (userid) {
                const token = JWT.sign({ user_email }, "SECRET", { expiresIn: '20m' });
                var mailOptions = {
                    from: "prernagarg0509@gmail.com",
                    to: user_email,
                    subject: "OXYGEN",
                    html: `<H1>Forgot Password</H1><P>Click on the link to change your password</P><p><a href="http://192.168.0.105:5000/NewPassword?token=${token}">Click Here to Proceed</a>`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return (error);
                    } else {
                        return res.status(200).json({ msg: "Check your email for password link" });
                    };
                });
            } else {
                throw new Error("This Email is not Registered");
            }
        })
        .catch(err =>
            res.status(401).json({ msg: err.message })

        )
});
userRouter.post('/NewUserPassword', async (req, res) => {
    const token = req.body.token;
    if (token && token.length > 10) {
        JWT.verify(token, "SECRET", async function (err, decodedToken) {
            if (err) {
                return res.status(401).json({ msg: "Link Not Verified or you reached the time limit 20 minutes" })
            } else {
                const { user_email } = decodedToken;
                userid = await db.getDB().collection("users").findOne({ email: user_email })
                    .then((userid) => {
                        if (userid) {
                            return res.status(200).json({ msg: "Link Verified" })
                        } else {
                            throw new Error("user not found");
                        }
                    })
                    .catch(err => res.status(401).json({ msg: err.message })
                    )
            }
        })
    } else {
        return res.status(401).json({ msg: "Link Not Verified or you reached the time limit 20 minutes" })
    }
});
userRouter.post('/NewUserPasswordVerified', async (req, res) => {
    const { token, user } = req.body;
    const { pwd, cpwd } = user;
    if (token) {
        JWT.verify(token, "SECRET", async function (err, decodedToken) {
            if (err) {
                return res.status(401).json({ msg: "Link Not Verified or you reached the time limit 20 minutes" });
            } else {
                if (!pwd || !cpwd) {
                    err = "Please Fill All The Fields...";
                    return res.status(401).json({ msg: err })
                } else if (pwd != cpwd) {
                    err = "Passwords Don't Match";
                    return res.status(401).json({ msg: err })
                } else {
                    const { user_email } = decodedToken;
                    users = await db.getDB().collection("users").findOne({ email: user_email })
                        .then(async (users) => {
                            if (!users) {
                                throw new Error("User Not Found");
                            } else {
                                salt = await bcrypt.genSalt(10)
                                return salt;
                            }
                        }).then(async salt => {
                            if (salt) {
                                hash = await bcrypt.hash(pwd, salt)
                                users_insert = await db.getDB().collection("users").updateOne({ email: user_email }, {
                                    $set: {
                                        pwd: hash
                                    }
                                })
                            }
                            else
                                throw new Error("Something Wrong!");
                        }).then(() => {
                            return res.status(200).json({ msg: "Password Changed" })
                        }).catch(err =>
                            res.status(401).json({ msg: err.message })
                        )
                }
            }
        })
    } else {
        return res.status(401).json({ msg: "Link not Found" })
    }
})

userRouter.post('/ChangeToNewPassword', passport_auth, async (req, res) => {
    var { opwd, pwd, cpwd } = req.body.newPwd;
    const user_email = req.user.email;
    const body_email = req.body.user.email;
    if (!opwd || !pwd || !pwd)
        return res.status(401).json({ msg: "Fill All The fields" })
    if (pwd.length < 10 || cpwd.length < 10)
        return res.status(401).json({ msg: "password should contain minimum 10 digits" })
    if (user_email !== body_email)
        return res.status(401).json({ msg: "Something Wrong!" })

    await db.getDB().collection("users").findOne({ email: user_email })
        .then(async userOldPass => {
            if (!userOldPass) {
                throw new Error("User Doesn't Exists..")
            }
            else {
                ConfirmOldPass = await bcrypt.compare(opwd, userOldPass.pwd)
                return ConfirmOldPass;
            }
        })
        .then(async ConfirmOldPass => {
            if (!ConfirmOldPass) {
                throw new Error("Incorrect old Password!");
            } else {
                salt = await bcrypt.genSalt(10)
                hash = await bcrypt.hash(pwd, salt)
                users_insert = await db.getDB().collection("users").updateOne({ email: user_email }, {
                    $set: {
                        pwd: hash
                    }
                })
                return res.status(200).json({ msg: "Password Changed" })
            }
        })
        .catch(err => {
            return res.status(401).json({ msg: err.message })
        })
});

module.exports = userRouter;