require('dotenv').config();
const router = require('express').Router();
const User = require('../models/userModel');
const google = require('googleapis').google;
const passport = require('passport');
const UserManager = require('../db_managers/userManager');


router.post("/logout", (req, res) => {
    try {
        req.session.destroy();
        res.send({
            errorCode: 200,
        });
    } catch (error) {
        console.log(error);
        res.send({
            errorCode: 500,
        });
    }
});

router.post('/google', async (req, res) => {
    try {
        var OAuth2 = google.auth.OAuth2;
        console.log("USER INFO : " + req.session.user);
        var oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            ""
        );
        const { tokens } = await oauth2Client.getToken(req.body.serverAuthCode);
        oauth2Client.setCredentials({ access_token: tokens.access_token });
        var oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        const temp = await oauth2.userinfo.get();
        const userInfo = temp.data;
        const email = userInfo.email;
        const googleId = userInfo.id;

        let userData = await User.findOrCreate({ email: email, googleId: googleId });

        // Set username and full name if user is new.
        if (!userData.doc.username) {
            console.log(userData.doc._id);
            userData = await User.findByIdAndUpdate(userData.doc._id, {
                username: email.split("@")[0],
                firstName: userInfo.given_name,
                lastName: userInfo.family_name
            })
        } else {
            userData = userData.doc;
        }

        req.session.user = {
            _id: userData._id,
            email: userData.email,
            googleId: userData.googleId,
        };

        console.log(req.session.user);

        res.send({
            statusCode: 200,
        });
    } catch (error) {
        console.log(error);
        res.send({
            statusCode: 500,
        });
    }
});

// register using local authentication.
router.post("/register", (req, res) => {
    let tmp = req.body.fullName.split(" ");
    let firstName = tmp[0];
    let lastName = tmp.slice(1, tmp.length).join(" ");

    console.log('registering user' + req.body.phone)
    User.register({
        username: req.body.username,
        firstName: firstName,
        lastName: lastName,
        country: req.body.country,
        phone: req.body.phone,
    }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.send({
                statusCode: 500,
            });
        } else {
            passport.authenticate('local')(req, res, () => {
                req.session.user = {
                    _id: req.session.passport.user,
                }
                User.userInfo
                res.send({
                    statusCode: 200,
                });
            });
        }
    })
});

// login using local authentication.
router.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(user, async (err) => {
        if (err) {
            console.log(err);
            res.send({
                statusCode: 403,
            });
        } else {
            passport.authenticate('local')(req, res, async () => {
                req.session.user = {
                    _id: req.session.passport.user,
                }
                let phone = '';
                await UserManager.getInfoById(req.session.user._id).then((info) => {
                    phone = info.phone
                })
                console.log("user phone" + phone)
                res.send({
                    phone: phone,
                    statusCode: 200,
                });
            });
        }
    })
});

// check if user is currently logged in.
router.get("/isLoggedIn", (req, res) => {
    res.send({
        isLoggedIn: req.session.user ? true : false,
        userId: req.session.user ? req.session.user._id : undefined,
    });
});

module.exports = router;