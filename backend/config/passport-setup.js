require('dotenv').config();
const passport = require('passport');
const User = require('../db/models/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: AUTH_REDIRECT_URL + '/auth/google/guidify',
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
        },
        (accessToken, refreshToken, profile, cb) => {
            User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, (err, user) => {
                return cb(err, user);
            });
        }
    )
)
