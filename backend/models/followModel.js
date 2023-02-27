const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

const followSchema = new mongoose.Schema({
    followerId: ObjectID,
    followedId: ObjectID,
});

const Follow = new mongoose.model('Follow', followSchema);

module.exports = Follow;