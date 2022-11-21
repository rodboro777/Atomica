require('dotenv').config();

// libs.
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

// defaulting to port 5000 if not set in local .env file.
const port = process.env.PORT || 5000;

// parse data with Content-Type: application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// test route
app.post('/', (req,res) => {
    console.log(req.body);
    res.json({
        number: 69
    });
});

app.listen(port, () => {
    console.log(`Server has started at ${port}`);
});
