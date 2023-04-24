const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

const travelGuideSchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: ObjectId,
    audioUrl: String,
    imageUrl: String,
    audioLength: Number,
    placeId: String,
    public: Boolean,
    locationName: String,
    coordinates: {
        lat: Number,
        lng: Number
    }
});


const TravelGuide = new mongoose.model('TravelGuide', travelGuideSchema);

module.exports = TravelGuide;