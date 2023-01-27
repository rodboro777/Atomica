const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

const travelGuideRequestSchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: ObjectID,
    audioUrl: String,
    imageUrl: String,
    audioLength: Number,
    placeId: String,
});

const TravelGuideRequest = new mongoose.model('TravelGuideRequest', travelGuideRequestSchema);

module.exports = TravelGuideRequest;