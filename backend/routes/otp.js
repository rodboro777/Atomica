const twilio = require('twilio');
const client = new twilio('AC0cb40d806a8c5e3da9123ffeba1a0863', '15da1fbd7562cee25bfd11070fa132e5');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://atomicheart:nSnKHuVcciD1zlQ8@cluster0.1ihsy2x.mongodb.net/atomica`, { useNewUrlParser: true, useUnifiedTopology: true });
const otpSchema = new mongoose.Schema({
    phoneNumber: String,
    code: String,
    expirationTime: Date
});
const OTP = mongoose.model('OTP', otpSchema);
const router = require('express').Router();


router.post("/authenticate", (req, res) => {
    if (sendOTPCode(req.body.phoneNumber)) {
        res.send({
            statusCode: 200,
            phoneNumber: req.body.phoneNumber,
        });
    }
    else {
        res.send({
            statusCode: 500,
        });
    }
});


router.post("/verify", async (req, res) => {
    await verifyOTPCode(req.body.phoneNumber, req.body.code).then((result) => {
        console.log(result);
        if (result) {
            res.send({
                statusCode: 200,
            });
        }
        else {
            res.send({
                statusCode: 500,
            });
        }
    });

})


function sendOTPCode(phoneNumber) {
    const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const message = `Your OTP code is: ${code}`;
    const expirationTime = new Date().getTime() + 300000; // Code expires in 5 minutes

    // Store the code in MongoDB and associate it with the user's phone number
    OTP.findOneAndUpdate({ phoneNumber }, { code, expirationTime }, { upsert: true, new: true }, (err, doc) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Stored OTP code ${code} for ${phoneNumber}`);
        }
    });

    // Send the code to the user's phone number using Twilio
    try {
        client.messages.create({
            body: message,
            to: phoneNumber,
            from: '+353868006565',
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
async function verifyOTPCode(phoneNumber, code) {
    const doc = await new Promise((resolve, reject) => {
        OTP.findOne({ phoneNumber }, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(doc);
            }
        });
    });

    if (!doc) {
        console.log(`No OTP code found for ${phoneNumber}`);
        return false;
    } else if (doc.code === code && doc.expirationTime >= new Date().getTime()) {
        console.log(`Valid OTP code ${code} for ${phoneNumber}`);
        // Code is valid, authenticate the user and invalidate the code
        await OTP.deleteOne({ phoneNumber });
        console.log(`Deleted OTP code ${code} for ${phoneNumber}`);
        return true;
    } else {
        console.log(`Invalid OTP code ${code} for ${phoneNumber}`);
        return false;
    }
}

module.exports = router;