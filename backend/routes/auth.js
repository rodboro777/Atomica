const router = require('express').Router();
const passport = require('passport');
const CLIENT_URL = 'http://localhost:3000';

router.post('/eagle', (req, res) => {
    console.log('HELLOOO');
})

router.get("/google",
  passport.authenticate('google', { scope: ["profile", "email"] })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/google/guidify",
  passport.authenticate('google', { failureRedirect: '/auth/google'}),
  // Deep link to the mobile application.
  (req, res) => {
    res.redirect(
      `guidify://app/login?googleId=${req.user.googleId}/username=${req.user.username}`  
    );
  }
);

module.exports = router;