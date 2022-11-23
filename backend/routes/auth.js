require('dotenv').config();
const router = require('express').Router();
const User = require('../models/userModel');
const google = require('googleapis').google;
const passport = require('passport');

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

router.post('/google', async (req,res) => {
    try {
        var OAuth2 = google.auth.OAuth2;
        console.log(req.session.user);
        var oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            ""
        );
        const { tokens } = await oauth2Client.getToken(req.body.serverAuthCode);
        oauth2Client.setCredentials({access_token: tokens.access_token});
        var oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        const temp = await oauth2.userinfo.get();
        const userInfo = temp.data;
        const username = userInfo.email;
        const googleId = userInfo.id;

        const user = await User.findOrCreate({ username: username, googleId: googleId });

        req.session.user = {
            _id: user.doc._id,
            username: user.doc.username,
            googleId: user.doc.googleId,
        };
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
    User.register({username: req.body.username}, req.body.password, (err, user) => {
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

    req.login(user, (err) => {
        if (err) {
            console.log(err);
            res.send({
                statusCode: 403,
            });
        } else {
            passport.authenticate('local')(req, res, () => {
                req.session.user = {
                    _id: req.session.passport.user,
                }
                res.send({
                    statusCode: 200,
                });
            });
        }
    })
});

module.exports = router;