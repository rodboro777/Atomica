require('dotenv').config();

const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const cors = require('cors');
const CLIENT_URL = "http://127.0.0.1:5500";

// routes
const authRoutes = require('./routes/auth');
const itineraryRoutes = require('./routes/itinerary');
const travelGuideRoutes = require('./routes/travelGuide');
const userRoutes = require('./routes/user');

const app = express();

// parse data with Content-Type: application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(session({
    secret: "535510n53cr3t",
    cookie: {
        sameSite: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

// setup mongodb atlas connection.
mongoose.connect(`mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.rnzvs8z.mongodb.net/guidifyDB`, {useNewUrlParser: true, useUnifiedTopology: true});

// defaulting to port 5000 if not set in local .env file.
const port = process.env.PORT || 5000;

app.use('/auth', authRoutes);
app.use('/itinerary', itineraryRoutes);
app.use('/travelGuide', travelGuideRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
    console.log(`Server has started at ${port}`);
});
