const router = require('express').Router();
const passport = require('passport');
const CLIENT_URL = 'http://localhost:3000';

router.get("/google",
  passport.authenticate('google', { scope: ["profile", "email"] })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/google/guidify",
  passport.authenticate('google', { failureRedirect: CLIENT_URL, successRedirect: CLIENT_URL })
);

module.exports = router;