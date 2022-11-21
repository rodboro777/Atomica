require('dotenv').config();

// libs.
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth');
const CLIENT_URL = 'http://localhost:3000';

const app = express();
const cors = require('cors');

// setup mongodb atlas connection.
mongoose.connect(`mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.rnzvs8z.mongodb.net/guidifyDB`, {useNewUrlParser: true, useUnifiedTopology: true});

// defaulting to port 5000 if not set in local .env file.
const port = process.env.PORT || 5000;

// parse data with Content-Type: application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "535510n53cr3t",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
      origin: CLIENT_URL,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    })
);

app.post('/something',(req,res) => {
    console.log(req.user);
});

app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server has started at ${port}`);
});
