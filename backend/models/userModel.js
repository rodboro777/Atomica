const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    googleId: String,
    password: String,
    firstName: String,
    lastName: String,
    description: String,
    country: String,
    phone: String,
    imageUrl: String,
    numberOfTravelGuidesCreated: Number,
    numberOfItinerariesCreated: Number,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

module.exports = User;