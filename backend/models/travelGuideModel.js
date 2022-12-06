const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

const travelGuideSchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: ObjectID,
    audioUrl: String,
    imageUrl: String,
    audioLength: Number,
    placeId: String,
    public: Boolean,
});


const TravelGuide = new mongoose.model('TravelGuide', travelGuideSchema);

module.exports = TravelGuide;