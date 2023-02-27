const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

const itinerarySchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: ObjectID,
    travelGuideId: [ObjectID],
    public: Boolean,
    rating: Number,
    ratingCount: Number,
    imageUrl: String,
});

const Itinerary = new mongoose.model('Itinerary', itinerarySchema);


module.exports = Itinerary;